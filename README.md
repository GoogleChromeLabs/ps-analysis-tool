<h1 align="center" style="display: block; font-size: 2.5em; font-weight: bold; margin-block-start: 1em; margin-block-end: 1em;">
<a name="logo" href="https://www.privacysandbox.com"><img align="center" src="https://github.com/GoogleChromeLabs/ps-analysis-tool/assets/506089/62ae89de-430a-4a5b-b5bf-2a1b2f86c712" alt="Privacy Sandbox" style="width:30%;height:100%"/></a>
</h1>

# Table of contents

- [Privacy Sandbox](#privacy-sandbox)
- [Browsing Session Analysis](#browsing-session-analyses)
- [Tool Functional Areas](#tool-functional-areas)
- [Usage Instructions](#usage-instructions)
- [Call to action](#call-to-action)
- [Contributing](#contributing)

# Privacy Sandbox

[Privacy Sandbox](https://privacysandbox.com/) is a multi-year [initiative by Google](https://developer.chrome.com/docs/privacy-sandbox/) for building a more private web by defining a set of building blocks (i.e. proposed APIs) enabling [a new privacy model for the web](https://github.com/michaelkleber/privacy-model). This Initiative encompasses three tracks:

1. Replacing functionality powered by third-party cookies with privacy-preserving alternatives.

2. Turning down third-party cookies, while  ensuring that the ecosystem has the technical capabilities for embracing new privacy-preserving solutions (e.g. First Party Sets, Topics, etc.)

3. Mitigating workarounds, by ensuring developers have a well-lit path to the new capabilities of the platform, and avoid pursuing tracking via other means. 

Tracks #2 and #3 bring significant changes to how the web operates today, and the purpose of this tool is to shed light, provide insights, and helping you to learn and understand the changes that are happening regarding the deprecation of 3P cookies, and the potential impact on the aspects of your site or product built using cookies. 

# Browsing Session Analyses

A "browsing session" refers to the sequence of navigations a user follows over a period of time as they are actively engaging on the web, including activities like navigating through pages and sites, making transactions, submitting forms, or downloading content, performing web searches, and so on. The overall goal of [Privacy Sandbox](https://privacysandbox.com/) is to protect users' privacy online, including reducing cross-site and cross-app user tracking during browsing sessions. This tool supports the analysis of **browsing sessions** by shedding light on cookie usage and insights, and on use and behavior of PS APIs. The goal is to help answer questions such as:

* How can I identify cookies being used on my site? 
* How can I tell what behaviors a third party cookie is tracking on my website or what it's being used for?
* How can I block third party cookies being set on my site by other websites unrelated to mine?
* What happens to my browsing session if 3P cookies are being blocked?
* How can I ensure that my websites are still able to function properly after third-party cookies are deprecated?
* How can I test my web applications to ensure that they are compatible with the cross-site boundary APIs and the upcoming changes to third-party cookies?
* How can I play a role in shaping the future of web development and privacy standards?
* How can I provide feedback to Google on Privacy Sandbox APIs and third-party cookie deprecation?

# Tool Functional Areas

## Advanced Data Analysis
DevTools provides access to lots of information regarding every functional aspect of the browser, including cookies. This extensions expands a bit the capabilities of DevTools and providing additional ways to slice and dice cookie data, making it easier for everyone to understand the behaviors of cookies on different scenarios.

## Frame Overlays
Cookies are used as a state management mechanism to power varying features and capabilities of sites. For example, a embedded video component from some 3P provider could set and manipulate 3P cookies to serve authenticated videos without users having to re-authenticate repeatedly. This extension provides a frame overlay capability, making it easy to associate, when possible, componets on a web page and the set of cookies that are associated with it. 

## Reporting
This tool provides capabilities to make it easy for users to report breakages, and connect with existing Privacy Sandbox feedback and bug reporting channels. As you leverage the capabilities of the tool to anlyze and debug your cirtical user journeys, you can report breakages or questions about your use cases and directly send them to the proper feedback channel. This way you would geet answers to your issues, and will contribute to our collective effort to ensure the ecosystem is ready for a world without 3P cookies as we know them today.

## Knowledge Access Points
The final goal of this tool is to make it easy to understand the role of 3P cookies on critical user journeys all the relevant aspects of Privacy Sandbox and the phasin out of 3P cookies. As you use the tool to analyze and debug your use cases, you will encounter links to documentation and other sources of information to support your learning and understanding as you navigate the transition to a more private web. 

# Usage instructions

This repository contanis the PS analysis tool as a [Chrome Extension](https://developer.chrome.com/docs/extensions/mv3/), and as a CLI tool.
The Chrome extension provides capabilities surfaced via the extension pop up, the Side Panel, and as Devtools panel. And the CLI implementation parses a sitemap provided as input, and outputs a JSON file listign all cookies set while navigating through the URLs in the sitemap. Follow the following steps to get the extension installed in your browser. 

- Clone this Cookie Analysis Tool Repository
- `npm install` Install all dependencies

### Extension

- `npm run dev` or `npm run build` to genrate a build in `/dist/extension`
- Click on "Load Unpacked" button on [chrome://extensions/](chrome://extensions/) and upload `dist/extension` folder

### CLI

- `npm run cli:build` to genrate a build in `/dist/cli`.
- Run the cli util providing a sitemap as input. E.g. `node dist/cli/index.js -s https://<example.com>/sitemap_index.xml\`.

# Call to Action

The goal of this tool is to assist users on getting knowledge and insights regarding [the upcoming deprecation of the way in which 3P cookies work](https://privacysandbox.com/open-web/#the-privacy-sandbox-timeline), and on the status an behaviors of the new Privacy Sandbox APIs. You can use the tool to analyze your site(s), your browsing experience, detect and report breakages, get support from Google on fixes, and, if you are developer of solutions that require cookie capabilities being deprecated, learn how to make them happen leveraging the new platform APIs that allow you to achieve the same goals in a privacy-preserving way. 

**First-party site developers**: you are responsible for the creation and maintenance of websites. A significant part of your work involves auditing and managing third-party dependencies to ensure that your websites run smoothly and securely. This tool helps you understand the changes to 3P cookie use cases, how to integrate Privacy Sandbox APIs into your solutions, and how to troubleshoot issues that may arise.

**Third-Party Service Providers using valid cookie use cases**: you are responsible for creating and maintaining services that are integrated into other websites as third-party dependencies, and rely on cookies for various functions, such as maintaining user sessions or tracking user preferences. This tool helps you to stay informed and guided on the effective and responsible use of cookies.

**Third-Party Service Providers transitioning away from cookies** : you are responsible for developing third-party services that rely on cookies (e.g. tracking, data storage, or user session management), which need to transition to alternate methods due to evolving regulations and platform changes. This tool provides you with guidance and technical support on integrating Privacy Sandbox APIs into your solutions, and troubleshoot any issues that may arise.

**Website owners and technology leaders**: you are responsible for tech and business decision making. This tool is intended to provide you with reports and insights about the cookies usage by your sites and the potential impact on user privacy.

# Contributing
If you have requests for features you would like to see in this tool, please file an Feature Request or join as a contributor! Please refer to our contribution [guidelines](docs/CONTRIBUTING.md) and [code of conduct](docs/code-of-conduct.md).

Another valuable form of contributing is by reporting breakages, proposing features, and engage in community discussions.
