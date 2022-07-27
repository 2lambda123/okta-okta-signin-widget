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

import { Box } from '@mui/material';
import { FunctionComponent, h } from 'preact';
import { useEffect } from 'preact/hooks';

import { useFormContext } from '../../contexts';
import {
  ButtonElement,
  ButtonType,
  StepperLayout,
  UISchemaElement,
  UISchemaElementComponent,
  UISchemaLayout,
  UISchemaLayoutType,
} from '../../types';
import { isDevelopmentEnvironment, isTestEnvironment } from '../../util';
import renderers from './renderers';
// eslint-disable-next-line import/no-cycle
import Stepper from './Stepper';

type LayoutProps = {
  uischema: UISchemaLayout;
};

const Layout: FunctionComponent<LayoutProps> = ({ uischema }) => {
  const { submissionOptionsRef } = useFormContext();
  const { type, elements } = uischema;

  // track submission options in form, which will be used when form onSubmit event is triggered
  // one form should not have more than one submit button
  useEffect(() => {
    // eslint-disable-next-line max-len
    const submitButton = elements.find((element) => (element as ButtonElement).options?.type === ButtonType.SUBMIT) as ButtonElement;
    if (submitButton) {
      submissionOptionsRef.current = submitButton.options;
    }
  }, [elements, submissionOptionsRef]);

  const flexDirection = type === UISchemaLayoutType.HORIZONTAL ? 'row' : 'column';
  return (
    <Box
      display="flex"
      flexDirection={flexDirection}
    >
      {
        elements.map((element, index) => {
          const elementKey = `${element.type}_${index}`;

          if (element.type === UISchemaLayoutType.STEPPER) {
            return (
              <Stepper
                key={elementKey}
                uischema={element as StepperLayout}
              />
            );
          }

          if ([UISchemaLayoutType.HORIZONTAL, UISchemaLayoutType.VERTICAL]
            .includes((element as UISchemaLayout).type)) {
            return (
              <Layout
                key={elementKey}
                uischema={element as UISchemaLayout}
              />
            );
          }

          const renderer = renderers.find((r) => r.tester(element));
          if (!renderer) {
            // TODO: for now do not render for unmatch render object
            // remove unnecessary uischema in future refactor and throw error
            // throw new Error(`Failed to find render component for uischema: ${JSON.stringify(element)}`);
            if (isDevelopmentEnvironment() || isTestEnvironment()) {
              console.warn(`Failed to find render component for uischema: ${JSON.stringify(element)}`);
            }
            return null;
          }

          const Component = renderer.renderer as UISchemaElementComponent;
          return (
            <Box
              key={elementKey}
              marginBottom={4}
            >
              <Component uischema={element as UISchemaElement} />
            </Box>
          );
        })
      }
    </Box>
  );
};

export default Layout;
