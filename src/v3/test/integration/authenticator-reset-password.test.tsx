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

import { setup, updateDynamicAttribute } from './util';

import mockResponse from '../../src/mocks/response/idp/idx/challenge/answer/password-reset.json';

describe('authenticator-reset-password', () => {
  it('should render form', async () => {
    const { container, findByText } = await setup({ mockResponse });
    await findByText(/Reset your password/);
    updateDynamicAttribute(container, ['aria-labelledby', 'id']);
    expect(container).toMatchSnapshot();
  });

  it('should render form with custom brand name', async () => {
    const { container, findByText } = await setup({
      mockResponse,
      widgetOptions: { brandName: 'Acme Corp' },
    });
    await findByText(/Reset your Acme Corp password/);
    updateDynamicAttribute(container, ['aria-labelledby', 'id']);
    expect(container).toMatchSnapshot();
  });

  it('should send correct payload', async () => {
    const {
      authClient, user, findByTestId, findByText,
    } = await setup({ mockResponse });

    await findByText(/Reset your password/);
    await findByText(/Password requirements/);

    const submitButton = await findByText('Reset Password', { selector: 'button' });
    const newPasswordEle = await findByTestId('credentials.passcode') as HTMLInputElement;
    const confirmPasswordEle = await findByTestId('credentials.confirmPassword') as HTMLInputElement;

    const password = 'superSecretP@ssword12';
    await user.type(newPasswordEle, password);
    await user.type(confirmPasswordEle, password);

    expect(newPasswordEle.value).toEqual(password);
    expect(confirmPasswordEle.value).toEqual(password);

    await user.click(submitButton);
    expect(authClient.options.httpRequestClient).toHaveBeenCalledWith(
      'POST',
      'https://oie-4695462.oktapreview.com/idp/idx/challenge/answer',
      {
        data: JSON.stringify({
          credentials: {
            passcode: password,
          },
          stateHandle: 'fake-stateHandle',
        }),
        headers: {
          Accept: 'application/json; okta-version=1.0.0',
          'Content-Type': 'application/json',
          'X-Okta-User-Agent-Extended': 'okta-auth-js/9.9.9',
        },
        withCredentials: true,
      },
    );
  });
});