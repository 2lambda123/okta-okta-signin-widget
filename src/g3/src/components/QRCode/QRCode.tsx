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

import { Box } from '@mui/material';
import { withTheme } from '@okta/odyssey-react-theme';
import { h } from 'preact';
import { QRCodeElement, UISchemaElementComponent } from 'src/types';

import { getTranslation } from '../../util';
import { theme } from './QRCode.theme';
import styles from './styles.module.css';

const QRCode: UISchemaElementComponent<{
  uischema: QRCodeElement
}> = ({
  uischema,
}) => {
  const label = getTranslation(uischema.translations!, 'label');
  return (
    <Box className={styles.qrContainer}>
      <img
        class={styles.qrImg}
        src={uischema.options?.data}
        alt={label}
      />
    </Box>
  );
};

export default withTheme(theme, styles)(QRCode);
