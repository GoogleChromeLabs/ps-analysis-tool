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
 */
export default async function attachCDP(target: {
  [key: string]: number | string;
}) {
  try {
    await chrome.debugger.attach(target, '1.3');
    await chrome.debugger.sendCommand(target, 'Target.setAutoAttach', {
      // If this is set to true, debugger will be attached to every new target that is added to the current target.
      autoAttach: true,
      waitForDebuggerOnStart: false,
      //Enables "flat" access to the session via specifying sessionId attribute in the commands.
      // If this is set to true the debugger is also attached to the child targets of that the target it has been attached to.
      flatten: true,
    });
    await chrome.debugger.sendCommand(target, 'Network.enable');
    await chrome.debugger.sendCommand(target, 'Audits.enable');
    await chrome.debugger.sendCommand(target, 'Page.enable');
  } catch (error) {
    //Fail silently
  }
}
