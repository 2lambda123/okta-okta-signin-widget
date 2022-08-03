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
  StepperLayout,
  UISchemaElement,
  UISchemaLayout,
  UISchemaLayoutType,
} from '../../types';

type PredicateFn = (uischema: UISchemaElement) => boolean;
type MapFn = (uischema: UISchemaElement) => UISchemaElement;
type Options = {
  layout: UISchemaLayout;
  mapFn: MapFn;
  predicateFn?: PredicateFn; // update all elements when predicateFn is not assigned
};

export const updateElementsInLayout = (options: Options) => {
  const fn = (
    layout: UISchemaLayout,
    mapFn: MapFn,
    predicateFn: PredicateFn = () => true,
  ): UISchemaLayout => {
    // eslint-disable-next-line no-param-reassign
    layout.elements = layout.elements.map((element) => {
      const { type } = element;
      if (type === UISchemaLayoutType.STEPPER) {
        // eslint-disable-next-line no-param-reassign
        (element as StepperLayout).elements = (element as StepperLayout).elements
          .map((el) => fn(el, mapFn, predicateFn));
        return element;
      }

      if ([UISchemaLayoutType.HORIZONTAL, UISchemaLayoutType.VERTICAL]
        .includes(type as UISchemaLayoutType)) {
        return fn(element as UISchemaLayout, mapFn, predicateFn);
      }

      if (predicateFn(element)) {
        return mapFn(element);
      }

      return element;
    });

    return layout;
  };

  return fn(options.layout, options.mapFn, options.predicateFn);
};
