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

import { Box, FormHelperText } from '@mui/material';
import { PasswordInput } from '@okta/odyssey-react-mui';
import { h } from 'preact';
import { useState } from 'preact/hooks';

import { getMessage } from '../../../../v2/ion/i18nTransformer';
import { useOnChange, useOnValidate, useValue } from '../../hooks';
import { ChangeEvent, FieldElement, UISchemaElementComponent } from '../../types';
import { getLabelName } from '../helpers';

const InputPassword: UISchemaElementComponent<{
  uischema: FieldElement
}> = ({ uischema }) => {
  const [isTouched, setIsTouched] = useState<boolean>(false);
  const [fieldError, setFieldError] = useState<string | undefined>();
  const value = useValue(uischema);
  const onChangeHandler = useOnChange(uischema);
  const onValidateHandler = useOnValidate(uischema);
  const { label } = uischema;
  const {
    attributes,
    inputMeta: {
      // @ts-ignore expose type from auth-js
      messages = {},
      name,
    },
  } = uischema.options;
  const error = messages?.value?.[0] && getMessage(messages.value[0]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIsTouched(true);
    onChangeHandler(e.currentTarget.value);
    onValidateHandler(setFieldError, e.currentTarget.value);
  };

  const handleInputBlur = () => {
    setIsTouched(true);
    onValidateHandler(setFieldError);
  };

  return (
    <Box>
      <PasswordInput
        label={getLabelName(label!)}
        value={value}
        name={name}
        id={name}
        error={!!(error || (isTouched && fieldError))}
        onBlur={handleInputBlur}
        onChange={handleChange}
        fullWidth
        inputProps={{
          'data-se': name,
          ...attributes,
        }}
      />
      {(error || (isTouched && fieldError)) && (
        <FormHelperText
          data-se={`${name}-error`}
          error
        >
          {error || fieldError}
        </FormHelperText>
      )}
    </Box>

  );
};

export default InputPassword;
