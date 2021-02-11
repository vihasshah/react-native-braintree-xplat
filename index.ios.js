// @flow

"use strict";

import { NativeModules, processColor } from "react-native";
import { mapParameters } from "./utils";

import type { IOSCardParameters } from "./types";

const RCTBraintree = NativeModules.Braintree;

var Braintree = {
  setupWithURLScheme(token, urlscheme) {
    return new Promise(function (resolve, reject) {
      RCTBraintree.setupWithURLScheme(token, urlscheme, function (success) {
        success == true ? resolve(true) : reject("Invalid Token");
      });
    });
  },

  setup(token) {
    return new Promise(function (resolve, reject) {
      RCTBraintree.setup(token, function (success) {
        success == true ? resolve(true) : reject("Invalid Token");
      });
    });
  },

  showPaymentViewController(config = {}) {
    var options = {
      tintColor: processColor(config.tintColor),
      bgColor: processColor(config.bgColor),
      barBgColor: processColor(config.barBgColor),
      barTintColor: processColor(config.barTintColor),
      callToActionText: config.callToActionText,
      title: config.title,
      description: config.description,
      amount: config.amount,
      threeDSecure: config.threeDSecure,
    };
    return new Promise(function (resolve, reject) {
      RCTBraintree.showPaymentViewController(options, function (err, nonce) {
        nonce != null ? resolve(nonce) : reject(err);
      });
    });
  },

  showPayPalViewController() {
    return new Promise(function (resolve, reject) {
      RCTBraintree.showPayPalViewController(function (err, nonce) {
        nonce != null ? resolve(nonce) : reject(err);
      });
    });
  },

  async getCardNonce(parameters: IOSCardParameters = {}) {
    try {
      const nonce = await RCTBraintree.getCardNonce(mapParameters(parameters));

      return nonce;
    } catch (error) {
      throw error;
    }
  },

  getDeviceData(options = {}) {
    return new Promise(function (resolve, reject) {
      RCTBraintree.getDeviceData(options, function (err, deviceData) {
        deviceData != null ? resolve(deviceData) : reject(err);
      });
    });
  },

  showApplePayViewController(options = {}) {
    return new Promise(function (resolve, reject) {
      RCTBraintree.showApplePayViewController(options, function (err, nonce) {
        nonce != null ? resolve(nonce) : reject(err);
      });
    });
  },
};

module.exports = Braintree;
