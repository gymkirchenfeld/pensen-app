/**
 * Provides a Vue plugin for MSAL authentication.
 **/
import * as msal from '@azure/msal-browser';

class Msal {
  constructor() {
    const hostname = window.location.hostname;
    if (hostname === 'localhost') {
      this.backendServer = 'http://localhost:9001/';
    } else {
      this.backendServer = `https://api.${hostname}/`;
    }
  }

  findAccount() {
    const accounts = this.msalInstance.getAllAccounts();
    if (!accounts) return;
    for (let i = 0; i < accounts.length; ++i) {
      const account = accounts[i];
      if (this.tenantId == account.tenantId) return account;
    }
  }

  async initialize(callback) {
    await this.fetchConfiguration(callback);
    if (this.msalConfig) await this.initMsal(callback);
  }

  async fetchConfiguration(callback) {
    try {
      const url = `${this.backendServer}config`;
      const options = {
        cache: 'no-cache',
        method: 'GET',
      };
      const response = await fetch(url, options);
      if (!response.ok) {
        console.log(response);
      }
      const data = (await response.json()).result;
      this.tenantId = data.msal.tenantId;
      this.msalConfig = {
        auth: {
          authority:
            'https://login.microsoftonline.com/' + data.msal.tenantId + '/',
          clientId: data.msal.clientId,
        },
      };
      callback.configurated(data);
      this.tokenRefreshOffsetMinutes = data.tokenRefreshOffsetMinutes;
    } catch (error) {
      callback.noConnection();
    }
  }

  async initMsal(callback) {
    this.msalInstance = new msal.PublicClientApplication(this.msalConfig);
    const response = await this.msalInstance.handleRedirectPromise();
    if (response) {
      this.msalInstance.setActiveAccount(response.account);
      callback.loggedIn(response.account);
    } else {
      const account = this.findAccount();
      if (account) {
        this.msalInstance.setActiveAccount(account);
        callback.loggedIn(account);
      } else {
        this.login();
      }
    }
  }

  async getToken() {
    if (!this.msalConfig) return;
    const request = {
      scopes: [this.msalConfig.auth.clientId + '/.default'],
    };
    let response;
    try {
      response = await this.msalInstance.acquireTokenSilent(request);
    } catch (error) {
      this.login();
    }
    const now = new Date();
    const tokenValidityMs = response.expiresOn.getTime() - now.getTime();
    if (tokenValidityMs <= 0) return;
    const refreshTime =
      tokenValidityMs - this.tokenRefreshOffsetMinutes * 60000;
    clearTimeout(this.tokenRefreshTimer);
    this.tokenRefreshTimer = setTimeout(async () => {
      this.getToken();
    }, refreshTime);
    return response.accessToken;
  }

  async login() {
    const loc = window.location;
    const request = {
      redirectUri: loc.protocol + '//' + loc.host + '/',
      scopes: ['User.Read', 'openid', 'profile', 'offline_access', 'email'],
    };
    this.msalInstance.loginRedirect(request);
  }

  async logout() {
    clearTimeout(this.tokenRefreshTimer);
    this.msalInstance.logoutRedirect();
  }
}

const msalInstance = new Msal();

export default {
  async install(Vue) {
    Vue.prototype.$auth = msalInstance;
  },
};
