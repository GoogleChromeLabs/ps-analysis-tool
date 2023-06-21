<h1 align="center" style="display: block; font-size: 2.5em; font-weight: bold; margin-block-start: 1em; margin-block-end: 1em;">
<a name="logo" href="https://www.privacysandbox.com"><img align="center" src="https://github.com/GoogleChromeLabs/cookie-analysis-tool/assets/506089/62ae89de-430a-4a5b-b5bf-2a1b2f86c712" alt="Privacy Sandbox" style="width:30%;height:100%"/></a>
</h1>

## Table of contents
- [Privacy Sandbox](#privacy-sandbox)
- [Target audience](#target-audience)
- [Privacy Sandbox Analysis](#privacy-sandbox-analysis)
- [How the Tool Works](#how-the-tool-works)
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

## Privacy Sandbox Analysis

The Privacy Sandbox Analysis tool is designed to provide detailed information about cookie usage during browsing sessions, and shed light on the use and behavior of PS APIs. The tool provides capabilities for tracking and analyzing the cookies that are placed on the browser as you go through your browsing session, and it also provides context and knowledge access points to learn about 3P cookies and [Privacy Sandbox APIs](https://privacysandbox.com/open-web/#proposals-for-the-web). 

This tool can be accessed as a [Chrome Extension](https://developer.chrome.com/docs/extensions/mv3/), or via a CLI on your terminal. 

### Extension
The Chrome extension provides capabilities surfaced via the extension pop up, the Side Panel, and as Devtools panel. 

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

### Browsing Session Analysis 
The goal of this tool is to help you to answer questions as these:

* How can I identify cookies being used on my site? 
* How can I tell what behaviors a third party cookie is tracking on my website or what it's being used for?
* How can I block third party cookies being set on my site by other websites unrelated to mine?
* How can I ensure that my websites are still able to function properly after third-party cookies are deprecated?
* How can I, as a developer, test my web applications to ensure that they are compatible with the cross-site boundary APIs and the upcoming changes to third-party cookies?
* How can developers provide feedback to Google on the cross-site boundary APIs and the third-party cookie deprecation, and what role can they play in shaping the future of web development and privacy standards?

To provide these kind of assistance the tool encompasses a modular architecture with a set of processing and analysis components, and also different user interface entry points.

### Architecture
<p align="center">
  <img src="https://github.com/GoogleChromeLabs/ps-analysis-tool/assets/506089/6049673e-3508-4e03-8649-55b6f938abb9" width="70%" height="100%">
</p>

### Input
The input to the tool is composed of network traffic and browser data during a browsing session. 

### Output

The tool produces output for three different access points, serving the needs of the different members of our [target audience](#target-audience): 

1. DevTools Panel
2. Icon popup and Side Panel
3. Google Admin Console

#### DevTools Panel
- Main user interface of the tool.
- Learning, monitoring, and debugging capabilities for developers responsible for making 1P sites work and developing 3P services. 

#### Icon Popup, Side Panel
- Dynamic monitoring capabilities
- Basic privacy-sandbox-related information, such as status of cookies, classification results at any given time (e.g. how many marketing cookies?)

#### Google Admin Console
- For enterprise users
- Extend Google Admin UI with 3PCD/PS analysis information
-  
### Data Gathering

The data provided as input to the tool are gathered using [Chrome APIs](https://developer.chrome.com/docs/extensions/reference/), which include all the web platform standard APIs, and chrome-secific APIs such as Chome Enterprise APIs, and DevTools APIs.

### Data Processing

#### Parsing
- Cookie Scanner
- Tap into Chrome and DevTools APIs to gather cookie information from network streams

#### Classification
- Leverage existing cookie DBs to classify observed cookies

#### Insights
- Provide capabilities to toggle cookies on/off, and manipulate their values to test behaviors of sites

### Services
This module provide services shareable to other parts of the tool

#### Rendering
- Components to generate UI/UX for each of the different output modules

#### Data Storage
- Capabilities for storing and querying data gathered and processed by the tool


#### Analysis of Privacy Sandbox APIs

The provide dedicated analysis panels for various PS 

- Topics
- Protected Audiences
- CHIPS
- Storage Access

## Call to Action
[Tailored CTAs for each [target audience](#target-audience).]

The goal of this tool is to assist users on understanding cookie behaviors and their impact on browsing experience, and getting insights regarding [the upcoming deprecation of the way in which 3P cookies work](https://privacysandbox.com/open-web/#the-privacy-sandbox-timeline). The way to achieve this is to use the tool to analyze your site(s), your browsing experience, detect and report breakages, get support from Google on fixes, and, if you are developer of solutions that require functionality of cookis being deprecated, learn how to make them happen leveraging the new platform APIs that allow you to achieve the same goals in a privacy-preserving way. 

If you are a **first-party site developer** developing and/or maintaining the site(s) for your organization, use the tool to gain insights into third-party cookie usage in your products and identify and troubleshoot potential issues to ensure your websites run smoothly.

If you are **third-party service provider using valid cookie use cases**, use the tool to stay up-to-date on best practices and methods of using cookies effectively accounting for the upcoming changes in how 3P cookies work. 

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
