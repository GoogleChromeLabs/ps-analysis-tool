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
 * @param { boolean } childDebugee determine whether the target is child debugee or not.
 */
export default function attachCDP(
  target: { [key: string]: number | string },
  childDebugee = false
) {
  chrome.debugger.attach(target, '1.3', () => {
    chrome.debugger.sendCommand(target, 'Target.setAutoAttach', {
      autoAttach: true,
      flatten: false,
      waitForDebuggerOnStart: true,
    });

    chrome.debugger.sendCommand(
      target,
      'Storage.setInterestGroupAuctionTracking',
      { enable: true }
    );
    chrome.debugger.sendCommand(target, 'Audits.enable');
    chrome.debugger.sendCommand(target, 'Storage.setInterestGroupTracking', {
      enable: true,
    });
    chrome.debugger.sendCommand(target, 'Page.enable');
    chrome.debugger.sendCommand(target, 'Network.enable');

    if (childDebugee) {
      // In non-flat mode, we must send runIfWaitingForDebugger via
      // sendMessageToTarget for it to actually work.
      const message = {
        id: 0,
        method: 'Runtime.runIfWaitingForDebugger',
        params: {},
      };
      chrome.debugger.sendCommand(target, 'Target.sendMessageToTarget', {
        message: JSON.stringify(message),
        targetId: target?.targetId,
      });
    }
  });
}
