## Privacy Sandbox Analysis Tool CLI

> The Privacy Sandbox Analysis Tool CLI aims to empower developers to prepare their sites/applications for the upcoming deprecation of Third-party Cookies (3PC) on Chrome as part of the Privacy Sandbox initiative.


## Using the Node CLI

The PSAT CLI offers the most flexibility in configuration, execution, and reporting for maximum control and automation of third-party cookie audits. It's ideal for advanced users and automated workflows.

> Required Node Version: 18 or later


### Installation

```
npm i -g @google-psat/cli
```

### Usage

```
psat https://example.com
```


By default, PSAT generates the report as an HTML file. You can open it in a web browser of your choice and use it to filter the output.

### CLI option

```                                   
Usage: psat [options]

CLI to test a URL for third-party cookies

Arguments:
  url                         The URL of a website or sitemap you want to analyse.

Options:
  -V, --version               output the version number
  -u, --url <value>           URL of a site
  -s, --sitemap-url <value>   URL of a sitemap
  -c, --csv-path <value>      Path to a CSV file with a set of URLs.
  -p, --sitemap-path <value>  Path to a sitemap saved in the file system
  -l, --locale <value>        Locale to use for the CLI, supported: en, hi, es, ja, ko, pt-BR
  -ul, --url-limit <value>    No of URLs to analyze
  -nh, --no-headless          Flag for running puppeteer in non-headless mode
  -np, --no-prompts           Flags for skipping all prompts. Default options will be used
  -nt, --no-technology        Flags for skipping technology analysis.
  -d, --out-dir <value>       Directory path where the analysis data will be stored
  -ab, --accept-banner        This will accept the GDPR banner if present.
  -h, --help                  display help for command

```

### Output
After running the analysis, it will create a report in `/out/` directory
```bash
psat -u https://www.google.co.in
✓ Done analyzing cookies.
✓ Done analyzing technologies.
Report created successfully: /Users/username/projects/psat-cli-tool/out/www-google-co-in/index.html
```

Open the generated HTML file in the browser.

![PSAT CLI Output](https://s3.amazonaws.com/i.snag.gy/Dyzq6N.jpg)

## Docs

- Learn more about the [Privacy Sandbox](https://privacysandbox.com/) initiative.
- Visit our [wiki](https://github.com/GoogleChromeLabs/ps-analysis-tool/wiki/) for more information about PSAT.
- Please refer to the [CLI output](https://github.com/GoogleChromeLabs/ps-analysis-tool/wiki/PSAT-Command-Line-Interface#cli-output) section on our wiki for a better understanding of the reports.
- To learn about cookie filters, check the [Cookie table](https://github.com/GoogleChromeLabs/ps-analysis-tool/wiki/Cookies-Table) section on the wiki.


## Contributing
We welcome your patches and contributions to this project. Whether you're a frequent contributor or addressing a specific issue that matters to you, we appreciate your input.

To develop and contribute, please refer to our [contribution guide](https://github.com/GoogleChromeLabs/ps-analysis-tool/blob/main/docs/CONTRIBUTING.md) for detailed information.


## Using PSAT in Chrome extension

PSAT is available as a Chrome extension that allows you to do an analysis while interacting with websites.

### Installation: 

You can install the PSAT extension from the [Chrome web store](https://chromewebstore.google.com/detail/privacy-sandbox-analysis/ehbnpceebmgpanbbfckhoefhdibijkef)

To run it: Visit the website you want to analyze, open Chrome DevTools, and select the Privacy Sandbox panel.

![PSAT Chrome Extension](https://s3.amazonaws.com/i.snag.gy/OcCl5i.jpg)