const CONFIG_LOCAL = require('./local.json');
const CONFIG_DEV = require('./developing.json');
const CONFIG_PRODUCTION = require('./production.json');
const CONFIG_CUSTOM = require('./custom.json');

export default class ClientConfig {
  static LOCAL = CONFIG_LOCAL;

  static DEV = CONFIG_DEV;

  static PRODUCTION = CONFIG_PRODUCTION;

  static CUSTOM = CONFIG_CUSTOM;

  static CURRENT_CONFIG = ClientConfig.LOCAL;

  static setConfiguration(config) {
    ClientConfig.CURRENT_CONFIG = config;
  }

  static get() {
    return ClientConfig.CURRENT_CONFIG;
  }
}
