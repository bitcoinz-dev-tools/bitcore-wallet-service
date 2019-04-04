'use strict';

var _ = require('lodash');
var $ = require('preconditions').singleton();
var log = require('npmlog');
log.debug = log.verbose;

var Insight = require('./blockchainexplorers/insight');
var Common = require('./common');
var Constants = Common.Constants,
  Defaults = Common.Defaults,
  Utils = Common.Utils;

var PROVIDERS = {
  'insight': {
    'btcz': {
      'livenet': 'https://btcz.rocks:443',
      'testnet': 'https://test.btcz.rocks:443',
    },
  },
};

function BlockChainExplorer(opts) {
  $.checkArgument(opts);

  var provider = opts.provider || 'insight';
  var coin = opts.coin || Defaults.COIN;
  var network = opts.network || 'livenet';

  $.checkState(PROVIDERS[provider], 'Provider ' + provider + ' not supported');
  $.checkState(_.includes(_.keys(PROVIDERS[provider]), coin), 'Coin ' + coin + ' not supported by this provider');
  $.checkState(_.includes(_.keys(PROVIDERS[provider][coin]), network), 'Network ' + network + ' not supported by this provider for coin ' + coin);

  var url = opts.url || PROVIDERS[provider][coin][network];

  switch (provider) {
    case 'insight':
      return new Insight({
        coin: coin,
        network: network,
        url: url,
        apiPrefix: opts.apiPrefix,
        userAgent: opts.userAgent,
      });
    default:
      throw new Error('Provider ' + provider + ' not supported.');
  };
};

module.exports = BlockChainExplorer;
