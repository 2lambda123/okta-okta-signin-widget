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
  ButtonElement,
  ButtonType,
  DescriptionElement,
  FieldElement,
  IdxStepTransformer,
  TitleElement,
  UISchemaElement,
} from '../../types';
import { loc } from '../../util';
import { getUIElementWithName, removeUIElementWithName } from '../utils';

const TARGET_FIELD_NAME = 'authenticator.methodType';

export const transformEmailVerification: IdxStepTransformer = ({ transaction, formBag }) => {
  const { nextStep: { relatesTo } = {} } = transaction;
  const { uischema } = formBag;

  // Find methodType option, to use in btn params later
  const methodTypeElement = getUIElementWithName(
    TARGET_FIELD_NAME,
    uischema.elements,
  ) as FieldElement;

  // in this view, this option is not displayed and auto selected
  if (methodTypeElement) {
    uischema.elements = removeUIElementWithName(
      TARGET_FIELD_NAME,
      uischema.elements as UISchemaElement[],
    );
  }

  const titleElement: TitleElement = {
    type: 'Title',
    options: {
      content: loc('oie.email.mfa.title', 'login'),
    },
  };

  const redactedEmailAddress = relatesTo?.value?.profile?.email as string;
  const informationalText: DescriptionElement = {
    type: 'Description',
    options: {
      content: redactedEmailAddress
        ? loc('oie.email.verify.subtitleWithEmailAddress', 'login', [redactedEmailAddress])
        : loc('oie.email.verify.subtitleWithoutEmailAddress', 'login'),
    },
  };

  const submitButtonControl: ButtonElement = {
    type: 'Button',
    label: loc('oie.email.verify.primaryButton', 'login'),
    options: {
      type: ButtonType.SUBMIT,
      step: transaction.nextStep!.name,
      actionParams: {
        'authenticator.methodType': methodTypeElement.options.inputMeta.options?.[0].value as string,
      },
    },
  };

  // Title -> Descr -> Button
  uischema.elements.unshift(informationalText);
  uischema.elements.unshift(titleElement);
  uischema.elements.push(submitButtonControl);

  return formBag;
};
