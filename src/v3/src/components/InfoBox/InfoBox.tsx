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
  Alert,
  Box,
} from '@okta/odyssey-react-mui';
import { h } from 'preact';

import { useWidgetContext } from '../../contexts';
import {
  InfoboxElement,
  MessageType,
  MessageTypeVariant,
  UISchemaElementComponent,
} from '../../types';
import { getLinkReplacerFn } from '../../util';
import WidgetMessageContainer from '../WidgetMessageContainer';

const InfoBox: UISchemaElementComponent<{
  uischema: InfoboxElement
}> = ({ uischema }) => {
  const {
    loading,
  } = useWidgetContext();

  const {
    options: {
      message,
      class: messageClass,
      dataSe,
    },
  } = uischema;

  return loading ? null : (
    <Box
      marginBlockEnd={4}
      width={1}
      data-se="message"
    >
      <Alert
        severity={MessageTypeVariant[messageClass as MessageType] ?? MessageTypeVariant.INFO}
        variant="infobox"
        data-se={dataSe}
        className={`infobox-${messageClass.toLowerCase()}`}
      >
        {
          Array.isArray(message)
            ? message.map((msg) => (
              <Box
                marginBlockEnd={2}
                key={msg.message}
              >
                <WidgetMessageContainer
                  key={msg.message}
                  message={msg}
                  parserOptions={{ replace: getLinkReplacerFn({}, 'monochrome') }}
                  linkVariant="monochrome"
                />
              </Box>
            ))
            : (
              <WidgetMessageContainer
                message={message}
                linkVariant="monochrome"
              />
            )
        }
      </Alert>
    </Box>
  );
};

export default InfoBox;
