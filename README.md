<h1 align="center" style="display: block; font-size: 2.5em; font-weight: bold; margin-block-start: 1em; margin-block-end: 1em;">
<a name="logo" href="https://www.privacysandbox.com"><img align="center" src="https://github.com/GoogleChromeLabs/ps-analysis-tool/assets/506089/62ae89de-430a-4a5b-b5bf-2a1b2f86c712" alt="Privacy Sandbox" style="width:30%;height:100%"/></a>
</h1>

# Table of contents

- [Privacy Sandbox](#privacy-sandbox)
- [Call to action](#call-to-action)
- [Browsing Session Analysis](#browsing-session-analysis)
- [Tool Architecture](#tool-architecture)
- [Usage Instructions](#usage-instructions)
- [Contributing](#contributing)

# Privacy Sandbox

[Privacy Sandbox](https://privacysandbox.com/) is a multi-year [initiative by Google](https://developer.chrome.com/docs/privacy-sandbox/) for building a more private web by defining a set of building blocks (i.e. proposed APIs) enabling [a new privacy model for the web](https://github.com/michaelkleber/privacy-model). This Initiative encompasses three tracks:

1. Replacing functionality powered by third-party cookies with privacy-preserving alternatives.

2. Turning down third-party cookies, while  ensuring that the ecosystem has the technical capabilities for embracing new privacy-preserving solutions (e.g. First Party Sets, Topics, etc.)

3. Mitigating workarounds, by ensuring developers have a well-lit path to the new capabilities of the platform, and avoid pursuing tracking via other means. 

Tracks #2 and #3 bring significant changes to how the web operates today, and the purpose of this tool is to shed light, provide insights, and helping you to learn and understand the changes that are happening regarding the deprecation of 3P cookies, and the potential impact on the aspects of your site or product built using cookies. 

# Call to Action

The goal of this tool is to assist users on getting knowledge and insights regarding [the upcoming deprecation of the way in which 3P cookies work](https://privacysandbox.com/open-web/#the-privacy-sandbox-timeline), and on the status an behaviors of the new Privacy Sandbox APIs. You can use the tool to analyze your site(s), your browsing experience, detect and report breakages, get support from Google on fixes, and, if you are developer of solutions that require functionality of cookis being deprecated, learn how to make them happen leveraging the new platform APIs that allow you to achieve the same goals in a privacy-preserving way. 

**First-party site developers**: you are responsible for the creation and maintenance of websites. A significant part of your work involves auditing and managing third-party dependencies to ensure that your websites run smoothly and securely. This tool helps you understand the changes to 3P cookie use cases, how to integrate Privacy Sandbox APIs into your solutions, and how to troubleshoot issues that may arise.

**Third-Party Service Providers using valid cookie use cases**: you are responsible for creating and maintaining services that are integrated into other websites as third-party dependencies, and rely on cookies for various functions, such as maintaining user sessions or tracking user preferences. This tool helps you to stay informed and guided on the effective and responsible use of cookies.

**Third-Party Service Providers transitioning away from cookies** : you are responsible for developing third-party services that rely on cookies (e.g. tracking, data storage, or user session management), which need to transition to alternate methods due to evolving regulations and platform changes. This tool provides you with guidance and technical support on integrating Privacy Sandbox APIs into your solutions, and troubleshoot any issues that may arise.

**Website owners and technology leaders**: you are responsible for tech and business decision making. This tool is intended to provide you with reports and insights about the cookies usage by your sites and the potential impact on user privacy.

# Browsing Session Analysis

The overall goal of [Privacy Sandbox](https://privacysandbox.com/) is to protect users' privacy online. This encompasses reducing cross-site and cross-app tracking during browsing sessions and beyond. A "browsing session" refers to the sequence of navigations a user follows over aperiod of time as they are actively engaging on the web, including activities like navigating through pages and sites, making transactions, submitting forms, or downloading content, performing web searches, and so on. 

This tool aims at supporting the analysis of **browsing sessions** (t,  by shedding light on cookie usage and insights, and the use and behavior of PS APIs. The goal is to help answer questions such as:

* How can I identify cookies being used on my site? 
* How can I tell what behaviors a third party cookie is tracking on my website or what it's being used for?
* How can I block third party cookies being set on my site by other websites unrelated to mine?
* What happens to my browsing session if 3P cookies are being blocked?
* How can I ensure that my websites are still able to function properly after third-party cookies are deprecated?
* How can I test my web applications to ensure that they are compatible with the cross-site boundary APIs and the upcoming changes to third-party cookies?
* How can I play a role in shaping the future of web development and privacy standards?
* How can I provide feedback to Google on Privacy Sandbox APIs and third-party cookie deprecation?


# Tool Architecture

Chrome Extensions are small programs that can be installed in Chrome to add new features or change the way Chrome works.Extensions can be used to do things like block ads, change the look of Chrome, or add new functionality to Chrome. The Privacy Analysis tool is implementented as a Chrome Extension structured as a set of processing and analysis modules, and producing output tailored to different user interfaces for different use cases. 

<p align="center">
  <img src="https://github.com/GoogleChromeLabs/ps-analysis-tool/assets/506089/6049673e-3508-4e03-8649-55b6f938abb9" width="70%" height="100%">
</p>

## Input
The input to the tool is composed of network traffic and browser data collected during a given browsing session.

## Output

The tool produces output for three different access points, serving the needs of the different members of our [target audience](#target-audience): 

| Surface | Description |
|---------|--------|
|DevTools Panel | Main user interface of the tool. Learning, monitoring, and debugging capabilities for developers responsible for making 1P sites work and developing 3P services |
|Icon popup and Side Panel| Dynamic monitoring capabilities. Basic privacy-sandbox-related information, such as status of cookies, classification results at any given time (e.g. how many marketing cookies?)|
|Google Admin Console| For enterprise users. Extend Google Admin UI with 3PCD/PS analysis information |

 
## Data Gathering

[Chrome's APIs](https://developer.chrome.com/docs/extensions/reference/) enable developers to extend and interact with the browser's functionality and gather/manipulate web content. This tool leverages various Chome APIs to power its capabilities: chrome.webRequest, chrome.tabs, chrome.storage, devtools.panels, devtools.network, and others. 

## Data Processing

| Module | Description |
|-------|---------|
| Parsing| Extract information from network streams|
| Classification | Leverage and extend existing cookie DBs to classify observed cookies |
| Insights | Privacy Sandbox inisghts and "debugging" information|

## Services
This module provide services shareable to other parts of the tool.

| Service | Description |
|-------|---------|
| Data Storage| Capabilities for storing and querying data gathered and processed by the tool |
| Rendering | Components to generate UI/UX for each of the different output modules|

# Usage instructions

This tool can be accessed as a [Chrome Extension](https://developer.chrome.com/docs/extensions/mv3/), or via a CLI on your terminal.
The Chrome extension provides capabilities surfaced via the extension pop up, the Side Panel, and as Devtools panel. And the CLI implementation parses a sitemap provided as input, and outputs a JSON file listign all cookies set while navigating through the URLs in the sitemap. Follow the following steps to get the extension installed in your browser. 

- Clone this Cookie Analysis Tool Repository
- `npm install` Install all dependencies

### Extension

- `npm run dev` or `npm run build` to genrate a build in `/dist/extension`
- Click on "Load Unpacked" button on [chrome://extensions/](chrome://extensions/) and upload `dist/extension` folder

### CLI

- `npm run cli:build` to genrate a build in `/dist/cli`.
- Run the cli util providing a sitemap as input. E.g. `node dist/cli/index.js -s https://<example.com>/sitemap_index.xml\`.

# Contributing
If you have requests for features you would like to see in this tool, please file an Feature Request or join as a contributor! Please refer to our contribution [guidelines](docs/CONTRIBUTING.md) and [code of conduct](docs/code-of-conduct.md).

[Another form of contributing is by reporting breakages, proposing features, and engage in community discussions]
