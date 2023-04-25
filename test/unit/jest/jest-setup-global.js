import 'jest-canvas-mock';
import $ from 'jquery';
import jasmine from 'jasmine';
import fs from 'fs';
import path from 'path';
import '@inrupt/jest-jsdom-polyfills';
import { Crypto } from '@peculiar/webcrypto';

global.crypto = new Crypto();
global.$ = global.jQuery = $;
global.DEBUG = false;
global.getJasmineRequireObj = function jestSetupGlobalJasmine() {
  return jasmine;
};
global.jasmine = jasmine;
global.useJsdom = true;

navigator.credentials = {
  create: function() {
    return Promise.resolve({
      response: {}
    });
  },
  get: function() {
    return Promise.resolve({
      response: {}
    });
  }
};

// solve jquery 3 visible pseudos selector issue in jsdom
// https://github.com/jsdom/jsdom/issues/1048#issuecomment-401599392
// https://github.com/jsdom/jsdom/issues/1048#issuecomment-595961496
window.Element.prototype.getClientRects = function() {
  let node = this;
  while(node) {
    if(node === document) {
      break;
    }
    if (!node.style || node.style.display === 'none' || node.style.visibility === 'hidden') {
      return [];
    }
    node = node.parentNode;
  }
  
  return [{width: 1111, height: 1111}];
};

const css = fs.readFileSync(path.resolve(__dirname, '../../..' ,'target/css/okta-sign-in.css'), 'utf8');
$('head').append(`<style>${css}</style>`);

// prevent unhandled promise
process.on('unhandledRejection', console.error);
