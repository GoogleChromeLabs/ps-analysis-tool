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

A "browsing session" refers to the sequence of navigations a user follows over a period of time as they are actively engaging on the web, including activities like navigating through pages and sites, making transactions, submitting forms, downloading content, performing web searches, and so on. The overall goal of [Privacy Sandbox](https://privacysandbox.com/) is to protect users' privacy online, including reducing cross-site and cross-app user tracking during browsing sessions. This tool supports the analysis of **browsing sessions** by shedding light on cookie usage and insights and on the use and behavior of PS APIs. The goal is to help answer questions such as:

* How can I identify cookies being used on my site? 
* How can I tell what behaviors a third-party cookie is tracking on my website or what it's being used for?
* How can I block third-party cookies being set on my site by other websites unrelated to mine?
* What happens to my browsing session if 3P cookies are being blocked?
* How can I ensure that my websites are still able to function properly after third-party cookies are deprecated?
* How can I test my web applications to ensure that they are compatible with the cross-site boundary APIs and the upcoming changes to third-party cookies?
* How can I play a role in shaping the future of web development and privacy standards?
* How can I provide feedback to Google on Privacy Sandbox APIs and third-party cookie deprecation?

# Tool Functional Areas
The features and capabilities of this tool help you (developers) with the transition towards a more private web, by shedding light on data and context as you go about implementing privacy-preserving solutions to the features and capabilities of your websites and apps. The main functional areas of the tool are the following. 

<img width="937" alt="Screenshot 2023-08-21 at 10 35 19 AM" src="https://github.com/GoogleChromeLabs/ps-analysis-tool/assets/506089/3b13e478-2f67-42b3-879e-333f9a3b9357">

## Cookie Data Manipulation and Analysis
DevTools provides access to lots of information regarding every functional aspect of the browser, including cookies. This extension expands a bit the capabilities of DevTools and providing additional ways to slice and dice cookie data, making it easier for everyone to understand the behaviors of cookies on different scenarios.

<img width="946" alt="Screenshot 2023-08-21 at 1 41 13 PM" src="https://github.com/GoogleChromeLabs/ps-analysis-tool/assets/506089/e20cb6d0-f682-4c20-98c7-3b5e69be32df">


## Frame Overlays
Cookies are used as a state management mechanism to power varying features and capabilities of sites. For example, a embedded video component from some 3P provider could set and manipulate 3P cookies to serve authenticated videos without users having to re-authenticate repeatedly. This extension provides a frame overlay capability, making it easy to associate, when possible, components on a web page and the set of cookies that are associated with it. 

## Reporting
This tool provides capabilities to make it easy for users to report breakages, and connect with existing Privacy Sandbox feedback and bug reporting channels. As you leverage the capabilities of the tool to analyze and debug your critical user journeys, you can report breakages or questions about your use cases and directly send them to the proper feedback channel. This way you would get answers to your issues, and will contribute to our collective effort to ensure the ecosystem is ready for a world without 3P cookies as we know them today.

## Knowledge Access Points
The final goal of this tool is to make it easy to understand the role of 3P cookies on critical user journeys all the relevant aspects of Privacy Sandbox and the phasin out of 3P cookies. As you use the tool to analyze and debug your use cases, you will encounter links to documentation and other sources of information to support your learning and understanding as you navigate the transition to a more private web. 

# Usage instructions

🚧 This [Chrome Extension](https://developer.chrome.com/docs/extensions/mv3/) is currently being developed and the functionality is evolving rapidly. 🚧 

The Chrome extension provides capabilities surfaced via the extension pop up, the Side Panel, and as Devtools panel. And the CLI implementation parses a sitemap provided as input, and outputs a JSON file listign all cookies set while navigating through the URLs in the sitemap. Follow the following steps to get the extension installed in your browser. 

- Clone this Cookie Analysis Tool Repository
- `npm install` Install all dependencies

### Extension

- `npm run dev` or `npm run build` to genrate a build in `/dist/extension`
- Click on "Load Unpacked" button on `chrome://extensions` and upload `dist/extension` folder

### CLI

- `npm run cli:build` to genrate a build in `/dist/cli`.
- Run the cli, providing a URL or a sitemap as input.
  - E.g. `npm run cli -- -s https://<example.com>/sitemap_index.xml\`.
  - E.g. `npm run cli -- -u https://bbc.com`.

### Unpacked Extension

- Download the extension zip file from the [latest release](https://github.com/GoogleChromeLabs/ps-analysis-tool/releases) and unzip it.
- Turn on "Developer mode" in `chrome://extensions` to [load the unpacked extension](https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#load-unpacked)
- Click the "Load unpacked" button and select the unzipped extension folder.



# Call to Action

The goal of this tool is to assist users on getting knowledge and insights regarding [the upcoming deprecation of the way in which 3P cookies work](https://privacysandbox.com/open-web/#the-privacy-sandbox-timeline), and on the status an behaviors of the new Privacy Sandbox APIs. You can use the tool to analyze your site(s), your browsing experience, detect and report breakages, get support from Google on fixes, and, if you are developer of solutions that require cookie capabilities being deprecated, learn how to make them happen leveraging the new platform APIs that allow you to achieve the same goals in a privacy-preserving way. 

If you are a **first-party site developer**, you are responsible for the creation and maintenance of websites. A significant part of your work involves auditing and managing third-party dependencies to ensure that your websites run smoothly and securely. Leverage the guidance and the tooling available to help you understand the changes to third-party cookie use cases, how to integrate Privacy Sandbox APIs into your solutions, and how to troubleshoot issues that may arise.

If you are a **third-party service developer using valid cookie use cases**, you are responsible for creating and maintaining services that are integrated into other websites as third-party dependencies. If your technologies rely on cookies for various functions, such as maintaining user sessions or tracking user preferences, leverage the guidance and tooling provided to help you stay informed about the effective and responsible use of cookies.

If you are a **third-party service provider transitioning away from cookies**, you are responsible for developing third-party services that rely on cookies (such as tracking, data storage, or user session management), which need to transition to alternate methods due to evolving regulations and platform changes. Leverage the guidance and tooling available to help you integrate Privacy Sandbox APIs into your solutions, and helps troubleshoot any issues that may arise.

If you are a **Website owners or technology leader**, you are responsible for technical and business decision making, and you can leverage the guidance and tooling available to get a thorough understanding of the transformative shift that is taking place for 3P Cookies and the potential impact on user experience and privacy.

Ultimately, the web ecosystem, together, will navigate successfully this crucial transition towards a more private web platform. Let's make it happen!


# Contributing
If you have requests for features you would like to see in this tool, please file an Feature Request or join as a contributor! Please refer to our contribution [guidelines](docs/CONTRIBUTING.md) and [code of conduct](docs/code-of-conduct.md).

Another valuable form of contributing is by reporting breakages, proposing features, and engage in community discussions.
