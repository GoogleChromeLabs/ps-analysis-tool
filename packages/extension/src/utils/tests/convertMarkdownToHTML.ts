/*
 * Copyright 2024 Google LLC
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
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-useless-escape -- This is being done in order to pass the test since the output is going to be an html */
/**
 * Internal dependencies.
 */
import convertMarkdownToHTML, {
  IMAGE_BASE_URL,
} from '../convertMarkdownToHTML';

describe('convertMarkdownToHTML', () => {
  it('should replace image URLs with the correct base URL', async () => {
    const markdown = '![alt text](/images/sample.png)';
    const html = `<p><img src="${IMAGE_BASE_URL}/sample.png" alt="alt text"></p>`;

    const result = await convertMarkdownToHTML(markdown);

    expect(result.trim()).toEqual(html);

    const markdownClickableLink =
      '[![Alt text](/images/sample.png)](https://example.com)';

    const resultClickableLink = await convertMarkdownToHTML(
      markdownClickableLink
    );
    const htmlClickableLink = `<p><a target="_blank" href="https://example.com"><img src="${IMAGE_BASE_URL}/sample.png" alt="Alt text"></a></p>`;

    expect(resultClickableLink.trim()).toEqual(htmlClickableLink);

    const markdownExternalImage =
      '![alt text](https://example.com/images/sample.png)';
    const htmlExternalImage =
      '<p><img src="https://example.com/images/sample.png" alt="alt text"></p>';

    const resultExternalImage = await convertMarkdownToHTML(
      markdownExternalImage
    );

    expect(resultExternalImage.trim()).toEqual(htmlExternalImage);
  });

  it('should add target="_blank" to anchor tags without it', async () => {
    const markdown = '[Link](https://example.com)';
    const html =
      '<p><a target="_blank" href="https://example.com">Link</a></p>';

    const result = await convertMarkdownToHTML(markdown);

    expect(result.trim()).toEqual(html);
  });

  it('should process both image URLs and anchor tags correctly', async () => {
    const markdown = `![image](/images/sample.png)[Link](https://example.com)`;
    const html = `<p><img src="${IMAGE_BASE_URL}/sample.png" alt="image"><a target="_blank" href="https://example.com">Link</a></p>`;

    const result = await convertMarkdownToHTML(markdown);

    expect(result.trim()).toEqual(html);
  });

  it('should hanlde complext markdown correctly', async () => {
    const markdown = `
PSAT offers three straightforward installation methods:

## Installing PSAT from Chrome Web Store

PSAT is available in the [Chrome Web Store](https://chromewebstore.google.com/detail/privacy-sandbox-analysis/ehbnpceebmgpanbbfckhoefhdibijkef). To install, simply go to the linked store listing and click on \`Add to Chrome\`.

<img width="742" alt="PSAT on Chrome Web Store" src="images/evaluation-environment/psat_v0.8.0_chrome_store_24_05_24.png">

## Installation from the PSAT zip file

Go to the \`Releases\` Section in the PSAT GitHub repo: [bit.ly/psat-repo](https://bit.ly/psat-repo)

<img width="742" alt="Install from zip file, step one" src="images/evaluation-environment/psat_v0.8.0_psat_repository_24_05_2024.png">

Select the latest version from the available tags:

<img width="742" alt="Install from zip file, step two" src="images/evaluation-environment/psat_v0.8.0_psat_release_page_github_24_05_2024.png">

Expand the “Assets” dropdown, and click on the file named “extension-v*.*.zip” to download the extension.

<img width="742" alt="Install from zip file, step three" src="images/evaluation-environment/psat_v0.8.0_download_zip_24_04_2024.png">

Go to \`chrome://extensions\` in the browser you want PSAT to be installed on, turn on \`Developer mode\` to [load the unpacked extension](https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#load-unpacked), click the "Load unpacked" button, and select the unzipped extension folder.

<img width="742" alt="Chrome Settings page, step four" src="images/evaluation-environment/psat_v0.8.0_chrome_extension_settings_24_05_2024.png">

## PSAT installation from source code

If you need to debug the extension or submit improvements, you can download the source code and run it locally.

- Clone this Privacy Sandbox Analysis Tool Repository
- Run \`npm install\` to install all dependencies
- \`npm run ext:dev\` or \`npm run ext:build\` to generate a build in \`/dist/extension\`
- Turn on "Developer mode" in \`chrome://extensions\` to [load the unpacked extension](https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#load-unpacked)
- Click on the "Load Unpacked" button and upload the \`dist/extension\` folder
`;

    const html = `
<p>PSAT offers three straightforward installation methods:</p>
<h2>Installing PSAT from Chrome Web Store</h2>
<p>PSAT is available in the <a target="_blank" href="https://chromewebstore.google.com/detail/privacy-sandbox-analysis/ehbnpceebmgpanbbfckhoefhdibijkef">Chrome Web Store</a>. To install, simply go to the linked store listing and click on <code>Add to Chrome</code>.</p>
<img width="742" alt="PSAT on Chrome Web Store" src="${IMAGE_BASE_URL}/evaluation-environment/psat_v0.8.0_chrome_store_24_05_24.png">

<h2>Installation from the PSAT zip file</h2>
<p>Go to the <code>Releases</code> Section in the PSAT GitHub repo: <a target="_blank" href="https://bit.ly/psat-repo">bit.ly/psat-repo</a></p>
<img width="742" alt="Install from zip file, step one" src="${IMAGE_BASE_URL}/evaluation-environment/psat_v0.8.0_psat_repository_24_05_2024.png">

<p>Select the latest version from the available tags:</p>
<img width="742" alt="Install from zip file, step two" src="${IMAGE_BASE_URL}/evaluation-environment/psat_v0.8.0_psat_release_page_github_24_05_2024.png">

<p>Expand the “Assets” dropdown, and click on the file named “extension-v*.*.zip” to download the extension.</p>
<img width="742" alt="Install from zip file, step three" src="${IMAGE_BASE_URL}/evaluation-environment/psat_v0.8.0_download_zip_24_04_2024.png">

<p>Go to <code>chrome://extensions</code> in the browser you want PSAT to be installed on, turn on <code>Developer mode</code> to <a target="_blank" href="https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#load-unpacked">load the unpacked extension</a>, click the \"Load unpacked"\ button, and select the unzipped extension folder.</p>
<img width="742" alt="Chrome Settings page, step four" src="${IMAGE_BASE_URL}/evaluation-environment/psat_v0.8.0_chrome_extension_settings_24_05_2024.png">

<h2>PSAT installation from source code</h2>
<p>If you need to debug the extension or submit improvements, you can download the source code and run it locally.</p>
<ul>
<li>Clone this Privacy Sandbox Analysis Tool Repository</li>
<li>Run <code>npm install</code> to install all dependencies</li>
<li><code>npm run ext:dev</code> or <code>npm run ext:build</code> to generate a build in <code>/dist/extension</code></li>
<li>Turn on \"Developer mode"\ in <code>chrome://extensions</code> to <a target="_blank" href="https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#load-unpacked">load the unpacked extension</a></li>
<li>Click on the \"Load Unpacked"\ button and upload the <code>dist/extension</code> folder</li>
</ul>
`;

    const result = await convertMarkdownToHTML(markdown);

    expect(result.replace(/\s+/g, ' ').trim()).toEqual(
      html.replace(/\s+/g, ' ').trim()
    );
  });
});
