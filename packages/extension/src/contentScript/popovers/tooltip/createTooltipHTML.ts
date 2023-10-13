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
      } else {
        p.innerHTML = `<strong>${label}</strong>: <span>${value}</span>`;
      }
      tooltipHTML.appendChild(p);
    }
  }

  return tooltipHTML;
};

export default createTooltipHTML;
