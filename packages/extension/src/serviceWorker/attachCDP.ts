/*
 * Copyright 2023 Google LLC
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
 * This function will attach the debugger to the given target.
 * @param {{ [key: string]: number | string }} target The target where debugger needs to be attached.
 * @param {boolean} childDebuggee If the target is a child debuggee.
 */
export default function attachCDP(
  target: { [key: string]: number | string },
  childDebuggee = false
) {
  try {
    chrome.debugger.attach(target, '1.3', async () => {
      if (chrome.runtime.lastError) {
        // eslint-disable-next-line no-console
        console.log(chrome.runtime.lastError);
      }
      try {
        await chrome.debugger.sendCommand(
          target,
          'Storage.setInterestGroupAuctionTracking',
          { enable: true }
        );
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('extensionSourceCodeError', error);
      }
      try {
        await chrome.debugger.sendCommand(target, 'Audits.enable');
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('extensionSourceCodeError', error);
      }
      try {
        await chrome.debugger.sendCommand(
          target,
          'Storage.setInterestGroupTracking',
          {
            enable: true,
          }
        );
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('extensionSourceCodeError', error);
      }
      try {
        await chrome.debugger.sendCommand(
          target,
          'Storage.setAttributionReportingTracking',
          {
            enable: true,
          }
        );
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('extensionSourceCodeError', error);
      }
      try {
        await chrome.debugger.sendCommand(
          target,
          'Storage.setAttributionReportingLocalTestingMode',
          {
            enabled: true,
          }
        );
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('extensionSourceCodeError', error);
      }
      try {
        await chrome.debugger.sendCommand(target, 'Page.enable');
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('extensionSourceCodeError', error);
      }
      try {
        await chrome.debugger.sendCommand(target, 'Network.enable');
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('extensionSourceCodeError', error);
      }

      try {
        if (!childDebuggee) {
          await chrome.debugger.sendCommand(target, 'Target.setAutoAttach', {
            autoAttach: true,
            flatten: true,
            waitForDebuggerOnStart: false,
          });
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('extensionSourceCodeError', error);
      }
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('extensionSourceCodeError', error);
  }
}
