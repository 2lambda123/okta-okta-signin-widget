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

import { Selector, fixture } from 'testcafe';

fixture('Theming')
  .page('http://localhost:3000/?siw-use-mocks=true&siw-mock-scenario=authenticator-verification-phone-sms');

test('Theme configuration applies correctly', async (t) => {
  const submitButton = Selector('button')
    .withAttribute('data-type', 'save');

  await t
    .expect(submitButton.getStyleProperty('background-color'))
    .eql('rgb(62, 0, 70)');

  // enter username/pw and submit
  await t
    .typeText("input[data-se='identifier']", 'testuser@okta.com')
    .typeText("input[data-se='credentials.passcode']", 'password')
    .click(submitButton);

  const buttonForPhoneAuth = Selector('button')
    .withText('Phone');
  const phoneAuthCoin = buttonForPhoneAuth
    .find('svg');

  await t
    .expect(phoneAuthCoin.find('.siwFillPrimaryDark').getStyleProperty('fill'))
    .eql('rgb(202, 0, 228)');
  await t
    .expect(phoneAuthCoin.find('.siwFillSecondary').getStyleProperty('fill'))
    .eql('rgb(241, 131, 255)');
}).clientScripts({
  content: `
  window.additionalOptions = {
    brandColors: {
      primaryColor: '#3e0046'
    }
  };
`,
});

// TODO OKTA-654743 enable/expose theme overrides on OktaSignIn configs
test.skip('should override text color based on MUI theme options override', async (t) => {
  const header = Selector('h2')
    .withText('Sign In');
  await t
    .expect(header.getStyleProperty('color'))
    .eql('rgb(40, 214, 187)');
}).clientScripts({
  content: `
    window.additionalOptions = {
      muiThemeOverrides: {
        palette: {
          text: { primary: '#28D6BB' },
        },
      }
    };
  `,
});
