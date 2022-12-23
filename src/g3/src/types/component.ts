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

import { FunctionComponent } from 'preact';
import { StateUpdater } from 'preact/hooks';

import {
  ButtonElement,
  FieldElement,
  UISchemaElement,
} from './schema';

export type TesterFunction = (
  uiElement: UISchemaElement | FieldElement | ButtonElement
) => boolean;

export type UISchemaElementComponentWithValidationProps = {
  uischema: FieldElement;
  type?: string;
  setTouched?: StateUpdater<boolean>,
  errors?: string[],
  setErrors?: StateUpdater<string[] | undefined>,
  onValidateHandler?: (
    setErrors?: StateUpdater<string[] | undefined>,
    value?: string | boolean | number,
  ) => void,
  describedByIds?: string;
};

export type UISchemaElementComponentProps = {
  uischema: UISchemaElement;
};

export type UISchemaElementComponent<
  T = Record<string, unknown>,
> = FunctionComponent<UISchemaElementComponentProps & T>;

export type Renderer = {
  tester: TesterFunction;
  renderer: UISchemaElementComponent;
};
