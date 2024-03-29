/*
 * Copyright (c) 2022-present, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

import { createAuthJsPayloadArgs, setup } from './util';

import mockResponse from '../../src/mocks/response/idp/idx/challenge/verify-ov-push-method.json';

describe('authenticator-verification-okta-verify-push', () => {
  it('should render form', async () => {
    const { container, findByText } = await setup({ mockResponse });
    await findByText(/Get a push notification/);
    expect(container).toMatchSnapshot();
  });

  it('should send correct payload with autoChallenge = true', async () => {
    const {
      authClient, user, findByText, findByLabelText,
    } = await setup({ mockResponse });

    await findByText(/Get a push notification/);
    await findByText(/Send push automatically/);

    const submitButton = await findByText('Send push', { selector: 'button' });
    const autoChallengeCheckbox = await findByLabelText(/Send push automatically/);
    await user.click(autoChallengeCheckbox);
    await user.click(submitButton);

    expect(authClient.options.httpRequestClient).toHaveBeenCalledWith(
      ...createAuthJsPayloadArgs('POST', 'idp/idx/challenge', {
        authenticator: {
          autoChallenge: true,
          methodType: 'push',
          id: 'aut2h3fft4y9pDPCS1d7',
        },
      }),
    );
  });

  it('should send correct payload with autoChallenge = false', async () => {
    const {
      authClient, user, findByText, findByLabelText,
    } = await setup({ mockResponse });

    await findByText(/Get a push notification/);

    const submitButton = await findByText('Send push', { selector: 'button' });

    const autoChallengeCheckbox = await findByLabelText(/Send push automatically/);
    // click checkbox twice to end up with a false value
    await user.click(autoChallengeCheckbox);
    await user.click(autoChallengeCheckbox);
    // submit form
    await user.click(submitButton);

    expect(authClient.options.httpRequestClient).toHaveBeenCalledWith(
      ...createAuthJsPayloadArgs('POST', 'idp/idx/challenge', {
        authenticator: {
          autoChallenge: false,
          methodType: 'push',
          id: 'aut2h3fft4y9pDPCS1d7',
        },
      }),
    );
  });
});
