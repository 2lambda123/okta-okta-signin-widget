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

import { FunctionComponent, h } from 'preact';

import { loc } from '../../util/locUtil';

export const DeviceIcon: FunctionComponent = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-hidden="true"
  >
    <title id="desktop-icon">
      {loc('icon.title.browser', 'login')}
    </title>
    <path
      d="M4.5 14.5H8M11.5 14.5H8M8 14.5V13"
      stroke="#1662DD"
      class="siwIconStrokePrimary"
    />
    <path
      d="M3 1.5H13C13.8284 1.5 14.5 2.17157 14.5 3V10C14.5 10.8284 13.8284 11.5 13 11.5H3C2.17157 11.5 1.5 10.8284 1.5 10V3C1.5 2.17157 2.17157 1.5 3 1.5Z"
      stroke="#1662DD"
      class="siwIconStrokePrimary"
    />
    <rect
      x="2"
      y="9"
      width="12"
      height="1"
      fill="#1662DD"
      class="siwIconFillPrimary"
    />
  </svg>
);
