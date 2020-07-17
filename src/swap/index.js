// @flow

import type {
  SwapCurrencyNameAndSignature,
  SwapProviderNameAndSignature,
} from "./types";
import type { CryptoCurrency, TokenCurrency } from "../types/currencies";
import getExchangeRates from "./getExchangeRates";
import getStatus from "./getStatus";
import getProviders from "./getProviders";
import getCompleteSwapHistory from "./getCompleteSwapHistory";
import initSwap from "./initSwap";

const swapAPIBaseURL = "https://swap.staging.aws.ledger.fr";

const swapProviders: {
  [string]: { nameAndPubkey: Buffer, signature: Buffer },
} = {
  new_changelly: {
    nameAndPubkey: Buffer.from([0x9, 0x53, 0x57, 0x41, 0x50, 0x5F, 0x54, 0x45, 0x53, 0x54, 0x4, 0x66, 0xA, 0x15, 0x3, 0x9, 0xFB, 0x52, 0xF3, 0xD4, 0x2C, 0x27, 0xAD, 0x4, 0xDC, 0x31, 0x99, 0xAA, 0x23, 0x37, 0xBD, 0x2A, 0x8A, 0x0, 0x2C, 0x53, 0x37, 0xD1, 0x78, 0x8A, 0xE3, 0x47, 0xD3, 0x33, 0x6E, 0x0, 0xEA, 0x33, 0xF4, 0x77, 0x8C, 0xD9, 0x1F, 0xF7, 0xD2, 0x8A, 0x89, 0x42, 0xEF, 0xD7, 0x73, 0x5D, 0xC3, 0xAD, 0x1B, 0x74, 0x53, 0xF1, 0xB9, 0xBD, 0x1F, 0xB4, 0xFE, 0x65, 0xFD]), // prettier-ignore
    signature: Buffer.from([0x30, 0x44, 0x2, 0x20, 0x69, 0xAB, 0x98, 0xDF, 0xB8, 0x27, 0x7F, 0x36, 0x22, 0x9, 0x6D, 0x12, 0x48, 0x5C, 0x92, 0xD3, 0x14, 0xB5, 0x54, 0xAB, 0x91, 0x5F, 0x4C, 0xB1, 0x10, 0xB6, 0x6B, 0x60, 0x10, 0xD0, 0xA, 0xF2, 0x2, 0x20, 0x2B, 0x6C, 0xC7, 0xF9, 0x79, 0x69, 0xEE, 0x3C, 0x9C, 0xE7, 0x88, 0xF8, 0x82, 0x79, 0xE4, 0x82, 0x1B, 0xAC, 0x7D, 0x5A, 0xA4, 0xE7, 0x10, 0x48, 0xE1, 0x16, 0x2, 0x0, 0x33, 0xEF, 0xA6, 0x9B]) // prettier-ignore
  },
  changelly: {
    nameAndPubkey: Buffer.from([0x9, 0x43, 0x68, 0x61, 0x6E, 0x67, 0x65, 0x6C, 0x6C, 0x79, 0x4, 0x80, 0xD7, 0xC0, 0xD3, 0xA9, 0x18, 0x35, 0x97, 0x39, 0x5F, 0x58, 0xDD, 0xA0, 0x59, 0x99, 0x32, 0x8D, 0xA6, 0xF1, 0x8F, 0xAB, 0xD5, 0xCD, 0xA0, 0xAF, 0xF8, 0xE8, 0xE3, 0xFC, 0x63, 0x34, 0x36, 0xA2, 0xDB, 0xF4, 0x8E, 0xCB, 0x23, 0xD4, 0xD, 0xF7, 0xC3, 0xC7, 0xD3, 0xE7, 0x74, 0xB7, 0x7B, 0x4B, 0x5D, 0xF0, 0xE9, 0xF7, 0xE0, 0x8C, 0xF1, 0xCD, 0xF2, 0xDB, 0xA7, 0x88, 0xEB, 0x8, 0x5B]), // prettier-ignore
    signature: Buffer.from([0x30, 0x44, 0x2, 0x20, 0x6A, 0x57, 0xC9, 0xED, 0x40, 0x30, 0xCB, 0x21, 0x70, 0xA3, 0x45, 0x74, 0x73, 0x75, 0x7E, 0x6, 0x3F, 0xE7, 0x27, 0xC1, 0x43, 0x0, 0x2, 0x51, 0xD9, 0xE9, 0x7F, 0x27, 0x89, 0x90, 0x29, 0x80, 0x2, 0x20, 0x7B, 0x11, 0x97, 0xDA, 0x75, 0xFE, 0x90, 0x9C, 0xB9, 0xE2, 0x85, 0x77, 0x5A, 0xF9, 0xC9, 0x6A, 0x62, 0x69, 0x5C, 0x18, 0x74, 0x56, 0x5B, 0xC6, 0x7B, 0x18, 0xF9, 0xF7, 0xC6, 0x11, 0xDE, 0x82]) // prettier-ignore
  },
};

// Fixme These configuration/signature pairs will tell the swap app which currency app to open and sign with
// alongside which parameters (derivation path and so on). We should be able to generate this instead
const swapCurrencyConfigs: { [string]: SwapCurrencyNameAndSignature } = {
  bitcoin: {
    config: Buffer.from([0x3, 0x42, 0x54, 0x43, 0x7, 0x42, 0x69, 0x74, 0x63, 0x6F, 0x69, 0x6E, 0x0]), // prettier-ignore
    signature: Buffer.from([0x30, 0x45, 0x2, 0x21, 0x0, 0x97, 0xCE, 0x38, 0xC5, 0x15, 0x60, 0xFD, 0xBF, 0x2D, 0xBE, 0x87, 0x3C, 0x22, 0xFC, 0xBE, 0xC0, 0x7B, 0x58, 0xF1, 0x33, 0x13, 0x24, 0x5E, 0x8F, 0xB6, 0x4F, 0xDB, 0x2B, 0x32, 0xD4, 0x55, 0xE0, 0x2, 0x20, 0xA, 0xE6, 0x3C, 0xDA, 0x3C, 0xD3, 0xCC, 0x3, 0x43, 0x65, 0x3B, 0x38, 0xE5, 0xC2, 0xC5, 0xC2, 0x7B, 0xFE, 0x47, 0xB3, 0x5D, 0x25, 0x30, 0x26, 0x37, 0x89, 0x63, 0x47, 0x59, 0xC6, 0xD5, 0xB4]) // prettier-ignore
  },
  litecoin: {
    config: Buffer.from([0x3, 0x4C, 0x54, 0x43, 0x8, 0x4C, 0x69, 0x74, 0x65, 0x63, 0x6F, 0x69, 0x6E, 0x0]), // prettier-ignore
    signature: Buffer.from([0x30, 0x44, 0x2, 0x20, 0x2A, 0xD5, 0x61, 0xDD, 0x8B, 0x3B, 0x98, 0x9C, 0xEA, 0x41, 0x1D, 0x4C, 0x1D, 0x8A, 0x6A, 0x62, 0x71, 0xB4, 0xF7, 0x2F, 0xB1, 0x66, 0x25, 0x9C, 0x89, 0x8F, 0xFC, 0x11, 0x70, 0x74, 0x72, 0xEB, 0x2, 0x20, 0x34, 0x6A, 0xA8, 0x95, 0x5E, 0x8E, 0x6B, 0xE6, 0x5D, 0x2F, 0xC6, 0x58, 0x36, 0x3A, 0xF4, 0x31, 0xD7, 0x1E, 0xA8, 0x65, 0xCC, 0xC8, 0x3D, 0xD4, 0xA7, 0x14, 0x9B, 0xEF, 0xF9, 0x35, 0x21, 0xB8]) // prettier-ignore
  },
  ethereum: {
    config: Buffer.from([0x3, 0x45, 0x54, 0x48, 0x8, 0x45, 0x74, 0x68, 0x65, 0x72, 0x65, 0x75, 0x6D, 0x5, 0x3, 0x45, 0x54, 0x48, 0x12]), // prettier-ignore
    signature: Buffer.from([0x30, 0x44, 0x2, 0x20, 0x5F, 0xEF, 0x55, 0x54, 0x36, 0xAC, 0xE6, 0x76, 0x8B, 0xA6, 0x66, 0x6A, 0xB7, 0x83, 0x4B, 0x16, 0x87, 0x36, 0x9B, 0x6, 0x27, 0x47, 0x78, 0xFD, 0xD2, 0x8E, 0xB, 0x88, 0xD3, 0x43, 0x4D, 0xE9, 0x2, 0x20, 0x6A, 0x67, 0xF4, 0xCF, 0x62, 0x2C, 0x6B, 0xBC, 0x12, 0x7B, 0xBE, 0x86, 0x6A, 0x7B, 0x65, 0x40, 0xBD, 0x97, 0xE9, 0x1A, 0xCB, 0x38, 0xF1, 0x79, 0xA5, 0x54, 0xE6, 0x94, 0xBD, 0xEA, 0x50, 0x43]) // prettier-ignore
  },
  "ethereum/erc20/usd_tether__erc20_": {
    config: Buffer.from([0x4, 0x55, 0x53, 0x44, 0x54, 0x8, 0x45, 0x74, 0x68, 0x65, 0x72, 0x65, 0x75, 0x6D, 0x6, 0x4, 0x55, 0x53, 0x44, 0x54, 0x6]), // prettier-ignore
    signature: Buffer.from([0x30, 0x45, 0x2, 0x21, 0x0, 0xD7, 0x75, 0x62, 0xB4, 0x8A, 0x7E, 0x56, 0x3B, 0x1, 0x4A, 0x1C, 0x12, 0xA, 0x20, 0x71, 0x69, 0x7E, 0x1D, 0x82, 0xE, 0x7, 0x55, 0x18, 0x8F, 0x32, 0x1B, 0xD3, 0x64, 0xD9, 0xBF, 0x17, 0x99, 0x2, 0x20, 0x50, 0x9D, 0x75, 0x7A, 0x7F, 0xC4, 0x77, 0xA3, 0xE5, 0x59, 0x95, 0x40, 0xC7, 0x1, 0xF, 0xAD, 0xAB, 0xAA, 0xC2, 0x73, 0x53, 0xB, 0x42, 0x81, 0x78, 0x99, 0x6F, 0x7D, 0x20, 0xFE, 0xBB, 0x65]) // prettier-ignore
  },
  "ethereum/erc20/augur": {
    config: Buffer.from([0x3, 0x52, 0x45, 0x50, 0x8, 0x45, 0x74, 0x68, 0x65, 0x72, 0x65, 0x75, 0x6D, 0x5, 0x3, 0x52, 0x45, 0x50, 0x12]),
    signature: Buffer.from([0x30, 0x45, 0x2, 0x21, 0x0, 0xB6, 0x89, 0x54, 0x33, 0xA4, 0x44, 0x3C, 0x78, 0xC3, 0x44, 0xDA, 0x45, 0x7F, 0xDC, 0xD4, 0x97, 0x45, 0x34, 0xA6, 0xCC, 0x98, 0x58, 0xCF, 0x18, 0x92, 0x43, 0xDF, 0x78, 0x34, 0x84, 0x13, 0x16, 0x2, 0x20, 0x3B, 0x3A, 0xE7, 0xAD, 0x8B, 0x17, 0xF8, 0x25, 0xE5, 0x55, 0x52, 0xEA, 0x18, 0xAC, 0x1E, 0xCD, 0xC3, 0x0, 0x99, 0xF1, 0x29, 0x31, 0xA1, 0x44, 0xD1, 0x63, 0xC7, 0xA, 0xA2, 0xDE, 0xFD, 0x8B]),
  }
};

const getCurrencySwapConfig = (
  currency: CryptoCurrency | TokenCurrency
): SwapCurrencyNameAndSignature => {
  const res = swapCurrencyConfigs[currency.id];
  if (!res) {
    throw new Error(`Swap, missing configuration for ${currency.id}`);
  }
  return res;
};

const getProviderNameAndSignature = (
  providerName: string
): SwapProviderNameAndSignature => {
  const res = swapProviders[providerName];
  if (!res) {
    throw new Error(`Unknown partner ${providerName}`);
  }
  return res;
};

const isCurrencySwapSupported = (
  currency: CryptoCurrency | TokenCurrency
): boolean => {
  return !!swapCurrencyConfigs[currency.id];
};

export {
  swapAPIBaseURL,
  getProviderNameAndSignature,
  getProviders,
  getStatus,
  getCurrencySwapConfig,
  getExchangeRates,
  getCompleteSwapHistory,
  isCurrencySwapSupported,
  initSwap,
};
