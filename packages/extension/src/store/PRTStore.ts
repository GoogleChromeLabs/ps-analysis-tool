/*
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * External dependencies.
 */
import type {
  UniqueDecryptedToken,
  UniquePlainTextToken,
  ProbablisticRevealToken,
  PRTMetadata,
} from '@google-psat/common';
import { ec as ellipticEc } from 'elliptic';

/**
 * Internal dependencies.
 */
import { DataStore } from './dataStore';
import { TAB_TOKEN_DATA } from '../constants';

const PRT_SIZE = 79;
const PRT_POINT_SIZE = 33;
const EPOCH_ID_SIZE = 8;
const BITS_PER_BYTE = 8;

type TabToken = {
  [tabId: string]: {
    plainTextTokens: UniquePlainTextToken[];
    decryptedTokens: UniqueDecryptedToken[];
    prtTokens: ProbablisticRevealToken[];
    perTokenMetadata: {
      [prtHeader: string]: PRTMetadata;
    };
  };
};

type SingleTabTokens = {
  plainTextTokens: UniquePlainTextToken[];
  decryptedTokens: UniqueDecryptedToken[];
  prtTokens: ProbablisticRevealToken[];
  perTokenMetadata: {
    [prtHeader: string]: PRTMetadata;
  };
};
/**
 * deserializePrt, getTokenFromHeaderString, recoverXFromPaddedPoint, decryptTokenHeader, getPlaintextToken, verifyHmac
 * functions were converted from Javascript to Typescript.
 * Credits to https://github.com/semyers/prtoken-js for Javascript implementation of the above listed functions.
 */
class PRTStore extends DataStore {
  tabTokens: TabToken = {};

  constructor() {
    super();
  }

  clear(): void {
    super.clear();
    Object.keys(this.tabTokens).forEach((key) => {
      delete this.tabTokens[Number(key)];
    });
  }

  getTabsData(tabId = ''): SingleTabTokens | typeof this.tabTokens {
    if (tabId) {
      return this.tabTokens[tabId];
    }
    return this.tabTokens;
  }

  deinitialiseVariablesForTab(tabId: string): void {
    super.deinitialiseVariablesForTab(tabId);
    delete this.tabTokens[tabId];
  }

  initialiseVariablesForNewTab(tabId: string): void {
    super.initialiseVariablesForNewTab(tabId);
    this.tabTokens[tabId] = {
      plainTextTokens: [],
      decryptedTokens: [],
      prtTokens: [],
      perTokenMetadata: {},
    };
    //@ts-ignore
    globalThis.PSAT = {
      //@ts-ignore
      ...globalThis.PSAT,
      tabTokens: this.tabTokens,
    };
  }

  /**
   * Processes and sends Tokens to the extension for the specified tabId
   * @param {number} tabId The url whose url needs to be update.
   * @param {boolean | undefined} overrideForInitialSync Override the condition.
   */
  async sendUpdatedDataToPopupAndDevTools(
    tabId: string,
    overrideForInitialSync: boolean
  ) {
    try {
      if (DataStore.tabs[tabId].newUpdatesPRT <= 0 && !overrideForInitialSync) {
        return;
      }

      const tokenData = {
        ...this.tabTokens[tabId],
        perTokenMetadata: Object.values(this.tabTokens[tabId].perTokenMetadata),
      };
      await chrome.runtime.sendMessage({
        type: TAB_TOKEN_DATA,
        payload: {
          tabId,
          tokens: tokenData,
        },
      });

      DataStore.tabs[tabId].newUpdatesPRT = 0;
    } catch (error) {
      // Fail silently
    }
  }
  /**
   * Deserializes a raw byte buffer into a PRT object, performing structural validation.
   * @param {ArrayBuffer} serializedPrt The raw byte array representing the serialized PRT.
   * @returns {ProbablisticRevealToken | null} - A PRT object containing version, u, e, and epochId, or null if deserialization fails due to invalid structure or size.
   */
  deserializePrt(serializedPrt: ArrayBuffer) {
    if (serializedPrt.byteLength !== PRT_SIZE) {
      // eslint-disable-next-line no-console
      console.log(
        `Invalid PRT size: ${serializedPrt.byteLength}, expected: ${PRT_SIZE}`
      );
      return null;
    }

    try {
      const dataView = new DataView(serializedPrt);
      let offset = 0;

      const version = dataView.getUint8(offset);
      offset += 1;

      const uSize = dataView.getUint16(offset, false); // Big Endian
      offset += 2;
      if (uSize !== PRT_POINT_SIZE) {
        // eslint-disable-next-line no-console
        console.log(`Invalid u_size: ${uSize}, expected: ${PRT_POINT_SIZE}`);
        return null;
      }

      const u = new Uint8Array(serializedPrt, offset, uSize);
      offset += uSize;

      const eSize = dataView.getUint16(offset, false); // Big Endian
      offset += 2;
      if (eSize !== PRT_POINT_SIZE) {
        // eslint-disable-next-line no-console
        console.log(`Invalid e_size: ${eSize}, expected: ${PRT_POINT_SIZE}`);
        return null;
      }

      const e = new Uint8Array(serializedPrt, offset, eSize);
      offset += eSize;

      const epochId = new Uint8Array(serializedPrt, offset, EPOCH_ID_SIZE);

      return {
        version,
        u,
        e,
        epochId,
        prtHeader: '',
        epochIdBase64: '',
      };
    } catch (ex) {
      // eslint-disable-next-line no-console
      console.log(`Failed to deserialize PRT: ${ex}`);
      return null;
    }
  }

  /**
   * Decodes a Base64-encoded PRT header string and deserializes it into a structured PRT object.
   * @param {string} prtHeader The Base64-encoded PRT string, typically from an HTTP header.
   * @returns {object | null} The deserialized PRT object, augmented with prt_header and a URL-safe epochIdBase64, or null on failure.
   */
  getTokenFromHeaderString(prtHeader: string) {
    try {
      if (prtHeader.startsWith(':')) {
        prtHeader = prtHeader.substring(1);
      }
      if (prtHeader.endsWith(':')) {
        prtHeader = prtHeader.slice(0, -1);
      }

      const prtBytes = Uint8Array.from(atob(prtHeader), (c) => c.charCodeAt(0));
      const prt = this.deserializePrt(prtBytes.buffer);
      if (!prt) {
        return null;
      }

      prt.prtHeader = prtHeader;
      //@ts-ignore
      prt.epochIdBase64 = btoa(String.fromCharCode.apply(null, prt.epochId))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');

      return prt;
    } catch (ex) {
      // eslint-disable-next-line no-console
      console.log(`Failed to get token from header string: ${ex}`);
      return null;
    }
  }

  /**
   * Decodes a Base64-encoded PRT header string and deserializes it into a structured PRT object.
   * @param {object} point An elliptic curve point object from the elliptic library.
   * @param {number} numPaddingBits The number of bits of padding to remove from the left.
   * @returns {object | null} - The deserialized PRT object, augmented with prt_header and a URL-safe epochIdBase64, or null on failure.
   */
  recoverXFromPaddedPoint(point: any, numPaddingBits: number) {
    const xBn = point.getX();
    return xBn.shrn(numPaddingBits);
  }

  /**
   * The core decryption function. It orchestrates the process of parsing the token header,
   * fetching the correct private key based on the token's epochId, and performing elliptic curve decryption.
   * @param {string} prtHeader The Base64-encoded PRT header string.
   * @returns {Promise<UniqueDecryptedToken | null>} - A promise that resolves to an object containing the decrypted plaintext (as a Uint8Array) and the hmac_secret (as a Uint8Array), or null if any step in the decryption process fails.
   */
  async decryptTokenHeader(prtHeader: string) {
    const prt = this.getTokenFromHeaderString(prtHeader);
    if (!prt) {
      // eslint-disable-next-line no-console
      console.log('Failed to parse token header');
      return null;
    }

    try {
      const keyFile = prt.epochIdBase64 + '.json';
      const url = `https://raw.githubusercontent.com/explainers-by-googlers/prtoken-reference/main/published_keys/${keyFile}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch key file: ${response.statusText}`);
      }
      const keyData = await response.json();

      //@ts-ignore
      const ec = new ellipticEc('p256');

      const dB64 = keyData.eg.d;
      const dHex = atob(dB64.replace(/_/g, '/').replace(/-/g, '+'))
        .split('')
        .map((c) => c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('');
      const key = ec.keyFromPrivate(dHex, 'hex');
      const dBn = key.getPrivate();

      const hmacSecretB64 = keyData.hmac.k;
      const hmacSecret = Uint8Array.from(
        atob(hmacSecretB64.replace(/_/g, '/').replace(/-/g, '+')),
        (c) => c.charCodeAt(0)
      );

      const pointU = ec.curve.decodePoint(
        Array.from(prt.u)
          .map((b) => b.toString(16).padStart(2, '0'))
          .join(''),
        'hex'
      );
      const pointE = ec.curve.decodePoint(
        Array.from(prt.e)
          .map((b) => b.toString(16).padStart(2, '0'))
          .join(''),
        'hex'
      );

      const xu = pointU.mul(dBn);
      const decryptedPoint = pointE.add(xu.neg());

      const xRecovered_bn = this.recoverXFromPaddedPoint(
        decryptedPoint,
        3 * BITS_PER_BYTE
      );

      const plaintext = new Uint8Array(xRecovered_bn.toArray('be'));

      return {
        plaintext,
        hmacSecret,
      } as unknown as UniqueDecryptedToken;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(`Error: ${e}`);
      return null;
    }
  }

  /**
   * Parses the decrypted plaintext buffer to extract the final token data and verify its integrity.
   * @param {object} result - The result object from decryptTokenHeader, containing plaintext and hmac_secret.
   * @returns {Promise<UniquePlainTextToken | null>} A promise that resolves to an object containing the token's version, t_ord, signal, and a boolean hmacValid, or null if the plaintext is malformed.
   */
  async getPlaintextToken(result: any) {
    const { plaintext, hmacSecret } = result;

    if (plaintext.length < 26) {
      // eslint-disable-next-line no-console
      console.log(
        `Cannot parse plaintext, buffer too small. Length: ${plaintext.length}`
      );
      return null;
    }

    try {
      const version = plaintext[0];
      const ordinal = plaintext[1];
      const signal = plaintext.slice(2, 18);
      const receivedHmac = plaintext.slice(18, 26);

      const hmacValid = await this.verifyHmac(
        version,
        ordinal,
        signal,
        receivedHmac,
        hmacSecret
      );

      return {
        version,
        ordinal,
        uint8Signal: signal,
        hmacValid,
      } as UniquePlainTextToken;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('Cannot parse plaintext.', e);
      return null;
    }
  }

  /**
   * Verifies the integrity of the token data by calculating an HMAC-SHA-256 signature and comparing it to the signature received in the token.
   * @param {number} version The token version number.
   * @param {number} t_ord The token type ordinal.
   * @param {Uint8Array} signal The signal data from the token.
   * @param {Uint8Array} receivedHmac The 8-byte truncated HMAC signature from the token.
   * @param {Uint8Array} hmacSecret The secret key for HMAC verification.
   * @returns {Promise<boolean>} - A promise that resolves to true if the HMAC is valid, and false otherwise.
   */

  async verifyHmac(
    version: number,
    t_ord: number,
    signal: Uint8Array<any>,
    receivedHmac: Uint8Array<any>,
    hmacSecret: Uint8Array<any>
  ) {
    try {
      const key = await crypto.subtle.importKey(
        'raw',
        hmacSecret,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );

      const data = new Uint8Array([version, t_ord, ...signal]);

      const signature = await crypto.subtle.sign('HMAC', key, data);
      const truncatedSignature = new Uint8Array(signature, 0, 8);

      // Constant-time comparison is not strictly necessary here, but good practice
      if (receivedHmac.length !== truncatedSignature.length) {
        return false;
      }

      for (let i = 0; i < receivedHmac.length; i++) {
        if (receivedHmac[i] !== truncatedSignature[i]) {
          return false;
        }
      }
      return true;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(`Error during HMAC verification: ${e}`);
      return false;
    }
  }
}

export default new PRTStore();
