/*!
 * Copyright (c) 2021, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

// BaseLoginRouter contains the more complicated router logic - rendering/
// transition, etc. Most router changes should happen in LoginRouter (which is
// responsible for adding new routes)

import idx from '@okta/okta-idx-js';

import { getTransactionMeta, saveTransactionMeta } from './transactionMeta';

// Begin or resume a transaction using an interactionHandle
export async function interact (settings) {

  const authClient = settings.getAuthClient();
  let meta = await getTransactionMeta(settings);

  // These properties are always loaded from meta (or calculated fresh)
  const {
    interactionHandle,
    codeVerifier,
    codeChallenge,
    codeChallengeMethod
  } = meta;

  // These properties are defined by global configuration
  const { issuer, clientId, redirectUri } = authClient.options;
  const version = settings.get('apiVersion');

  // These properties can be set in configuration, but also have a default.
  let state;
  let scopes;
  if (!interactionHandle) {
    // new transaction: prefer configured values
    // TODO: remove dependency on authParams. OKTA-373096
    state = settings.get('authParams.state') || authClient.options.state || meta.state;
    scopes = authClient.options.scopes || meta.scopes;
  } else {
    // saved transaction: use only saved values
    state = meta.state;
    scopes = meta.scopes;
  }

  return idx.start({
    // if interactionHandle is undefined here, idx will bootstrap a new interactionHandle
    interactionHandle,
    version,

    // OAuth
    clientId, 
    issuer,
    scopes,
    state,
    redirectUri,

    // PKCE
    codeVerifier,
    codeChallenge,
    codeChallengeMethod
  })
    .then(response => {
      // If this is a new transaction an interactionHandle was returned
      if (!interactionHandle && response.toPersist.interactionHandle) {
        meta = Object.assign({}, meta, {
          interactionHandle: response.toPersist.interactionHandle
        });
      }

      // Save transaction meta so it can be resumed
      saveTransactionMeta(settings, meta);


      // return idx response
      return response;
    });
}
