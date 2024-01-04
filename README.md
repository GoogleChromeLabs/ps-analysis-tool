<h1 align="center" style="display: block; font-size: 2.5em; font-weight: bold; margin-block-start: 1em; margin-block-end: 1em;">
<a name="logo" href="https://www.privacysandbox.com"><img align="center" src="https://github.com/GoogleChromeLabs/ps-analysis-tool/assets/506089/62ae89de-430a-4a5b-b5bf-2a1b2f86c712" alt="Privacy Sandbox" style="width:30%;height:100%"/></a>
</h1>

# Privacy Sandbox

[Privacy Sandbox](https://privacysandbox.com/) is a multi-year [initiative by Google](https://developer.chrome.com/docs/privacy-sandbox/) for building a more private web by defining a set of building blocks (i.e. proposed APIs) enabling [a new privacy model for the web](https://github.com/michaelkleber/privacy-model). Privacy Sandbox encompasses replacing functionality powered by third-party cookies with privacy-preserving alternatives, deprecating third-party cookies, and ensuring developers have a well-lit path to the new capabilities of the platform, and avoid pursuing tracking via other means. 

This repository is home to the Privacy Sandbox Analysis DevTools extension (PSAT), which is a tool aimed at assisting developers in preparing their websites for the changes that are happening in Chrome in the context of Privacy Sandbox, and ensuring a seamless transition to a more private web.

# Learn how to use PSAT

You can start by [installing and running PSAT](https://github.com/GoogleChromeLabs/ps-analysis-tool/wiki/Evaluation-Environment#installing-psat-from-chrome-web-store) right away! And to learn everything about using PSAT, check out the repository's [wiki page](https://github.com/GoogleChromeLabs/ps-analysis-tool/wiki), which contains detailed information about analyzing and debugging specific scenarios, and will help you map them to the specifics of your site. 

# Call to Action

The goal of this tool is to assist users in getting knowledge and insights regarding [the upcoming deprecation of the way in which 3P cookies work](https://privacysandbox.com/open-web/#the-privacy-sandbox-timeline), and the status and behaviors of the new Privacy Sandbox APIs. You can use the tool to analyze your site(s), and your browsing experience, detect and report breakages, get support from Google on fixes, and, if you are a developer of solutions that require cookie capabilities being deprecated, learn how to make them happen leveraging the new platform APIs that allow you to achieve the same goals in a privacy-preserving way. 

If you are a **first-party site developer**, you are responsible for the creation and maintenance of websites. A significant part of your work involves auditing and managing third-party dependencies to ensure that your websites run smoothly and securely. Leverage the guidance and the tooling available to help you understand the changes to third-party cookie use cases, how to integrate Privacy Sandbox APIs into your solutions, and how to troubleshoot issues that may arise.

If you are a **third-party service developer using valid cookie use cases**, you are responsible for creating and maintaining services that are integrated into other websites as third-party dependencies. If your technologies rely on cookies for various functions, such as maintaining user sessions or tracking user preferences, leverage the guidance and tooling provided to help you stay informed about the effective and responsible use of cookies.

If you are a **third-party service provider transitioning away from cookies**, you are responsible for developing third-party services that rely on cookies (such as tracking, data storage, or user session management), which need to transition to alternate methods due to evolving regulations and platform changes. Leverage the guidance and tooling available to help you integrate Privacy Sandbox APIs into your solutions, and help troubleshoot any issues that may arise.

If you are a **Website owner or technology leader**, you are responsible for technical and business decision-making, and you can leverage the guidance and tooling available to get a thorough understanding of the transformative shift that is taking place for 3P Cookies and the potential impact on user experience and privacy.

Ultimately, the web ecosystem, together, will navigate successfully this crucial transition towards a more private web platform. Let's make it happen!
