# cookie-analysis-tool
Cookie Analysis Tooling for learning, understanding, and preparing for the upcoming deprecation of the 3P cookies and the release of [Privacy Sandbox APIs](https://privacysandbox.com/open-web/#proposals-for-the-web).

# Privacy Sandbox Analysis

[Privacy Sandbox](https://privacysandbox.com/) is a multi-year [initiative by Google](https://developer.chrome.com/docs/privacy-sandbox/overview/) for building a more private web by defining a set of building blocks (i.e. proposed APIs) enabling [a new privacy model for the web](https://github.com/michaelkleber/privacy-model). This Initiative encompasses three tracks:

1. Replacing functionality powered by third-party cookies with privacy-preserving alternatives.

2. Turning down third-party cookies, while  ensuring that the ecosystem has the technical capabilities for embracing new privacy-preserving solutions (e.g. First Party Sets, Topics, etc.)

3. Mitigating workarounds, by ensuring developers have a well-lit path to the new capabilities of the platform, and avoid pursuing tracking via other means. 

## Cookie Analysis

### Extension
A chrome extension to give info about cookie usage in a browsing experience.

#### Usage instruction

- `npm install` Install all dependencies
- `npm run extension:dev` or `npm run extension:build` to genrate a build in `/dist/extension`
- Click on "Load Unpacked" button on [chrome://extensions/](chrome://extensions/) and upload `dist/extension` folder

### CLI

A CLI tool which crawls a sitemap (provided as an argument) and outputs a JSON file in out folder. This JSON file will have all lists of all 3p cookies set on a site visit

#### Usage instruction

- `npm install` Install all dependencies
- `npm run cli:build` to genrate a build in `/dist/cli`.
- Then cli util can be used example - `node dist/cli/index.js -s https://<example.com>/sitemap_index.xml\`.


# Resources

* [The Privacy Sandbox](https://privacysandbox.com/)
* [A Potential New Privacy Model for the Web](https://github.com/michaelkleber/privacy-model)

# Contributing
Please refer to our contribution [guidelines](docs/CONTRIBUTING.md) and [code of conduct](docs/code-of-conduct.md).
