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

import {
  getI18nKey,
  getI18NParams,
} from '../../../../v2/ion/i18nTransformer';
import {
  AuthenticatorButtonElement,
  TransformStepFnWithOptions,
} from '../../types';
import { traverseLayout } from '../util';
import { addTranslation } from './util';

export const transformAuthenticatorButton: TransformStepFnWithOptions = ({
  transaction,
}) => (
  formbag,
) => {
  traverseLayout({
    layout: formbag.uischema,
    predicate: (element) => element.type === 'AuthenticatorButton',
    callback: (element) => {
      const { nextStep } = transaction;
      const { relatesTo, name: stepName } = nextStep!;
      const authenticatorKey = relatesTo?.value?.key;
      const params = getI18NParams(nextStep, authenticatorKey);

      // try get i18nKey without methodType
      let i18nKey = getI18nKey(`${stepName}.authenticator.${(element as AuthenticatorButtonElement).options.key}`);
      if (i18nKey) {
        addTranslation({
          element, name: 'label', i18nKey, params,
        });
        return;
      }

      // try get i18nKey with methodType
      const methodType = (
        element as AuthenticatorButtonElement
      ).options.authenticator?.methods?.[0]?.type;
      i18nKey = getI18nKey(`${stepName}.authenticator.${(element as AuthenticatorButtonElement).options.key}.${methodType}`);
      if (i18nKey) {
        addTranslation({
          element, name: 'label', i18nKey, params,
        });
        return;
      }

      // missing i18nKey, fallback to string in response
      addTranslation({
        element,
        name: 'label',
        i18nKey: '',
        defaultValue: element.label,
      });
    },
  });
  return formbag;
};