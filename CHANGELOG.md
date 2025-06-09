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

- Feature: Add frame overlays https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/147
- Feature: List cookies set via `document.cookie` https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/146
- Update table UI in https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/167
- Add `isResizing` state inside table hook https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/176
- Focus on the first frame when navigating to a different page https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/161
- Frame Overlay: Display only privacy sandbox-related allowed features https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/178
- PS landing page improvements https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/179
- Enhance descriptions in Expanded View Cookie Matrix https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/143
- Replace 'not found' with 0 in the circle pie chart https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/152
- Fix: Responsive table on changing dock size. https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/163
- Fix `browseTopics` pre-rendering error https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/166
- Fix: Context invalidated message in https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/168
- Fix: Missing cookies with same names https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/140
- Fix: Flickering of iframe overlay on sites and some other fixes https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/177

## CLI

- Feature: Cookie report generation with CLI tool https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/162
- Refactor: Set up a workspace named `common` for common utilities between CLI and the extension. https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/139
- Chore: Move presentational components to the design system package in https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/155

## Privacy Sandbox API

- Feature: Add RWS JSON generator form https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/142
- Feature: Add insights card to RWS panel https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/141
- Feature: Add data if frame belongs to RWS https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/170
- Feature: Cookie table settings should be made persistent https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/134
- Feature: Create landing pages https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/160
- Feature: Add new "Privacy Sandbox" menu item https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/150
- Update RWS panel interface https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/148
- Replace table library with custom hooks https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/154
- Replace `table` with `div` for better flexibility https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/157
- Add topic list https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/159
- Landing page enhancements and fixes https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/173
- Update RWS panel https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/174

# v0.3.1

## Cookies

- Update styling of table and landing page UI https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/188
- Fix: SameSite showing undefined in chips https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/198
- Refactor: `ContentScript` directory https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/186

## CLI

- Cli dashboard fixes and enhancements https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/187
- Fix: Report downloader duplicate cookie entries in CSV https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/200
- Fix: CLI std output changes https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/197
- Update sidebar items padding and make Unknown Frame plural https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/213

## Privacy Sandbox API

- Fix: Update `Sidebar` navigation conditions and props https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/184
- Fix: Frame overlay issues https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/190
- Update landing page's UI/UX https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/195
- Fix: Frame overlay tooltip calculation issue https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/210
- Refactor: Update package name https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/191

# v0.3.2

## Cookies

- Enhancement: Add cross icon to cookie accepted column https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/231
- Fix: Update checkbox dimensions and resize visibility https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/234
- Fix: Trim out whitespace from the cookie key. https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/237
- Enhancement : Add reactive refresh button in devtools header https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/236

## CLI

- Fix : Add missing description in analytics https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/230

## Privacy Sandbox API

- Update `RWS` submission steps text https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/229
- Fix: opaque origin error when using in https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/235
- Refactor: Make functional components in landing page non-collapsible https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/232

# v0.4.0

## CLI

- Fix: MaxListenerExceedWarning when analyzing sitemap https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/260
- Fix: Affected cookies csv output https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/308
- Fix: Report generation in cli-dashboard https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/318
- Enhancement: add interface use CSV file in CLI. https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/274
- Enhancement: CLI analyze sites with local sitemap https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/271
- Feature: Add custom sidebar hook and component https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/193
- Feature: Implement keyboard navigation inside sidebar https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/266
- Feature: Implement generic filtering and search capabilities https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/289
- Feature: Integrate filtering and searching capability to cli dashboard https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/290
- Feature: Implement persistent settings for table https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/291
- Feature: Implement generic sidebar for extension https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/306
- Feature: Implements generic filtering and searching capabilities inside the extension https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/323
- Refactor: Move dashboard's data processing to utils https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/192

## PSAT Extension

- Fixing hover input state in dark mode https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/295
- Feature: Use Floating UI for tooltip positioning https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/276
- Update tools input field inline to devtools's UI https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/243
- Feature: Use Chrome DevTools Protocol to extract extra information https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/270
- Feature: Extract information and show it on settings page for reporting bugs in the extension. https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/307
- Feature: Add context menu to copy network filter string to filter network requests https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/333
- Enhancement: Reorder column to get important data at https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/337
- Update quick links on landing pages https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/329

# v0.4.1

### Extension

- Enhancement: Allow blurring the sidebar items https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/384

# v0.4.2

### Extension

- Feature: Provide switch to turn PSAT's debugging capabilities on and off https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/429
- Chore: Update cookie database https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/430
- Chore: Update related website sets data https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/431

# v0.5.0

## Extension

- Feature: Uniform filtering developer experience across frames https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/414
- Feature: Add the capability of setting "allow list" content policy https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/376
- Feature: Detect use of Google Sign In (GSI) libraries https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/425
- Feature: Optimise cookie updating iterations to reduce the cookie loading time https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/436
- Feat: Export cookie table data from the extension https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/457
- Fix the method of fetching value for JS cookies https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/364
- Fix: Update minor UI elements https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/367
- Enhancement: Add 3PCD content to PS landing page https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/475
- Feature: Update report downloader function to download sitemap report https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/368
- Chore: Add missing docs and todos https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/413
- Feature: Copy paste using keyboard https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/365
- Enhancement: Add `Partition Key` filter to extension https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/442
- Enhancement: Make UI/UX changes to `Blocked Reasons` filter. https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/399
- Chore: Add unit test for findAnalyticsMatch https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/438
- Enhancement: Format columns width with `widthWeightagePercentage` https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/401
- Fix miscellaneous allow list QA issues https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/460
- Feature: Implement `All` filter value for `Blocked Reasons` filter https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/447
- Feature: Add `Expand/Collapse All` button inside filters sidebar https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/446
- Fix: Refresh page on context invalidate https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/465
- Remove topics list feature https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/463
- Feature: Make CLI dashboard filters dynamic https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/455
- Enhancement: Addition of `Quick Links` on landing pages https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/468
- Fix: Errors appearing on extension page https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/472
- HotFix: Persist data using global variable https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/476
- Fix: Library detection section occasional infinite loading https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/478
- Fix: Zero cookie issue when window is reopened https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/479
- Feature: Differentiate between cookies blocked in request or response https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/474
- Feature: Create "Facilitated Testing" landing page https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/480

## CLI

- Enhancement: CLI decoupling - Save analysis results in a directory https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/407
- Fix: CLI dashboard not showing data https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/445
- Feature: Add blocked reasons to CLI output data https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/435
- Fix: Column order in output CSV files https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/443
- Fix: Typos in CLI messages https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/449
- Update miscellaneous UI elements https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/466
- Style Fix: Rearrange and rename components in CLI dashboard https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/469

## Others

- Quickly Launch Different Chrome for Privacy Sandbox Demo https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/211
- Enhancement: Add additional documentation with Chrome launcher commands https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/416
- Correct the URL in the [[install.sh](http://install.sh/)](http://install.sh/) for the launcher script https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/470
- Update: Change cookie database URL https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/415
- Update d.c.c. links https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/417
- Merge `main` into `develop` https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/451
- Update flags and profile color in Chrome launcher https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/467

# v0.5.1

## Extension

- Restructure `Facilitated Testing` landing page UI https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/493
- Two-step process for toggling CDP state https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/494
- Enhancement: Update cookie's blocking status enum and UI https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/507
- Enhancement: Add UTM params to outgoing links https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/512
- Fix: UI and change messaging in toast message https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/511
- Fix: Library detection miscellaneous QA issues https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/495
- Fix: Keep service worker alive https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/513
- Fix: Slow loading cookies on page change https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/484
- Style-Fix: Scale up cookie prefix icon and update message text in cookie details. https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/514

## CLI

- Fix: Add mock UA string https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/487
- Fix: Add conditional rendering in technology details panel https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/499

## Others

- Disable auto opening of Chrome DevTools by default for all tabs https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/491

# v0.5.2

## Extension

- List unmapped and orphaned cookies https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/527
- Fix: Allow-listed rows to highlight after frame change https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/531
- Fix: Related website sets not recognizing ccTLDs as part of the group https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/523

## Others

- Rename `third_party` to `assets` https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/530

# v0.6.0

## Extension

- Enhancement: Library detection package to identify more libraries https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/555
- Miscellaneous settings page changes https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/544
- Maintain selected row’s background color in row selection https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/556
- Use `cookieStore` API to fetch JS cookies. https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/550
- Fix: Inconsistency of CDP switch state. https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/554
- Fix: Update filters comparator https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/549
- Fix: Add provider to allowed list https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/551
- Fix: Incorrect cookie scope classification https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/553
- Fix: Remove unmapped orphan cookies. https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/558
- Enable CDP and multi-tab using query parameters https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/559
- Fix: Highlighting logic for undetermined blocking status cookie and create a new column for it https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/557

## CLI

- Fix: CLI not quitting after generating output. https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/552

## Others

- Chrome-Launcher: Open all example.com URLs with CDP and multi-tab on. https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/560

#v0.7.0

## Extension

- Feature: Export report in an HTML file https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/545
- Feature: Show exempted cookies in extension https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/522
- Feature: Add i18n module https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/575
- Feature: Accept GDPR banner consent. https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/372
- Fix: Left over references and make some more space in the cookie table https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/584
- Fix: Clear cookie preview area https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/568
- Refactor: Update table storage and prefix icon type https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/546
- Refactor: Extension UI and Service Worker. https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/519
- Refactor: Rename column cookie affected column to issues https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/580
- Refactor: Add disabled state to the Button component https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/585
- Refactor: Increase test coverage for extension package https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/520
- Refactor: Restructure cookies landing page https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/528
- Enhancement: Add information on how to verify if a user is part of 1% experimental group https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/543
- Enhancement:Update extension icons https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/583
- Enhancement: Enlarge extension icon https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/598
- Enhancement : Add blocking status column in the CSV export from the table in extension https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/591
- Enhancement: Add context provider to sidebar https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/498
- Miscellaneous UI updates https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/599
- Enhancement: Navigate to `Settings` page from `Blocked Cookies` section https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/603
- Enhancement: Use the warning icon on the cookie issues panel https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/604
- Refactor: Update cookies section on the landing page https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/615
- Fix: Context invalidated for sites which do not send request after the site is loaded. https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/611

## CLI

- Feature: Add option to pass a port for development server https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/579
- Enhancement: Move download report button in cli-dashboard to the sticky menu bar https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/595
- Enhancement: CLI, replace "Cookies with issues" with "Cookie issues" in the sidebar. https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/596
- Enhancement: CLI updates https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/602
- Fix: CLI dashboard showing multiple cookie entries for same cookies https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/597
- Fix: CLI dashboard blocking reason. https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/618

## Others

- Add demo RWS for command line launcher https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/578

#v0.8.0

## Extension

- Improve “Known Breakages” component UI https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/643
- Update “Clear All” button render condition for filter chips https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/637
- Add readiness content under “Facilitated Testing” section https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/663
- Fix: Broken download button icon UI https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/636
- Fix: Known breakages section throwing error when a link is quickly opened and closed https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/654
- Update “Privacy Sandbox” timeline SVG https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/649
- Update landing pages UI https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/659
- Fix: Normalize blocking reason https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/658
- Fix: Revise method to keep service worker alive https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/655

## CLI

- Feature: Add HTML report generation to CLI dashboard and CLI https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/646
- Fix: Remove debug log statement https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/633
- Fix: Merge blocked reasons data in dashboard https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/650
- Enhancement: CLI output path relative to “out” directory. https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/638
- Miscellaneous CLI dashboard improvements https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/660

## Others

- Feature: Update babel-loader webpack config to have caching support for faster builds https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/452

#v0.9.0

## Extension

- Feature: Complete migration to CDP https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/539
- Feature: Add and implement i18n translation locales https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/713
- Feature: Navigate from PSAT to network panel https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/685
- Feature: Add “Protected Audience” landing page https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/714
- Feature: Add blocking direction icons in CLI https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/715
- Fix: Persist filters after web page reload https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/692
- Fix: Exemption section disappearing https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/691
- Fix: GSI messaging on correct urls. https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/684
- Fix: Inconsistent highlighting on livemint.com https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/683
- Fix: Update menu bar scrolling logic https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/699
- Add known breakages section in CLI https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/708
- Fix: v1.0 QA issues https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/717
- Fix: Conditionally use `I18n.getMessage` function inside `InfoCard` https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/720
- Fix: Update UI/UX of table components https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/679
- Fix: Update UX of design system components https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/693

## CLI

- Upgrade to the latest Puppeteer version and fix cookie mapping issues https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/704
- Update CLI messaging to be smaller and more concise https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/721
- CLI: Refactor CLI package into 2 different packages https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/687
- Feature: Publish packages on the NPM registry https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/698
- Make -u argument optional in CLI. https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/711
- Fix: Create separate CSV generation utils for CLI dashboard and extension https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/619
- Add website hostname as prefix to cookie table CSV https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/700
- Fix: Report throwing error when downloaded from CLI. https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/709
- CLI: Add ability to catch exempted cookies https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/712
- Fix: `Samesite` value in cookie table CSV https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/726
- CLI: Fix missing frame key in the page frames hash map https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/728
- Fix: Paths for CLI to work on global as well as local installation https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/727

## Others

- Add `chrome-pat` and `chrome-pat-ps` commands to test Private Advertising https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/706
- Close support issues using stale actions. https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/571
- Temporarily remove storybook package https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/702
- Refactor: Update package scope name to `@google-psat` https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/725

#v0.9.1

## Extension

Remove facilitated testing page Remove facilitated testing page https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/787

#v0.10.0

# Changelog

## Extension

- Feature: Add global filtering capabilities https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/735
- Feature: Generate complete report from extension. https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/749
- Feature: Add 0.9v i18n translations https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/791
- Feature: Add “Private Aggregation” panel https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/746
- Feature: Enable navigating from sitemap report insights page https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/736
- Fix: Use `onCommittedNavigation` listener instead of `onTabUpdated` https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/755
- Fix: Load settings when extension has been enabled https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/758
- Fix: Performance issues in chrome PSAT extension. https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/762
- Fix: Report generation https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/766
- Fix: QA issues on develop https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/779
- Fix: QA issues https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/789
- Refactor: Move dashboard from design-system to report. https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/772
- Chore: Remove blocking status and mapping columns from cookies table https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/748

## CLI

- Feature: Add report header https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/777
- Feature: Add section summarizing known breakages https://github.com/GoogleChromeLabs/ps-analysis-tool/issues/752
- Feature: Inline scripts and data for the CLI analysis report file https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/745
- Feature: Add known breakages section in aggregated report https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/754
- Feature: Redesign CLI console messages and user interactions. https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/734
- Feature: Add favicon to the downloadable report and CLI dashboard. https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/742
- Feature: Implement output folder naming conventions for saved reports https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/759
- Enhancement: Add filters in full report file https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/770
- Fix: Revert removal of use arguments and update CLI build commands https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/769
- Fix: Add custom sorting comparator for categories https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/771

## Others

- Code Quality: Add E2E tests for extension and CLI https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/773
- Chore: Make NPM commands used for development uniform. https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/775
- Bump “fast-xml-parser” from 4.4.0 to 4.4.1 https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/790
- Chore: Setup report package development configurations https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/756

#v0.10.1

# Changelog

## Extension

- Fix: Miscellaneous QA issues https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/795

#v0.11.0

# Changelog

## Extension

- Feature: Create PSAT landing page and dashboard https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/827
- Feature: Add Wiki section in the extension https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/816
- Feature: Add breadcrumbs to landing pages https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/832
- Feature: Add tabs navigation inside landing page https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/808
- Feature: Add collapsible sidebar https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/821
- Refactor: Update order of PAT Section components https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/831

## CLI

- Feature: High level aggregated CSV download for sitemaps https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/814
- Feature: Expand support for GDPR banner acceptance in CLI https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/823
- Feature: Check for latest version and show message in CLI https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/822
- Fix CLI output typo and improve text https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/806
- Add "ok" for gdpr consent button lookup https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/812
- Remove Wappalyzer used for technologies from CLI https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/833

## Others

- Resolve high and moderate vulnerabilities in package dependencies https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/836

#v0.12.0

# Changelog

## Extension

- https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/848

## CLI

- https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/830
- https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/849

#v0.13.0

# Changelog

## Extension

- Feature: Add "Learning" panel https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/956
- Feature: Add 'Learning' box in the dashboard feature list https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/976
- Feature: Add Legend tab https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/946
- Feature: Add double dropdown arrow in non interactive mode to show non animated flow. https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/906
- Feature: Add info tab to bottom table. https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/904
- Feature: Add multi-seller auction https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/910
- Feature: Add notification bubbles to ARA tabs https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/981
- Feature: Add real sites and icons to topics EE https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/947
- Feature: Add speed slider logic to the extension https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/901
- Feature: Add tab highlighting capabilities https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/941
- Feature: Add tables to PA EE https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/888
- Feature: Add topics classifier to the PSAT extension https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/955
- Feature: Add topics legend tab https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/958
- Feature: Add visited index and add dropdown icon to open non-animated flow. https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/887
- Feature: Auto scroll canvas for EE PA https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/920
- Feature: Dynamic date time in PA EE https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/953
- Feature: Dynamic web stories from backend https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/892
- Feature: Embed web stories on landing page cards https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/908
- Feature: Expand EE flow from AdUnitBox or DateTimeBranch https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/903
- Feature: Filter current site data https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/991
- Feature: Highlight IG table row from bubbles https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/915
- Feature: Highlight PA tabs https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/996
- Feature: Implement p5 workflow https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/902
- Feature: Introduce AdUnit and Bids tabs to explorable explanation in EE. https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/905
- Feature: Link landing page cards to related pages https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/975
- Feature: Populate attribution reporting data https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/972
- Feature: Preserve protected audience explorable explanation settings https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/938
- Feature: Refactor code, add colored boxes, information icons, and longer line animation duration https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/881
- Feature: Setup multi-seller auction table https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/917
- Feature: Shorten runAdAuction flow if there are no interest groups. https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/934
- Feature: Sync tab highlighting with data https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/943
- Feature: Synchnorise data population in table with respect to the EE PA https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/924
- Feature: Use real website names. https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/942
- Feature: Create a new 'Worklet Breakpoints' tab https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/935
- Fix: Add missing API pages https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/957
- Fix: Auction events randomly fail to appear in UI https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/952
- Fix: Bubble minify animation https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/961
- Fix: Clear ripple effect marking https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/928
- Fix: Develop QA issues https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/1003
- Fix: Develop QA issues https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/1005
- Fix: Develop QA issues https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/960
- Fix: Develop QA issues https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/986
- Fix: EE PA Bugs https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/916
- Fix: EE PA bugs https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/912
- Fix: EE PA bugs https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/913
- Fix: EE PA bugs https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/914
- Fix: EE box info icon https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/990
- Fix: EE bugs https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/944
- Fix: EE issues https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/936
- Fix: Explorable explanation bugs and minor issues https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/939
- Fix: Interactive mode switching https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/896
- Fix: Learning page responsive https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/1001
- Fix: Minor UI issues https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/1011
- Fix: Misc QA issues https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/954
- Fix: Move settings from bottom to the top in the sidebar https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/931
- Fix: QA bugs https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/1000
- Fix: QA develop issues https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/969
- Fix: QA develop https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/994
- Fix: Regression in develop branch https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/945
- Fix: Remove excessive gap between arrow head and line when speed is increased https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/949
- Fix: Topics EE changes https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/968
- Fix: UI fixes and improvements https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/987
- Fix: Update Interest group table to show only join and leave events https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/885
- Fix: Update progress line rendering logic https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/925
- Enhancement: Learning landing page content frame https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/999
- Enhancement: Add Evaluation Environment text to PA tabs https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/923
- Enhancement: Add description to learning pages https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/977
- Enhancement: Attribution Reporting filters https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/979
- Enhancement: Autoscroll table on row highlighting https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/919
- Enhancement: Improve EE auto scroll https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/983
- Enhancement: Improve component auction flow https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/926
- Enhancement: Improve topics classifier UI https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/978
- Enhancement: Open links in same tab https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/980
- Enhancement: Sidebar and landing page icons https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/985
- Enhancement: Topics EE changes https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/984
- Enhancement: Topics interactive mode https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/992
- Enhancement: Topics panel https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/973
- Enhancement: Update IG highlighting logic https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/933
- Enhancement: Update synthetic data for distinction https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/918
- Enhancements: Topic's panel changes https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/993
- Enhancements: Updates to topics EE https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/884
- Refactor: Move topics animation code to `explorable-explanation` package https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/971
- Explorable Explanation: Add legend content and remove 'General Use' from info tab https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/951
- Embed Web Stories in PSAT https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/869
- Improvement: Convert `explorable-explanations` package to typescript https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/940
- Add multi-seller auction info https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/921
- Bring back the story links for all cards in all sections https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/950
- Make UI changes to web stories landing page. https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/964
- Mapping categories under personalization and security to Functional https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/891
- Open "Learn More" button link in the same tab https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/963
- PA EE code refactoring and small fixes https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/893
- PA:EE: Add info icon to branches in publisher flow https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/970
- PSAT UI Improvements https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/1004
- Redesign cards and replace icons https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/1009
- Reorder menu items and misc UI changes https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/1008
- Replace Wiki with Github link and reorder menu https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/988
- Replace anchor tag with `Link` component in Landing page info cards https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/965
- Small UI Improvements. https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/967
- Update learning landing page icons and content https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/997

# v0.14.0

## Changelog

- Fix: CLI install script https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/1020
- Fix: Media Container Size showing undefined in the table. https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/1017
- Fix: Minor bugs in PSAT https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/1025
- Fix: Redirection to dashboard https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/1029
- Add search icon to info cards https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/1030
- Enhancement: Dynamic dark mode https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/1028
- Enhancement: Make JSON view collapsible https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/1007
- Move 'Wiki' after 'Demos' page under 'Learning' section https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/1019
- Refactor auction shaper https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/1032
- Refactor: Toast UI message https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/1035
- Remove multi-tab debugging option and show toast message https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/1031
- Rename "Media Type" column to "Ad Type" in bids table https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/1027
- Replace number and logo icons https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/1026

# v0.14.1

## Changelog

- Fix: Ad unit tab notification bubble disappearance https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/1039
- Fix: Auction removal timing https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/1044
- Fix: Auction tab data vanishing https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/1050
- Fix: Incorrect access count in topics EE https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/1038
- Fix: Multiple rows getting selected with the same event time https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/1041
- Fix: Prevent auto scrolling when animation is paused in EE https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/1048
- Fix: Settings container padding https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/1046
- Fix: Show CDP settings icon buttons only in smaller screens https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/1054
- Enhancement: Add textual description to PA EE arrows https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/1053
- Improvement: Initial theme mode https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/1040
- Improvement: Settings toast buttons https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/1047
- Misc QA Fixes https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/1043
- Misc QA fixes https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/1045
- Misc patch fixes https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/1052
- Miscellaneous updates and improvements https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/1049
- Update diagram boxes to yellow for SSPs with minimal integration changes https://github.com/GoogleChromeLabs/ps-analysis-tool/pull/1051
