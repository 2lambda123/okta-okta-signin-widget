/*
 * Copyright (c) 2022-present, Okta, Inc. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant
 * to the Apache License, Version 2.0 (the "License.")
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { IdxTransaction } from '@okta/okta-auth-js';

import { InterstitialRedirectView } from '../../constants';
import {
  DescriptionElement,
  FormBag,
  RedirectElement,
  SpinnerElement,
  WidgetProps,
} from '../../types';
import { getAppInfo, getUserInfo, loc } from '../../util';
import { createForm } from '../utils';

export const redirectTransformer = (
  transaction: IdxTransaction,
  url: string,
  widgetProps: WidgetProps,
): FormBag => {
  const { interstitialBeforeLoginRedirect, features } = widgetProps;
  const formBag = createForm();

  const { uischema } = formBag;
  uischema.elements.push({
    type: 'Redirect',
    options: { url },
  } as RedirectElement);

  const appInfo = getAppInfo(transaction);
  const userInfo = getUserInfo(transaction);

  if (interstitialBeforeLoginRedirect === InterstitialRedirectView.DEFAULT) {
    uischema.elements.push({
      type: 'Spinner',
      // TODO: OKTA-518793 - replace english string with key once created
      options: { label: 'Loading...', valueText: 'Loading...' },
    } as SpinnerElement);
  }

  if (!interstitialBeforeLoginRedirect
    || interstitialBeforeLoginRedirect === InterstitialRedirectView.NONE) {
    uischema.elements.unshift({
      type: 'Description',
      contentType: 'subtitle',
      options: { content: loc('oie.success.text.signingIn.with.ellipsis', 'login') },
    } as DescriptionElement);
    return formBag;
  }

  const { label, name } = appInfo;
  const appName = label ?? name;
  const { identifier } = userInfo;

  // features.showIdentifier=true indicates we are already displaying identifier at the top of the form,
  // so no need to display again in the login text
  if (appName && identifier && !features?.showIdentifier) {
    uischema.elements.unshift({
      type: 'Description',
      contentType: 'subtitle',
      options: { content: loc('oie.success.text.signingIn.with.appName.and.identifier', 'login', [appName, identifier]) },
    } as DescriptionElement);
  } else if (appName) {
    uischema.elements.unshift({
      type: 'Description',
      contentType: 'subtitle',
      options: { content: loc('oie.success.text.signingIn.with.appName', 'login', [appName]) },
    } as DescriptionElement);
  } else {
    uischema.elements.unshift({
      type: 'Description',
      contentType: 'subtitle',
      options: { content: loc('oie.success.text.signingIn', 'login') },
    } as DescriptionElement);
  }

  return formBag;
};
