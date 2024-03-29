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

import { flow } from 'lodash';

import {
  ButtonElement,
  ButtonType,
  TransformStepFn,
} from '../../types';
import { traverseLayout } from '../util';

const addSubmission: TransformStepFn = (formbag) => {
  const { uischema, dataSchema } = formbag;

  let submitButtonsCount = 0;
  // update hasStepper flag while travesing the layout
  traverseLayout({
    layout: uischema,
    predicate: (element) => element.type === 'Button' && (element as ButtonElement).options?.type === ButtonType.SUBMIT,
    callback: () => {
      submitButtonsCount += 1;
    },
  });

  // track stepper submission option in custom layout step
  if (submitButtonsCount === 1) {
    traverseLayout({
      layout: uischema,
      predicate: (element) => element.type === 'Button' && (element as ButtonElement).options?.type === ButtonType.SUBMIT,
      callback: (element) => {
        dataSchema.submit = (element as ButtonElement).options;
      },
    });
  }

  if (submitButtonsCount > 1 && !dataSchema.submit) {
    throw new Error('dataSchema submit options should be set in custom layout');
  }

  return formbag;
};

export const transformDataSchema: TransformStepFn = (formbag) => flow(
  addSubmission,
)(formbag);
