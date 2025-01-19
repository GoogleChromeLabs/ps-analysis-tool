/*
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
export const INFORMATION_JSON = {
  DSP_TAGS: {
    title: 'DSP Tags',
    info: `
    <p>These are script tags embedded in the advertiser's webpage that enable communication with DSP servers.</p>
    <p>They collect user activity data, which is sent to DSP servers for processing.</p>
    <p>DSP tags help associate users with interest groups for retargeting and audience building in future ad campaigns.</p>
  `,
  },
  DSPs_ADV: {
    title: 'DSPs',
    info: `
    <p>DSP servers on the advertiser's side handle user tracking, data processing, and interest group management but do not serve ads directly.</p>
    <p>They process user behavior and decide if the user should be added to specific interest groups using the <code>joinAdInterestGroup()</code> API.</p>
    <p>They store user profiles based on demographics, location, and behavior while ensuring compliance with privacy standards like the Protected Audience API.</p>
  `,
  },
  DSPs_PUB: {
    title: '',
    info: `
    <p>On the publisher side, DSP servers process ad requests, evaluate bids, and serve ads based on campaign targeting and bidding strategies.</p>
    <p>They handle bid generation, ad selection, and reporting during ad auctions initiated by SSPs.</p>
    <p>The DSP server evaluates bid requests in real time, using signals such as interest groups, contextual relevance, and advertiser budgets to decide whether to bid.</p>
  `,
  },
  SSP: {
    title: '',
    info: `
    <p>An SSP is a platform that helps publishers manage, sell, and optimize their ad inventory programmatically.</p>
    <p>It connects publishers with multiple demand sources like DSPs, advertisers, and ad exchanges to facilitate real-time bidding (RTB) auctions.</p>
    <p>Example: Google Ad Manager, Magnite.</p>
  `,
  },
  SSP_TAG: {
    title: '',
    info: `
    <p>An SSP tag is a script placed on the publisher's page that enables the SSP to initiate ad requests and pass them to DSPs.</p>
    <ul>
      <li>Collects contextual data about the page and user.</li>
      <li>Sends ad requests to DSPs via RTB protocols.</li>
      <li>Returns the winning ad creative to be displayed on the page.</li>
    </ul>
  `,
  },
  LOAD_INTEREST_GROUP: {
    title: '',
    info: `
    <p>A browser-based mechanism for retrieving user interest group data, stored using the <code>joinAdInterestGroup()</code> API, for use in ad auctions.</p>
    <p>This ensures ads match user preferences while preserving privacy.</p>
  `,
  },
  KEY_VALUE_DSP_SERVER: {
    title: '',
    info: `
    <p>A secure DSP-side server that handles bid generation using key/value pairs for interest group and contextual data.</p>
    <p>It ensures data processing aligns with privacy requirements, creating competitive bids based on predefined values.</p>
  `,
  },
  KEY_VALUE_SSP_SERVER: {
    title: '',
    info: `
    <p>A secure SSP-side server responsible for ad scoring and auction facilitation.</p>
    <p>It uses key/value pairs to evaluate bids and ensures data privacy and compliance during ad auctions.</p>
  `,
  },
  GENERATE_BID: {
    title: '',
    info: `
    <p>A DSP-side function that generates a bid for an auction based on interest group data, contextual signals, and advertiser preferences.</p>
    <p>Outputs include bid amount, ad creative, and metadata, ensuring relevance and competitiveness in the auction.</p>
  `,
  },
  SCORE_AD: {
    title: '',
    info: `
    <p>An SSP-side function that evaluates and ranks bids during an ad auction based on price, relevance, and publisher-defined criteria.</p>
    <p>Outputs a ranked list of bids, selecting the top bid as the winner for ad display.</p>
  `,
  },
  REPORT_WIN: {
    title: '',
    info: `
    <p>A function executed by the winning DSP to log auction details, including bid price and ad performance, for reporting and optimization.</p>
    <p>It ensures transparency for campaign performance and provides data for analytics and billing.</p>
  `,
  },
  REPORT_RESULT: {
    title: '',
    info: `
    <p>A function executed by the SSP or publisher to log auction results, providing transparency and analytics to all parties.</p>
    <p>It tracks metrics such as winning bids, auction details, and ad performance.</p>
  `,
  },
  COMPONENT_AUCTION: {
    title: '',
    info: `
    <p>A component auction is conducted by a single seller among a collection of buyers as part of a multi-seller auction process.</p>
    <p>The winner of each component auction advances to the top-level auction, which determines the final ad to be displayed.</p>
    <p>In unified flows, the top-level auction includes winners from both contextual and Protected Audience auctions.</p>
    <p>Each component auction adheres to the single-seller unified flow outlined in the <em>Bidding and Auction Services Design</em>.</p>
    <a href='https://github.com/privacysandbox/protected-auction-services-docs/blob/main/bidding_auction_services_multi_seller_auctions.md#component-auction' target='_blank'>Read more</a>
  `,
  },
  MULTI_SELLER_AUCTION: {
    title: '',
    info: `
    <p>A multi-seller auction involves multiple sellers offering their inventory simultaneously, enabling multiple buyers (advertisers or DSPs) to bid on available items.</p>
    <p>The auction typically takes place on a shared platform (e.g., an SSP or ad exchange), where all sellers' inventories are pooled for bidding.</p>
    <p>Each seller conducts a component auction, selecting a winner to represent them in the top-level auction. The top-level auction determines the overall winner, whose ad gets displayed.</p>
    <p>This structure optimizes revenue for sellers while ensuring fair competition among buyers.</p>
  `,
  },
};
