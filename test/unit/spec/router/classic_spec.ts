import { routerClassFactory } from '../../../../src/router/classic';
import V1Router from '../../../../src/v1/LoginRouter';
import { ConfigError } from '../../../../src/util/Errors';

describe('classic router class factory', () => {

  describe('okta-hosted or non-OAuth config', () => {

    it('default: creates a V1 router', () => {
      const Router = routerClassFactory({});
      expect(Router).toBe(V1Router);
    });
  
    it('V1 stateToken: creates a V1 router', () => {
      const Router = routerClassFactory({
        stateToken: '00abc' // V1 tokens start with "00"
      });
      expect(Router).toBe(V1Router);
    });


    it('V2 stateToken: throws an error', () => {
      const expectedError = new ConfigError('This version of the Sign-in Widget only supports Classic Engine');
      const fn = () => {
        return routerClassFactory({
          stateToken: 'abc' // V2 tokens can be any string, not starting with "00"
        });
      };

      expect(fn).toThrow(expectedError);
    });

    it('proxyIdxResponse: throws an error', () => {
      const expectedError = new ConfigError('This version of the Sign-in Widget only supports Classic Engine');
      const fn = () => {
        return routerClassFactory({
          proxyIdxResponse: {}
        });
      };

      expect(fn).toThrow(expectedError);
    });
  });

  describe('OAuth config', () => {
    it('default: creates a V1 router', () => {
      const Router = routerClassFactory({
        clientId: 'abc'
      });
      expect(Router).toBe(V1Router);
    });
    it('"useClassicEngine" option: ignored', () => {
      const Router = routerClassFactory({
        clientId: 'abc',
        useClassicEngine: false
      });
      expect(Router).toBe(V1Router);
    });
  });

});
