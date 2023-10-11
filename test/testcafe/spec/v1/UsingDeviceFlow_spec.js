import {RequestMock, RequestLogger, ClientFunction} from 'testcafe';
import DeviceCodeActivatePageObject from '../../framework/page-objects-v1/DeviceCodeActivatePageObject';
import IdentityPageObject from '../../framework/page-objects/IdentityPageObject';

import legacyDeviceCodeActivateResponse from '../../../../playground/mocks/data/api/v1/authn/device-code-activate.json';
import legacyUnauthenticatedWithUsingDeviceFlow from '../../../../playground/mocks/data/api/v1/authn/unauthenticated-using-device-flow.json';
import legacyUnauthenticated from '../../../../playground/mocks/data/api/v1/authn/unauthenticated.json';
import idpForceResponseLinkedInIdP from '../../../../playground/mocks/data/.well-known/webfinger/forced-idp-discovery-linkedin-idp.json';
import idpForceResponseOktaIdP from '../../../../playground/mocks/data/.well-known/webfinger/forced-idp-discovery-okta-idp.json';

// Legacy mocks
const legacyDeviceCodeIdpCheckWithRedirectionMock = RequestMock()
  .onRequestTo('http://localhost:3000/api/v1/authn/introspect')
  .respond(legacyDeviceCodeActivateResponse)
  .onRequestTo('http://localhost:3000/api/v1/authn/device/activate')
  .respond(legacyUnauthenticatedWithUsingDeviceFlow)
  .onRequestTo('http://localhost:3000/.well-known/webfinger?resource=okta%3Aacct%3A&requestContext=aStateToken')
  .respond(idpForceResponseLinkedInIdP)
  .onRequestTo('http://localhost:3000/sso/idps/0oa4onxsxfUDwUb8u0g4?stateToken=00lpyQXxOMfE0lbVM1vEY4u3usVvlmkK5rDx69GQgb&login_hint=#')
  .respond('<html><h1>An external IdP login page for testcafe testing</h1></html>');

const legacyDeviceCodeForceIdpCheckWithoutRedirectionMock = RequestMock()
  .onRequestTo('http://localhost:3000/api/v1/authn/introspect')
  .respond(legacyDeviceCodeActivateResponse)
  .onRequestTo('http://localhost:3000/api/v1/authn/device/activate')
  .respond(legacyUnauthenticatedWithUsingDeviceFlow)
  .onRequestTo('http://localhost:3000/.well-known/webfinger?resource=okta%3Aacct%3A&requestContext=aStateToken')
  .respond(idpForceResponseOktaIdP);

const legacyDeviceCodeForceIdpCheckWithoutRedirectionAndErrorMock = RequestMock()
  .onRequestTo('http://localhost:3000/api/v1/authn/introspect')
  .respond(legacyDeviceCodeActivateResponse)
  .onRequestTo('http://localhost:3000/api/v1/authn/device/activate')
  .respond(legacyUnauthenticatedWithUsingDeviceFlow)
  .onRequestTo('http://localhost:3000/.well-known/webfinger?resource=okta%3Aacct%3A&requestContext=aStateToken')
  .respond(idpForceResponseOktaIdP, 400);

const legacyDeviceCodeShowLoginMock = RequestMock()
  .onRequestTo('http://localhost:3000/api/v1/authn/introspect')
  .respond(legacyDeviceCodeActivateResponse)
  .onRequestTo('http://localhost:3000/api/v1/authn/device/activate')
  .respond(legacyUnauthenticated);

const legacyDeviceCodeShowLoginMockWithUsingDeviceFlow = RequestMock()
  .onRequestTo('http://localhost:3000/api/v1/authn/introspect')
  .respond(legacyDeviceCodeActivateResponse)
  .onRequestTo('http://localhost:3000/api/v1/authn/device/activate')
  .respond(legacyUnauthenticatedWithUsingDeviceFlow)
  .onRequestTo('http://localhost:3000/sso/idps/0oaaix1twko0jyKik0g1?stateToken=aStateToken')
  .respond('<html><h1>An external IdP login page for testcafe testing</h1></html>');

const legacyDeviceCodeShowLoginMockWithoutDeviceFlow = RequestMock()
  .onRequestTo('http://localhost:3000/api/v1/authn/introspect')
  .respond(legacyDeviceCodeActivateResponse)
  .onRequestTo('http://localhost:3000/api/v1/authn/device/activate')
  .respond(legacyUnauthenticated)
  .onRequestTo('http://localhost:3000/sso/idps/0oaaix1twko0jyKik0g1?stateToken=aStateToken')
  .respond('<html><h1>An external IdP login page for testcafe testing</h1></html>');


const requestLogger = RequestLogger(
  /api\/v1/,
  {
    logRequestBody: true,
    stringifyRequestBody: true,
  }
);

const rerenderWidget = ClientFunction((settings) => {
  window.renderPlaygroundWidget(settings);
});

fixture('IDP Discovery force');

async function setup(t) {
  const deviceCodeActivatePage = new DeviceCodeActivatePageObject(t);
  await deviceCodeActivatePage.navigateToPage();
  requestLogger.clear();
  return deviceCodeActivatePage;
}

test.requestHooks(requestLogger, legacyDeviceCodeIdpCheckWithRedirectionMock)('force idp discovery after device activate and redirect to idp', async t => {
  const deviceCodeActivatePageObject = await setup(t);
  await rerenderWidget({
    stateToken: '00-dummy-state-token', //start with 00 to render legacy sign in widget
  });

  // submit user code
  await deviceCodeActivatePageObject.setActivateCodeTextBoxValue('ABCDWXYZ');
  await deviceCodeActivatePageObject.clickNextButton();

  const pageUrl = await deviceCodeActivatePageObject.getPageUrl();
  await t.expect(pageUrl)
    .eql('http://localhost:3000/sso/idps/0oa4onxsxfUDwUb8u0g4?stateToken=00lpyQXxOMfE0lbVM1vEY4u3usVvlmkK5rDx69GQgb&login_hint=#');
});

test.requestHooks(requestLogger, legacyDeviceCodeIdpCheckWithRedirectionMock)('force idp discovery after device activate w/idp discovery feature and redirect to idp', async t => {
  const deviceCodeActivatePageObject = await setup(t);
  await rerenderWidget({
    stateToken: '00-dummy-state-token', //start with 00 to render legacy sign in widget
    features: {
      idpDiscovery: true
    }
  });

  // submit user code
  await deviceCodeActivatePageObject.setActivateCodeTextBoxValue('ABCDWXYZ');
  await deviceCodeActivatePageObject.clickNextButton();

  const pageUrl = await deviceCodeActivatePageObject.getPageUrl();
  await t.expect(pageUrl)
    .eql('http://localhost:3000/sso/idps/0oa4onxsxfUDwUb8u0g4?stateToken=00lpyQXxOMfE0lbVM1vEY4u3usVvlmkK5rDx69GQgb&login_hint=#');
});

test.requestHooks(requestLogger, legacyDeviceCodeForceIdpCheckWithoutRedirectionAndErrorMock)('force idp discovery after device activate and error route to default route', async t => {
  const deviceCodeActivatePageObject = await setup(t);
  await rerenderWidget({
    stateToken: '00-dummy-state-token', //start with 00 to render legacy sign in widget
  });

  // submit user code
  await deviceCodeActivatePageObject.setActivateCodeTextBoxValue('ABCDWXYZ');
  await deviceCodeActivatePageObject.clickNextButton();
  await t.expect(deviceCodeActivatePageObject.getFormTitle()).eql('Sign In');
  await t.expect(deviceCodeActivatePageObject.isUserNameFieldVisible()).eql(true);
  await t.expect(deviceCodeActivatePageObject.isPasswordFieldVisible()).eql(true);
});

test.requestHooks(requestLogger, legacyDeviceCodeForceIdpCheckWithoutRedirectionAndErrorMock)('force idp discovery after device activate w/idp discovery and error route to default route', async t => {
  const deviceCodeActivatePageObject = await setup(t);
  await rerenderWidget({
    stateToken: '00-dummy-state-token', //start with 00 to render legacy sign in widget
    features: {
      idpDiscovery: true
    }
  });

  // submit user code
  await deviceCodeActivatePageObject.setActivateCodeTextBoxValue('ABCDWXYZ');
  await deviceCodeActivatePageObject.clickNextButton();
  await t.expect(deviceCodeActivatePageObject.getFormTitle()).eql('Sign In');
  await t.expect(deviceCodeActivatePageObject.isUserNameFieldVisible()).eql(true);
  await t.expect(deviceCodeActivatePageObject.isPasswordFieldVisible()).eql(false);
});

test.requestHooks(requestLogger, legacyDeviceCodeForceIdpCheckWithoutRedirectionMock)('force idp discovery after device activate and show username and password', async t => {
  const deviceCodeActivatePageObject = await setup(t);
  await rerenderWidget({
    stateToken: '00-dummy-state-token', //start with 00 to render legacy sign in widget
  });

  // submit user code
  await deviceCodeActivatePageObject.setActivateCodeTextBoxValue('ABCDWXYZ');
  await deviceCodeActivatePageObject.clickNextButton();
  await t.expect(deviceCodeActivatePageObject.getFormTitle()).eql('Sign In');
  await t.expect(deviceCodeActivatePageObject.isUserNameFieldVisible()).eql(true);
  await t.expect(deviceCodeActivatePageObject.isPasswordFieldVisible()).eql(true);
});

test.requestHooks(requestLogger, legacyDeviceCodeForceIdpCheckWithoutRedirectionMock)('force idp discovery after device activate w/idp discovery feature and show username', async t => {
  const deviceCodeActivatePageObject = await setup(t);
  await rerenderWidget({
    stateToken: '00-dummy-state-token', //start with 00 to render legacy sign in widget
    features: {
      idpDiscovery: true
    }
  });

  // submit user code
  await deviceCodeActivatePageObject.setActivateCodeTextBoxValue('ABCDWXYZ');
  await deviceCodeActivatePageObject.clickNextButton();
  await t.expect(deviceCodeActivatePageObject.getFormTitle()).eql('Sign In');
  await t.expect(deviceCodeActivatePageObject.isUserNameFieldVisible()).eql(true);
  await t.expect(deviceCodeActivatePageObject.isPasswordFieldVisible()).eql(false);
});

test.requestHooks(requestLogger, legacyDeviceCodeShowLoginMock)('no idp discovery after device activate and show username and password', async t => {
  const deviceCodeActivatePageObject = await setup(t);
  await rerenderWidget({
    stateToken: '00-dummy-state-token', //start with 00 to render legacy sign in widget
  });

  // submit user code
  await deviceCodeActivatePageObject.setActivateCodeTextBoxValue('ABCDWXYZ');
  await deviceCodeActivatePageObject.clickNextButton();
  await t.expect(deviceCodeActivatePageObject.getFormTitle()).eql('Sign In');
  await t.expect(deviceCodeActivatePageObject.isUserNameFieldVisible()).eql(true);
  await t.expect(deviceCodeActivatePageObject.isPasswordFieldVisible()).eql(true);
});

test.requestHooks(requestLogger, legacyDeviceCodeShowLoginMock)('idp discovery after device activate and show username only', async t => {
  const deviceCodeActivatePageObject = await setup(t);
  await rerenderWidget({
    stateToken: '00-dummy-state-token', //start with 00 to render legacy sign in widget
    features: {
      idpDiscovery: true
    }
  });

  // submit user code
  await deviceCodeActivatePageObject.setActivateCodeTextBoxValue('ABCDWXYZ');
  await deviceCodeActivatePageObject.clickNextButton();
  await t.expect(deviceCodeActivatePageObject.getFormTitle()).eql('Sign In');
  await t.expect(deviceCodeActivatePageObject.isUserNameFieldVisible()).eql(true);
  await t.expect(deviceCodeActivatePageObject.isPasswordFieldVisible()).eql(false);
});

test.requestHooks(requestLogger, legacyDeviceCodeShowLoginMockWithoutDeviceFlow)('social login after device activate and redirect with from uri', async t => {
  const deviceCodeActivatePageObject = await setup(t);
  const identityPage = new IdentityPageObject(t);
  await rerenderWidget({
    stateToken: '00-dummy-state-token', //start with 00 to render legacy sign in widget
    features: {
      idpDiscovery: true
    },
    idps: [
      {type: 'GOOGLE', id: '0oaaix1twko0jyKik0g1'}
    ]
  });

  // submit user code
  await deviceCodeActivatePageObject.setActivateCodeTextBoxValue('ABCDWXYZ');
  await deviceCodeActivatePageObject.clickNextButton();
  await t.expect(deviceCodeActivatePageObject.getFormTitle()).eql('Sign In');
  await t.expect(deviceCodeActivatePageObject.isUserNameFieldVisible()).eql(true);
  await t.expect(deviceCodeActivatePageObject.isPasswordFieldVisible()).eql(false);
  await t.click('.social-auth-google-button');
  const pageUrl = await identityPage.getPageUrl();
  // using fromUri
  await t.expect(pageUrl).eql('http://localhost:3000/sso/idps/0oaaix1twko0jyKik0g1?fromURI=');
});

test.requestHooks(requestLogger, legacyDeviceCodeShowLoginMockWithUsingDeviceFlow)('social login after device activate and redirect with state token', async t => {
  const deviceCodeActivatePageObject = await setup(t);
  const identityPage = new IdentityPageObject(t);
  await rerenderWidget({
    stateToken: '00-dummy-state-token', //start with 00 to render legacy sign in widget
    features: {
      idpDiscovery: true
    },
    idps: [
      {type: 'GOOGLE', id: '0oaaix1twko0jyKik0g1'}
    ]
  });

  // await t.debug();

  // submit user code
  await deviceCodeActivatePageObject.setActivateCodeTextBoxValue('ABCDWXYZ');
  await deviceCodeActivatePageObject.clickNextButton();
  const widgetWindow = await t.getCurrentWindow();
  await t.expect(deviceCodeActivatePageObject.getFormTitle()).eql('Sign In');
  await t.expect(deviceCodeActivatePageObject.isUserNameFieldVisible()).eql(true);
  await t.expect(deviceCodeActivatePageObject.isPasswordFieldVisible()).eql(false);
  await t.click('.social-auth-google-button');
  // await t.switchToWindow(w => w.title !== widgetWindow.title);
  // const pageUrl = await identityPage.getPageUrl();
  const pageUrl = await t.eval(() => document.documentURI);
  // using stateToken
  await t.expect(pageUrl).eql('http://localhost:3000/sso/idps/0oaaix1twko0jyKik0g1?stateToken=aStateToken');
});