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

import { Typography } from '@mui/material';
import { withTheme } from '@okta/odyssey-react-theme';
import classNames from 'classnames/bind';
import { FunctionComponent, h } from 'preact';
import { AuthCoinProps } from 'src/types';

import AuthCoin from '../AuthCoin/AuthCoin';
import AuthCoinByAuthenticatorKeyConfig from '../AuthCoin/AuthCoinConfig';
import { theme } from './AuthHeader.theme';
import style from './style.module.css';

const cx = classNames.bind(style);

// TODO: maybe extract to util class if used reused
const shouldRenderAuthCoin = (props?: AuthCoinProps): boolean => {
  const authCoinConfig = props?.authenticatorKey
    && AuthCoinByAuthenticatorKeyConfig[props?.authenticatorKey];

  return typeof authCoinConfig !== 'undefined'
    || typeof props?.url !== 'undefined';
};

export type AuthHeaderProps = {
  logo?: string;
  logoText?: string;
  brandName?: string;
  authCoinProps?: AuthCoinProps;
};
const AuthHeader: FunctionComponent<AuthHeaderProps> = ({
  logo,
  logoText,
  brandName,
  authCoinProps,
}) => {
  const showAuthCoin = shouldRenderAuthCoin(authCoinProps);
  const containerClasses = cx('okta-sign-in-header', 'auth-header', 'siwHeader', { authCoinSpacing: showAuthCoin });
  const imageClasses = cx('auth-org-logo', 'siwOrgLogo');

  function renderAuthCoin() {
    return (showAuthCoin && authCoinProps) && (
      <AuthCoin
        customClasses={[style.authCoinOverlay].flat()}
        authenticatorKey={authCoinProps.authenticatorKey}
        url={authCoinProps.url}
        theme={authCoinProps.theme}
      />
    );
  }

  return (
    <div className={containerClasses}>
      <Typography variant="h1">
        { logo && (
          <img
            alt={logoText || (logo && brandName ? brandName : 'Logo')}
            src={logo}
            className={imageClasses}
          />
        )}
      </Typography>
      { renderAuthCoin() }
    </div>
  );
};

export default withTheme(theme, style)(AuthHeader);
