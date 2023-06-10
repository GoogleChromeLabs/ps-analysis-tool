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

Tracks #2 and #3 bring significant changes to how the web operates today, and the purpose of this tool is to shed light, provide insights, and helping you to learn and understand the changes that are happening regarding the deprecation of 3P cookies, and the potential impact on the aspects of your site or product built using cookies. 

## Target Audience

**First-party site developers**: responsible for the creation and maintenance of websites. A significant part of their work involves auditing and managing third-party dependencies to ensure that their websites run smoothly and securely. They need to understand the changes to 3P cookie use cases,  how to integrate Privacy Sandbox APIs into their solutions, and how to troubleshoot any issues that arise.

**Third-Party Service Providers using valid cookie use cases**: responsible for creating and maintaining services that are integrated into other websites as third-party dependencies, and rely on cookies for various functions, such as maintaining user sessions or tracking user preferences. They need to stay informed and guided on understanding how to use cookies effectively and responsibly, in compliance with all relevant laws and regulations.

**Third-Party Service Providers transitioning away from cookies** : responsible for developing third-party services that rely on cookies (e.g. tracking, data storage, or user session management), which need to transition to alternate methods due to evolving regulations and platform changes. They need guidance and technical support for understanding  how to integrate Privacy Sandbox APIs into their solutions, and how to troubleshoot any issues that arise.

**Website owners and technology leaders**: responsible for tech and business decision making. They need the ability to get reports and insights about the cookies usage by their sites and the potential impact on user privacy.

## Cookie Analysis

This Cookie Analysis Tool is designed to provide detailed information about cookie usage during browsing sessions. It tracks and analyzes the various cookies that websites place on your browser, and it offers a comprehensive overview of their origins, their purposes, their expiry dates, and other relevant information. It also provides context and knowledge access points to about 3P cookies and [Privacy Sandbox APIs](https://privacysandbox.com/open-web/#proposals-for-the-web). 

This tool can be accessed as a [Chrome Extension](https://developer.chrome.com/docs/extensions/mv3/), or via a CLI on your terminal. 

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

### Archictecture 🚧

- Architectural diagrams
- Clear explanation of what is being tracked/analyzed
- Code references enabling open source verification of claims

### User Interface 🚧

#### Icon

#### Popup

#### Side Panel

#### DevTools Panel

## Features 🚧

| Feature       | Description   |
| ------------- | ------------- |
| List| Detect and list all the cookies on a given web page|
| Classify| Classify observed cookies across different categories|
| Summary View | Display cookie analysis summary in extension icon pop up |
| CLI | CLI to cookie analysis on sets of URLs (e.g. Sitemap) |


## Call to Action 🚧
[Tailored CTAs for each [target audience](#target-audience).]

The goal of this tool is to assist users on understanding cookie behaviors and their impact on browsing experience, and getting insights regarding [the upcoming deprecation of the way in which 3P cookies work](https://privacysandbox.com/open-web/#the-privacy-sandbox-timeline). The way to achieve this is to use the tool to analyze your site(s), your browsing experience, detect and report breakages, get support from Google on fixes, and, if you are developer of solutions that require functionality of cookis being deprecated, learn how to make them happen leveraging the new platform APIs that allow you to achieve the same goals in a privacy-preserving way. 

If you are a **first-party site developer** developing and/or maintaining the site(s) for your organization, use the tool to...

If you are **third-party service provider using valid cookie use cases**, use the tool to...

If you are a **third-party service providers transitioning away from cookies**, use the toool to...

If you are a **website owners and/or technology leader**, use the tool to...

## Resources
The Privacy Sandbox initiative aims to create technologies that both protect people's privacy online and give companies and developers tools to build thriving digital businesses. The goal of Privacy Sandbox is to reduce cross-site and cross-app tracking while helping to keep online content and services free for all. There are several entry points to sources of information about the Privacy Sandbox in general 

* Privacy Sandbox [main site](https://privacysandbox.com/)
* Privacy Sandbox for developers: [developer.Chrome](https://developer.chrome.com/privacy-sandbox/), [testing](https://developer.chrome.com/en/docs/privacy-sandbox/chrome-testing/)
* A Potential New Privacy Model for the Web [explainer](https://github.com/michaelkleber/privacy-model)

## Contributing
If you have requests for features you would like to see in this tool, please file an Feature Request or join as a contributor! Please refer to our contribution [guidelines](docs/CONTRIBUTING.md) and [code of conduct](docs/code-of-conduct.md).

[Another form of contributing is by reporting breakages, proposing features, and engage in community discussions]
