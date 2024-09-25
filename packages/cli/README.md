<p align="center">
<img src="https://raw.githubusercontent.com/GoogleChromeLabs/ps-analysis-tool/main/packages/extension/icons/icon.svg" height="100" width="100">
</p>

## Privacy Sandbox Analysis Tool CLI

>The Privacy Sandbox Analysis Tool CLI is designed to help developers audit and analyze their websites in Chrome environments where the unrestricted use of 3P cookies has been blocked.


## Using the CLI

PSAT CLI allows you to audit a single website or multiple websites using a sitemap or a CSV file. It generates a report to help users draft future action items to prepare their websites for environments where the unrestricted use of 3P cookies has been blocked.

> Required Node Version: 18 or later


### Installation

```
npm i -g @google-psat/cli
```

### Usage

```
psat -u https://example.com
```


By default, PSAT generates the report as an HTML file. You can open it in a web browser of your choice and use it to filter the output.

### CLI option

```                                   
Usage: npm run cli [website-url] -- [options]

CLI to test a URL for 3p cookies.

Arguments:
  website-url                    The URL of a single site to analyze

Options:
  -V, --version                  output the version number
  -u, --url <url>                The URL of a single site to analyze
  -s, --source-url <url>         The URL of a sitemap or CSV to analyze
  -f, --file <path>              The path to a local file (CSV or XML sitemap) to analyze
  -n, --number-of-urls <num>     Limit the number of URLs to analyze (from sitemap or CSV)
  -d, --display                  Flag for running CLI in non-headless mode (default: false)
  -v, --verbose                  Enables verbose logging (default: false)
  -o, --out-dir <path>           Directory to store analysis data (JSON, CSV, HTML) without launching the dashboard
  -i, --ignore-gdpr              Ignore automatically accepting the GDPR banner if present (default: false)
  -q, --quiet                    Skips all prompts; uses default options (default: false)
  -c, --concurrency <num>        Number of tabs to open in parallel during sitemap or CSV analysis (default: 3)
  -w, --wait <num>               Number of milliseconds to wait after the page is loaded before generating the report (default: 20000)
  -l, --locale <language>        Locale to use for the CLI, supported: en, hi, es, ja, ko, pt-BR (default: "en")
  -b, --button-selectors <path>  The path to a JSON file that contains selectors or button text to be used for GDPR banner acceptance
  -h, --help                     Display help for command

To learn more, visit our wiki: https://github.com/GoogleChromeLabs/ps-analysis-tool/wiki.
```

### Output
After running the analysis, it will create a report in `/out/` directory
```bash
psat -u https://www.google.co.in
✓ Done analyzing cookies.
Report created successfully: /Users/username/projects/psat-cli-tool/out/www-google-co-in/report_2024-07-31_14-41-27.html
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
