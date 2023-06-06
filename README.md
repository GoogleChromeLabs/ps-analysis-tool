<h1 align="center" style="display: block; font-size: 2.5em; font-weight: bold; margin-block-start: 1em; margin-block-end: 1em;">
<a name="logo" href="https://www.privacysandbox.com"><img align="center" src="https://github.com/GoogleChromeLabs/cookie-analysis-tool/assets/506089/62ae89de-430a-4a5b-b5bf-2a1b2f86c712" alt="Privacy Sandbox" style="width:30%;height:100%"/></a>
</h1>

## Table of contents
- [Privacy Sandbox](#privacy-sandbox)
- [Target audience](#target-audience)
- [Cookie Analysis](#cookie-analysis)
- [How the Tool Works](#how-the-tool-works)
- [Capabilities](#capabilities)
- [Examples](#examples)
- [Call to action](#call-to-action)
- [Resources](#resources)

## Privacy Sandbox

[Privacy Sandbox](https://privacysandbox.com/) is a multi-year [initiative by Google](https://developer.chrome.com/docs/privacy-sandbox/overview/) for building a more private web by defining a set of building blocks (i.e. proposed APIs) enabling [a new privacy model for the web](https://github.com/michaelkleber/privacy-model). This Initiative encompasses three tracks:

1. Replacing functionality powered by third-party cookies with privacy-preserving alternatives.

2. Turning down third-party cookies, while  ensuring that the ecosystem has the technical capabilities for embracing new privacy-preserving solutions (e.g. First Party Sets, Topics, etc.)

3. Mitigating workarounds, by ensuring developers have a well-lit path to the new capabilities of the platform, and avoid pursuing tracking via other means. 

Tracks #2 and #3 bring significant changes to how the web operates today, and the purpose of this tool is to shed light, provide insights, and helping you to learn and understand the changes that are happening regarding the deprecation of 3P cookies, and the potential impact on the aspects of your site or product implementation that are build using cookies. 

## Target Audience

**First-party site developers**: responsible for the creation and maintenance of websites. A significant part of their work involves auditing and managing third-party dependencies to ensure that their websites run smoothly and securely. They need to understand the changes to 3P cookie use cases,  how to integrate Privacy Sandbox APIs into their solutions, and how to troubleshoot any issues that arise.

**Third-Party Service Providers using valid cookie use cases**: responsible for creating and maintaining services that are integrated into other websites as third-party dependencies, and rely on cookies for various functions, such as maintaining user sessions or tracking user preferences. They need to stay informed and guided on understanding how to use cookies effectively and responsibly, in compliance with all relevant laws and regulations.

**Third-Party Service Providers transitioning away from cookies** : responsible for developing third-party services that rely on cookies (e.g. tracking, data storage, or user session management), which need to transition to alternate methods due to evolving regulations and platform changes. They need guidance and technical support for understanding  how to integrate Privacy Sandbox APIs into their solutions, and how to troubleshoot any issues that arise.

**Website owners and technology leaders**: responsible for tech and business decision making. They need the ability to get reports and insights about the cookies usage by their sites and the potential impact on user privacy.

## Cookie Analysis

This Cookie Analysis Tool is designed to provide detailed information about cookie usage during browsing sessions. It tracks and analyzes the various cookies that websites place on your browser, and it offers a comprehensive overview of their origins, their purposes, their expiry dates. It also provide context and access points to knowledge about 3P cookies and [Privacy Sandbox APIs](https://privacysandbox.com/open-web/#proposals-for-the-web). This tool can be accessed as a [Chrome Extension](https://developer.chrome.com/docs/extensions/mv3/), or via a CLI on your terminal. 

### Extension
The Chrome extension provides a summary cookie analysis via a pop-up window from the extension icon, as well as detailed cookie anlaysis in a panel inside dev tools.

### CLI

The CLI implementation parses a sitemap provided as input, and outputs a JSON file listign all cookies set while navigating through the URLs in the sitemap. 

## Usage instructions

- Clone this Cookie Analysis Tool Repository
- `npm install` Install all dependencies

### Extension

- `npm run extension:dev` or `npm run extension:build` to genrate a build in `/dist/extension`
- Click on "Load Unpacked" button on [chrome://extensions/](chrome://extensions/) and upload `dist/extension` folder

### CLI

- `npm run cli:build` to genrate a build in `/dist/cli`.
- Run the cli util providing a sitemap as input. E.g. `node dist/cli/index.js -s https://<example.com>/sitemap_index.xml\`.

## How the tool works

TODO: 
- Architectural diagrams
- Clear explanation of what is being tracked/analyzed
- Code references enabling open source verification of claims

## Capabilities

TODO: 
- Feature set, with description, use cases, knowledge access points to related topics.

| Feature       | Description   |
| ------------- | ------------- |
| ...           | ...           |
| ...           | ...           |

## Examples
The following screenshot shows the Cookie Analysis tool running on the cnn.com URL, showing a summary of the seen cookies on that page.

<div style="display=flex; justify-content:center;">
  <img style="width:60%" alt="DevTools CNN.com #1" src="https://github.com/GoogleChromeLabs/cookie-analysis-tool/assets/506089/56e95ae9-d3bc-4010-8dee-ca2d6ecf60d0" alt="cnn.com pop-up" >
</div>

The following screenshot shows the tool interface in Chrome DevTools, showing details of the cookies tracked, and capabilities such as classification, sorting, and others. 

<div style="display=flex; justify-content:center;">
  <img style="width:60%" alt="DevTools CNN.com #2" src="https://github.com/GoogleChromeLabs/cookie-analysis-tool/assets/506089/896f4c04-315e-4f62-9f5d-38ff5db08eb1">
</div>

## Call to Action
TODO: Tailored CTAs for each [target audience](#target-audience).

**First-party site developers**: ...

**Third-Party Service Providers using valid cookie use cases**:  ...

**Third-Party Service Providers transitioning away from cookies**: ...

**Website owners and technology leaders**: ...

## Resources

* [The Privacy Sandbox](https://developer.chrome.com/privacy-sandbox/) 
* [A Potential New Privacy Model for the Web](https://github.com/michaelkleber/privacy-model)
* [Chrome Facilitated Testing](https://developer.chrome.com/en/docs/privacy-sandbox/chrome-testing/)

## Contributing
If you have requests for features you would like to see in this tool, please file an Feature Request or join as a contributor! Please refer to our contribution [guidelines](docs/CONTRIBUTING.md) and [code of conduct](docs/code-of-conduct.md).
