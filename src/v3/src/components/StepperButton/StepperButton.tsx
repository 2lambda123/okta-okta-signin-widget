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

import { Button } from '@mui/material';
import { h } from 'preact';

import { useStepperContext } from '../../contexts';
import { useAutoFocus } from '../../hooks';
import { StepperButtonElement, UISchemaElementComponent } from '../../types';

const StepperButton: UISchemaElementComponent<{
  uischema: StepperButtonElement
}> = ({ uischema }) => {
  const { setStepIndex } = useStepperContext();
  const {
    label,
    focus,
    options: {
      nextStepIndex,
      variant,
    },
  } = uischema;

  const focusRef = useAutoFocus(focus);

  const handleClick = () => {
    setStepIndex!(nextStepIndex);
  };

  return (
    <Button
      onClick={handleClick}
      variant={variant ?? 'primary'}
      type="button"
      fullWidth
      ref={focusRef}
    >
      {label}
    </Button>
  );
};

export default StepperButton;