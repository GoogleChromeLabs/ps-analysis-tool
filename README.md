<h1 align="center" style="display: block; font-size: 2.5em; font-weight: bold; margin-block-start: 1em; margin-block-end: 1em;">
<a name="logo" href="https://www.privacysandbox.com"><img align="center" src="https://github.com/GoogleChromeLabs/cookie-analysis-tool/assets/506089/62ae89de-430a-4a5b-b5bf-2a1b2f86c712" alt="Privacy Sandbox" style="width:30%;height:100%"/></a>
</h1>

## Table of contents
- [Privacy Sandbox](#privacy-sandbox)
- [Cookie Analysis](#cookie-analysis)
- [Examples](#examples)
- [Call to action](#call-to-action)
- [Resources](#resources)

## Privacy Sandbox

[Privacy Sandbox](https://privacysandbox.com/) is a multi-year [initiative by Google](https://developer.chrome.com/docs/privacy-sandbox/overview/) for building a more private web by defining a set of building blocks (i.e. proposed APIs) enabling [a new privacy model for the web](https://github.com/michaelkleber/privacy-model). This Initiative encompasses three tracks:

1. Replacing functionality powered by third-party cookies with privacy-preserving alternatives.

2. Turning down third-party cookies, while  ensuring that the ecosystem has the technical capabilities for embracing new privacy-preserving solutions (e.g. First Party Sets, Topics, etc.)

3. Mitigating workarounds, by ensuring developers have a well-lit path to the new capabilities of the platform, and avoid pursuing tracking via other means. 

Tracks #2 and #3 bring significant changes to how the web operates today, and the purpose of this tool is to shed light, provide insights, and helping you to learn and understand the changes that are happening regarding the deprecation of 3P cookies, and the potential impact on the aspects of your site or product implementation that are build using cookies.


## Cookie Analysis

This Cookie Analysis Tool is designed to provide detailed information about cookie usage during browsing sessions. It tracks and analyzes the various cookies that websites place on your browser, and it offers a comprehensive overview of their origins, their purposes, their expiry dates. It also provide context and access points to knowledge about 3P cookies and [Privacy Sandbox APIs](https://privacysandbox.com/open-web/#proposals-for-the-web). This tool can be accessed as a [Chrome Extension](https://developer.chrome.com/docs/extensions/mv3/), or via a CLI on your terminal. 

### Extension
The Chrome extension provides a quick summary analysis via a pop-up from th extension icon, as well as cookie anlaysis dev tools panel.

### CLI

A CLI tool which parses a sitemap provided as input, and outputs a JSON file listign all cookies set while navigsting through the URLs in the sitemap. 

### Usage instructions

- Clone this Cookie Analysis Tool Repository
- `npm install` Install all dependencies

#### Extension

- `npm run extension:dev` or `npm run extension:build` to genrate a build in `/dist/extension`
- Click on "Load Unpacked" button on [chrome://extensions/](chrome://extensions/) and upload `dist/extension` folder

#### CLI

- `npm run cli:build` to genrate a build in `/dist/cli`.
- Run the cli util providing a sitemap as input. E.g. `node dist/cli/index.js -s https://<example.com>/sitemap_index.xml\`.

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

## Resources

* [The Privacy Sandbox](https://developer.chrome.com/privacy-sandbox/) 
* [A Potential New Privacy Model for the Web](https://github.com/michaelkleber/privacy-model)
* [Chrome Facilitated Testing](https://developer.chrome.com/en/docs/privacy-sandbox/chrome-testing/)

## Contributing
If you have requests for features you would like to see in this tool, please file an Feature Request or join as a contributor! Please refer to our contribution [guidelines](docs/CONTRIBUTING.md) and [code of conduct](docs/code-of-conduct.md).
