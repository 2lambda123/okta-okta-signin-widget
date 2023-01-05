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
import {
  List as ListOdyssey,
  Text,
} from '@okta/odyssey-react';
import { h } from 'preact';
import { ListElement, UISchemaElementComponent } from 'src/types';

const List: UISchemaElementComponent<{
  uischema: ListElement
}> = ({ uischema }) => {
  const { options } = uischema;

  return options.items?.length ? (
    <Box
      display="flex"
      justifyContent="flex-start"
      marginBottom={4}
    >
      { options.description && <Text as="p">{options.description}</Text> }
      <ListOdyssey listType={options.type ?? 'unordered'}>
        {
          options.items.map((item: string) => (
            <ListOdyssey.Item key={item}>{item}</ListOdyssey.Item>
          ))
        }
      </ListOdyssey>
    </Box>
  ) : null;
};

export default List;
