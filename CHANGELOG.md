# v0.0.2

**Feature**

- Add a cookie view card to see the data of individual cookies. [PR#46](https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/46)
- Classify cookies by their use case and origin [PR#25](https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/25)
- Add new tabs and refactor code [PR#52](https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/52)
- Adds Info Cards for a concise definition of each PS API [PR#54](https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/54)
- Add an extension popup to show the cookie summary. [PR#53](https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/53)

**Fix**

- Implement the `tldts` package for identifying first and third-party domains. [PR#49](https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/49)

**Chore**

- Setup storybook [PR#63](https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/63)


---

# v0.1.0

**Feature**

- Add cookie table and details components with tabular UI [PR#82](https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/82)
- Vertical menu items [PR#86](https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/86), [PR#95](https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/95)
- Add column sorting functionality [PR#84](https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/84)
- Add column visibility functionality [PR#87](https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/87)
- Design Landing Page for Cookies menu element in Privacy Sandbox Panel [PR#94](https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/94), [PR#96](https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/96), [PR#102](https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/102)
- Revamp popup to match with the new privacy sandbox panel design [PR#102](https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/102)
- Filter cookies across different dimensions [PR#103](https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/103)
- Add an Input field for cookies search and a header bar for displaying filter chips. [PR#103](https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/103)
- Add "Cookie Accepted" status attribute [PR#58](https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/58)
- Elevate Dark Mode Theme in UI with Seamless UX Enhancements [PR#104](https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/104)

**Refactoring**

- Update cookie store and related listeners to add `frameIDs` [PR#83](https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/83)
- Update the Webpack configuration to relocate the cookie DB during the copy process. [PR#64](https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/64)
- Refine CookiePanel UI and Modifies Data Processing Approach to Boost Efficiency [PR#101](https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/101)
- Increase test coverage [PR#97](https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/97)
- Refine CookiePanel UI and Modify Data Processing Approach to Boost Efficiency [PR#101](https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/101)

**Chore**

- Add command for test coverage report [PR#78](https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/78)

# v0.2.0

## Cookies

- Relocate info icon from matrix to cookie insights on landing page https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/121
- Feature: Add a settings page and control the number of tabs being processed https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/128
- Feature: Add option to process single or multiple tab for better performance https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/136

## CLI

- Feature: CLI tool to analyze websites and sitemap https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/123
- Debounce the toggling functionality of table sorting https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/125
- Fix: Missing platform and description https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/129
- Improvements in the CLI output https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/130
- Feature: Add optional flag to skip tech analysis https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/137

## Privacy Sandbox API
- Restructure menu items and add more info cards https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/131


# v0.3.0

## Cookies

* Feature: Add frame overlays https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/147
* Feature: List cookies set via `document.cookie` https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/146
* Update table UI in https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/167
* Add `isResizing` state inside table hook https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/176
* Focus on the first frame when navigating to a different page https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/161
* Frame Overlay: Display only privacy sandbox-related allowed features https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/178
* PS landing page improvements https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/179
* Enhance descriptions in Expanded View Cookie Matrix https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/143
* Replace 'not found' with 0 in the circle pie chart https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/152
* Fix: Responsive table on changing dock size. https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/163
* Fix `browseTopics` pre-rendering error https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/166
* Fix: Context invalidated message in https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/168
* Fix: Missing cookies with same names https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/140
* Fix: Flickering of iframe overlay on sites and some other fixes https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/177


## CLI
* Feature: Cookie report generation with CLI tool  https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/162
* Refactor: Set up a workspace named `common` for common utilities between CLI and the extension. https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/139
* Chore: Move presentational components to the design system package in https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/155


## Privacy Sandbox API
* Feature: Add RWS JSON generator form https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/142
* Feature: Add insights card to RWS panel https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/141
* Feature: Add data if frame belongs to RWS https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/170
* Feature: Cookie table settings should be made persistent https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/134
* Feature: Create landing pages https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/160
* Feature: Add new "Privacy Sandbox" menu item https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/150
* Update RWS panel interface https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/148
* Replace table library with custom hooks https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/154
* Replace `table` with `div` for better flexibility https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/157
* Add topic list https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/159
* Landing page enhancements and fixes https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/173
* Update RWS panel https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/174



# v0.3.1

## Cookies

* Update styling of table and landing page UI https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/188
* Fix: SameSite showing undefined in chips https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/198
* Refactor: `ContentScript` directory https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/186


## CLI
* Cli dashboard fixes and enhancements  https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/187
* Fix: Report downloader duplicate cookie entries in CSV https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/200
* Fix: CLI std output changes https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/197
* Update sidebar items padding and make Unknown Frame plural https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/213

## Privacy Sandbox API
* Fix: Update `Sidebar` navigation conditions and props https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/184
* Fix: Frame overlay issues https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/190
* Update landing page's UI/UX https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/195
* Fix: Frame overlay tooltip calculation issue https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/210
* Refactor: Update package name https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/191