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

import { IDX_STEP } from 'src/constants';
import { getStubTransactionWithNextStep } from 'src/mocks/utils/utils';
import {
  FormBag,
  UISchemaElement,
  UISchemaLayoutType,
  WidgetProps,
} from 'src/types';

import { transformGoogleAuthenticatorEnroll } from '.';

describe('Google Authenticator Enroll Transformer Tests', () => {
  const transaction = getStubTransactionWithNextStep();
  const widgetProps: WidgetProps = {};
  let formBag: FormBag;

  beforeEach(() => {
    formBag = {
      dataSchema: {},
      schema: {},
      uischema: {
        type: UISchemaLayoutType.VERTICAL,
        elements: [{
          type: 'Field',
          name: 'credentials.passcode',
        } as UISchemaElement],
      },
      data: {},
    };
  });

  it('should not modify formBag when Idx response does not include QR Code', () => {
    transaction.nextStep = {
      name: IDX_STEP.ENROLL_AUTHENTICATOR,
    };
    expect(transformGoogleAuthenticatorEnroll({ transaction, formBag, widgetProps })).toBe(formBag);
  });

  it('should add Stepper layout to UI Schema elements '
    + 'when GA Enroll params exists in Idx response', () => {
    transaction.nextStep = {
      name: IDX_STEP.ENROLL_AUTHENTICATOR,
      relatesTo: {
        value: {
          displayName: 'google auth',
          id: '',
          key: 'google_otp',
          methods: [],
          type: '',
          contextualData: {
            sharedSecret: 'ABC123DEF456',
            qrcode: {
              href: '#mockhref',
              method: 'mockmethod',
              type: 'mocktype',
            },
          },
        },
      },
    };
    const updatedFormBag = transformGoogleAuthenticatorEnroll({
      transaction, formBag, widgetProps,
    });
    expect(updatedFormBag).toMatchSnapshot();
  });
});