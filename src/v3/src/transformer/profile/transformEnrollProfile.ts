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

import { IDX_STEP, PASSWORD_REQUIREMENT_VALIDATION_DELAY_MS } from '../../constants';
import {
  ButtonElement,
  ButtonType,
  DescriptionElement,
  FieldElement,
  IdxStepTransformer,
  LinkElement,
  PasswordRequirementsData,
  PasswordRequirementsElement,
  TitleElement,
  UISchemaElement,
  UISchemaLayoutType,
} from '../../types';
import { getUserInfo, loc } from '../../util';
import { buildPasswordRequirementListItems } from '../password';
import { getUIElementWithName } from '../utils';

export const transformEnrollProfile: IdxStepTransformer = ({ transaction, formBag }) => {
  const { availableSteps, nextStep: { relatesTo } = {} } = transaction;
  const { uischema } = formBag;

  // If passcode exists in elements, add password requirements element to Ui
  const passwordElement = getUIElementWithName(
    'credentials.passcode',
    uischema.elements as UISchemaElement[],
  ) as FieldElement;
  if (passwordElement) {
    passwordElement.options = {
      ...passwordElement.options,
      attributes: {
        ...passwordElement.options?.attributes,
        autocomplete: 'new-password',
      },
    };
    const passwordSettings = (relatesTo?.value?.settings || {}) as PasswordRequirementsData;
    const passwordRequirementsElement: PasswordRequirementsElement = {
      type: 'PasswordRequirements',
      options: {
        id: 'password-authenticator--list',
        header: loc('password.complexity.requirements.header', 'login'),
        userInfo: getUserInfo(transaction),
        settings: passwordSettings,
        requirements: buildPasswordRequirementListItems(passwordSettings),
        validationDelayMs: PASSWORD_REQUIREMENT_VALIDATION_DELAY_MS,
      },
    };
    uischema.elements.unshift(passwordRequirementsElement);
  }

  const titleElement: TitleElement = {
    type: 'Title',
    options: { content: loc('oie.registration.form.title', 'login') },
  };

  const submitBtnElement: ButtonElement = {
    type: 'Button',
    label: loc('oie.registration.form.submit', 'login'),
    options: {
      type: ButtonType.SUBMIT,
      step: transaction.nextStep!.name,
    },
  };

  uischema.elements.unshift(titleElement);
  uischema.elements.push(submitBtnElement);

  const selectIdentifyStep = availableSteps?.find(({ name }) => name === IDX_STEP.SELECT_IDENTIFY);
  if (selectIdentifyStep) {
    uischema.elements.push({
      type: 'Divider',
    });
    const { name: step } = selectIdentifyStep;
    const signinLink: LinkElement = {
      type: 'Link',
      options: {
        label: loc('signin', 'login'),
        step,
      },
    };
    const signinLabel: DescriptionElement = {
      type: 'Description',
      options: {
        content: loc('haveaccount', 'login'),
      },
    };
    const loginEntryLayout = {
      type: UISchemaLayoutType.HORIZONTAL,
      elements: [signinLabel, signinLink],
    };

    uischema.elements.push(loginEntryLayout);
  }

  return formBag;
};