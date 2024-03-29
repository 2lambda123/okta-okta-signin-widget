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

import { loc } from '../../util';

export const LocationIcon: FunctionComponent = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-hidden="true"
  >
    <title>
      {loc('icon.title.location', 'login')}
    </title>
    <path
      d="M2.5 6C2.5 2.88969 4.95673 0.5 8 0.5C11.0433 0.5 13.5 2.88969 13.5 6C13.5 8.17828 12.3122 10.408 10.9484 12.2145C9.81608 13.7144 8.61136 14.859 8.0028 15.3649C7.39633 14.8508 6.1897 13.6812 5.05432 12.1652C3.68717 10.3398 2.5 8.11236 2.5 6Z"
      stroke="#1662DD"
      class="siwIconStrokePrimary"
    />
    <circle
      cx="8"
      cy="6"
      r="2.5"
      stroke="#1662DD"
      class="siwIconStrokePrimary"
    />
  </svg>
);
