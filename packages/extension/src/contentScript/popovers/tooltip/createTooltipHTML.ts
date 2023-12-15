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

const createTooltipHTML = (
  info: Record<string, string>,
  infoAttribtues: { [key: string]: string }
): HTMLElement => {
  const tooltipHTML = document.createElement('div');
  // eslint-disable-next-line guard-for-in
  for (const label in info) {
    const value = info[label];
    const p: HTMLParagraphElement = document.createElement('p');

    if (value) {
      if (label === 'Visible iframes') {
        if (Number(info['Hidden iframes']) > 0 || Number(value) > 1) {
          p.innerHTML = `<strong>${label}</strong>: <span>${value}</span>`;
        } else {
          p.innerHTML = `<span class="ps-compact hidden">
            <strong>${label}</strong>: <span>${value}</span>
          </span>`;
        }
      } else if (label === 'Hidden iframes') {
        if (Number(value) > 0) {
          p.innerHTML = `<strong>${label}</strong>: <span>${value}</span>`;
        } else {
          p.innerHTML = `<span class="ps-compact hidden">
            <strong>${label}</strong>: <span>${value}</span>
          </span>`;
        }
      } else if (label === 'Allowed Features (PS related)') {
        p.innerHTML = `<strong>${label}</strong>: <span class="ps-allowed-features" data-compact-allowed-features="${infoAttribtues['allowedFeaturesInCompactView']}" data-expanded-allowed-features="${infoAttribtues['allowedFeatureInExpandedView']}">${value}</span>`;
      } else if (label === 'Note') {
        p.innerHTML = `
          <svg style="vertical-align:middle" width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M5.5 10.0833C8.03131 10.0833 10.0833 8.03131 10.0833 5.5C10.0833 2.96869 8.03131 0.916667 5.5 0.916667C2.96869 0.916667 0.916667 2.96869 0.916667 5.5C0.916667 8.03131 2.96869 10.0833 5.5 10.0833ZM5.5 11C8.53757 11 11 8.53757 11 5.5C11 2.46243 8.53757 0 5.5 0C2.46243 0 0 2.46243 0 5.5C0 8.53757 2.46243 11 5.5 11ZM5 8V5H6V8H5ZM5 3V3.5H6V3H5Z" fill="#616161"/>
          </svg>
          <span>${value}</span>
        `;
      } else {
        p.innerHTML = `<strong>${label}</strong>: <span>${value}</span>`;
      }
      tooltipHTML.appendChild(p);
    }
  }

  return tooltipHTML;
};

export default createTooltipHTML;
