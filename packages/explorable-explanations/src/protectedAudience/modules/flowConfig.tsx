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
/**
 * External dependencies.
 */
import React from 'react';

export const ADVERTIZER_CONFIG = {
  DSP_TAGS: {
    title: 'DSP Tags',
    info: (
      <>
        <p>
          DSP tags are small script tags embedded in the advertiser&apos;s
          webpage. They enable communication between the webpage and DSP
          (Demand-Side Platform) servers. These tags are used to associate users
          with interest groups, which are later utilized for retargeting and
          building audiences for future ad campaigns.
        </p>

        <h4 className="font-bold mt-2">Role in the Current Flow</h4>
        <p className="mt-1">
          In the current flow, DSP tags collect user data from the webpage and
          send it to DSP servers for processing. The DSP servers analyze this
          data and return a JSON response. This response is then passed as a
          parameter to the{' '}
          <code className="text-upsed-tomato">joinAdInterestGroup()</code>{' '}
          function, which adds the user to specific interest groups. These
          interest groups are crucial for targeting users with relevant ads in
          future auctions.
        </p>
      </>
    ),
  },
  DSPS: {
    title: 'DSPs',
    info: (
      <>
        <p>
          DSP servers on the advertiser&apos;s side are responsible for user
          tracking, data processing, and managing interest groups. They analyze
          user behavior and determine whether a user should be added to specific
          interest groups. These decisions are triggered by data collected from
          DSP tags. DSPs also own the interest groups that users join.
        </p>

        <h4 className="font-bold mt-2">Role in the Current Flow</h4>
        <p className="mt-1">
          In the current flow, DSP servers receive user data from DSP tags,
          process it, and send JSON responses back to the DSP tags. These
          responses are used to add users to specific interest groups. The
          interest groups are stored in the user&apos;s browser and are visually
          represented as small bubbles in the diagram. They store user profiles
          based on demographics, location, and behavior while adhering to
          privacy standards like the Protected Audience API.
        </p>
      </>
    ),
  },
};

export const SINGLE_SELLER_CONFIG = {
  SSP_TAG: {
    title: 'SSP Ad Tag',
    info: (
      <>
        <p>
          An SSP tag is a script placed on the publisher&apos;s webpage that
          allows the SSP (Supply-Side Platform) to initiate ad requests and
          communicate with DSPs (Demand-Side Platforms). It performs the
          following tasks:
        </p>
        <ul className="list-disc ml-3 mt-1">
          <li>Collects contextual data about the page and the user.</li>
          <li>
            Sends ad requests to the SSP server, which forwards the data to DSPs
            using RTB (Real-Time Bidding) protocols.
          </li>
          <li>
            Receives RTB responses from the SSP server and passes them back to
            the SSP tag.
          </li>
        </ul>

        <h4 className="font-bold mt-2">Role in the Current Flow</h4>
        <p className="mt-1">
          In the current flow, the SSP ad tag sends an ad request to the SSP
          server, indicating that the browser supports the Protected Audience
          API. It also returns contextual auction responses to the{' '}
          <code className="text-upsed-tomato">runAdAuction()</code> function,
          which is responsible for initiating the on-device auction.
        </p>
      </>
    ),
  },
  SSP: {
    title: 'SSP',
    info: (
      <>
        <p>
          An SSP (Supply-Side Platform) is a platform that helps publishers
          manage, sell, and optimize their ad inventory programmatically. It
          connects publishers with multiple demand sources like DSPs,
          advertisers, and ad exchanges to facilitate real-time bidding (RTB)
          auctions.
        </p>

        <h4 className="font-bold mt-2">Role in the Current Flow</h4>
        <p>
          The SSP server receives ad requests from the SSP tag and forwards them
          to DSPs, who bid on the ad space via RTB. It also returns the winning
          ad creative, which is used during the ad scoring process in the{' '}
          <code className="text-upsed-tomato">scoreAd()</code> function.
        </p>
        <p>
          Additionally, the SSP server sends contextual OpenRTB bid requests to
          DSPs, indicating that the browser supports the Protected Audience API.
          It runs a contextual auction and returns the winner along with the
          auction configuration to the SSP tags.
        </p>

        <h4 className="font-bold mt-2">Examples</h4>
        <p>Common examples of SSPs include Google Ad Manager and Magnite.</p>
      </>
    ),
  },
  DSPS: {
    title: 'DSPs',
    info: (
      <>
        <p>
          On the publisher&apos;s side, DSP servers are responsible for
          processing ad requests, evaluating bids, and serving ads based on
          campaign targeting and bidding strategies. They handle tasks such as
          bid generation, ad selection, and reporting during ad auctions
          initiated by SSPs. The DSP server evaluates bid requests in real-time
          using signals like interest groups, contextual relevance, and
          advertiser budgets to decide whether to bid.
        </p>

        <h4 className="font-bold mt-2">Role in the Current Flow</h4>
        <p>
          In the current flow, when contacted by the SSP during a contextual
          auction, DSP servers respond with bids based on the results calculated
          from ad requests received via the SSP. The DSPs and SSP communicate
          using RTB (Real-Time Bidding) protocols.
        </p>
        <p className="mt-1">
          DSP servers send an OpenRTB bid response containing signals for the
          on-device auction, which is used to determine the winning ad.
        </p>
      </>
    ),
  },
  RUN_AD_AUCTION: {
    title: 'runAdAuction()',
    info: (
      <>
        <p>
          The SSP ad tag is responsible for initiating the on-device auction. It
          does this by calling the{' '}
          <code className="text-upsed-tomato">runAdAuction()</code> function.
        </p>

        <h4 className="font-bold mt-2">Role in the Current Flow</h4>
        <p>
          In the current flow, the SSP ad tag passes signals and the contextual
          ad winner, derived from the DSP&apos;s OpenRTB bid response, to the{' '}
          <code className="text-upsed-tomato">runAdAuction()</code> function.
          This bid response is sent by the SSP server and is used to initiate
          the auction process.
        </p>
      </>
    ),
  },
  LOAD_INTEREST_GROUP: {
    title: 'Load Interest Group',
    info: (
      <>
        <p>
          This is a browser-based mechanism for retrieving user interest group
          data that has been stored using the{' '}
          <code className="text-upsed-tomato">joinAdInterestGroup()</code> API.
          It allows the use of this data in ad auctions to ensure that ads are
          relevant to user preferences while maintaining privacy.
        </p>
      </>
    ),
  },
  KEY_VALUE_DSP_SERVER: {
    title: 'Key/Value',
    description: 'Trusted DSP Server',
    info: (
      <>
        <p>
          A secure DSP-side server that generates bids using key/value pairs for
          interest group and contextual data. It ensures that data processing
          complies with privacy requirements while creating competitive bids
          based on predefined values.
        </p>

        <h4 className="font-bold mt-2">Role in the Current Flow</h4>
        <p className="mt-1">
          Chrome interacts with the{' '}
          <a
            className="text-bright-navy-blue"
            href="https://github.com/WICG/turtledove/blob/main/FLEDGE.md#31-fetching-real-time-data-from-a-trusted-server"
            target="_blank"
            rel="noreferrer"
          >
            Key/Value trusted DSP bidding server
          </a>{' '}
          to fetch real-time bidding signals, which are used to generate bids
          during ad auctions.
        </p>
      </>
    ),
  },
  GENERATE_BID: {
    title: 'generateBid()',
    description: '(from DSPs on dsp.js)',
    info: (
      <>
        <p>
          A DSP-side function that generates a bid for an auction based on
          interest group data, contextual signals, and advertiser preferences.
          The outputs include the bid amount, ad creative, and metadata,
          ensuring relevance and competitiveness in the auction.
        </p>

        <h4 className="font-bold mt-2">Role in the Current Flow</h4>
        <p className="mt-1">
          Chrome calls the{' '}
          <a
            className="text-bright-navy-blue"
            href="https://github.com/WICG/turtledove/blob/main/FLEDGE.md#32-on-device-bidding"
            target="_blank"
            rel="noreferrer"
          >
            <code className="text-upsed-tomato">generateBid()</code>
          </a>{' '}
          DSP JavaScript function for each participating interest group. This
          function is crucial for determining bids during the on-device auction
          process.
        </p>
      </>
    ),
  },
  DSP_X: {
    title: 'DSP 1',
    info: (
      <>
        <h4 className="font-bold mt-2">Overview</h4>
        <p>
          On the publisher&apos;s side, DSP servers are responsible for
          processing ad requests, evaluating bids, and serving ads based on
          campaign targeting and bidding strategies. They handle tasks such as
          bid generation, ad selection, and reporting during ad auctions
          initiated by SSPs. The DSP server evaluates bid requests in real-time
          using signals like interest groups, contextual relevance, and
          advertiser budgets to decide whether to bid.
        </p>

        <h4 className="font-bold mt-2">Role in the Current Flow</h4>
        <p>
          When contacted by the SSP during a contextual auction, DSP servers
          respond with bids based on the results calculated from ad requests
          received via the SSP. The DSPs and SSP communicate using RTB
          (Real-Time Bidding) protocols.
        </p>
        <p className="mt-1">
          DSP servers generate a bid when the{' '}
          <code className="text-upsed-tomato">generateBid()</code> function is
          called from their respective DSP tags.
        </p>
      </>
    ),
  },
  KEY_VALUE_SSP_SERVER: {
    title: 'Key/Value',
    description: 'Trusted SSP Server',
    info: (
      <>
        <p>
          A secure SSP-side server responsible for ad scoring and auction
          facilitation. It uses key/value pairs to evaluate bids and ensures
          data privacy and compliance during ad auctions.
        </p>

        <h4 className="font-bold mt-2">Role in the Current Flow</h4>
        <p className="mt-1">
          Chrome interacts with the{' '}
          <a
            className="text-bright-navy-blue"
            href="https://github.com/WICG/turtledove/blob/main/FLEDGE.md#25-additional-trusted-signals-directfromsellersignals"
            target="_blank"
            rel="noreferrer"
          >
            Key/Value trusted SSP scoring server
          </a>{' '}
          to fetch real-time scoring signals, which are used to evaluate bids
          during ad auctions.
        </p>
      </>
    ),
  },
  SCORE_AD: {
    title: 'scoreAd()',
    description: '(from SSPs on ssp.js)',
    info: (
      <>
        <p>
          An SSP-side function that evaluates and ranks bids during an ad
          auction based on price, relevance, and publisher-defined criteria. It
          outputs a ranked list of bids, selecting the top bid as the winner for
          ad display. Any bid that is less than the contextual bid passed by the
          SSP tag while calling the{' '}
          <code className="text-upsed-tomato">runAdAuction()</code> function is
          rejected.
        </p>

        <h4 className="font-bold mt-2">Role in the Current Flow</h4>
        <p className="mt-1">
          Chrome calls the{' '}
          <a
            className="text-bright-navy-blue"
            href="https://github.com/WICG/turtledove/blob/main/FLEDGE.md#23-scoring-bids"
            target="_blank"
            rel="noreferrer"
          >
            <code className="text-upsed-tomato">scoreAd()</code>
          </a>{' '}
          SSP JavaScript function for each participating interest group. This
          function is crucial for determining the winning bid during the auction
          process.
        </p>
      </>
    ),
  },
  REPORT_WIN: {
    title: 'reportWin()',
    description: '(on dsp.js)',
    info: (
      <>
        <p>
          A function executed by the winning DSP to log auction details,
          including bid price and ad performance, for reporting and
          optimization. It ensures transparency for campaign performance and
          provides data for analytics and billing.
        </p>

        <h4 className="font-bold mt-2">Role in the Current Flow</h4>
        <p className="mt-1">
          Chrome calls the{' '}
          <a
            className="text-bright-navy-blue"
            href="https://github.com/WICG/turtledove/blob/main/FLEDGE.md#52-buyer-reporting-on-render-and-ad-events"
            target="_blank"
            rel="noreferrer"
          >
            <code className="text-upsed-tomato">reportWin()</code>
          </a>{' '}
          DSP JavaScript function to report the winner to DSP.
        </p>
      </>
    ),
  },
  REPORT_RESULT: {
    title: 'reportResult()',
    description: '(on ssp.js)',
    info: (
      <>
        <p>
          A function executed by the SSP or publisher to log auction results,
          providing transparency and analytics to all parties. It tracks metrics
          such as winning bids, auction details, and ad performance.
        </p>

        <h4 className="font-bold mt-2">Role in the Current Flow</h4>
        <p className="mt-1">
          Chrome calls the{' '}
          <a
            className="text-bright-navy-blue"
            href="https://github.com/WICG/turtledove/blob/main/FLEDGE.md#51-seller-reporting-on-render"
            target="_blank"
            rel="noreferrer"
          >
            <code className="text-upsed-tomato">reportResult()</code>
          </a>{' '}
          SSP JavaScript function to report the winner to SSP.
        </p>
      </>
    ),
  },
  SHOW_WINNING_AD: {
    title: 'Show Winning Ad',
    info: (
      <>
        <p>
          The winning ad is displayed after the protected audience auction is
          completed. If there is no winning bid or no interest group bids, the
          contextual ad sent in the{' '}
          <code className="text-upsed-tomato">runAdAuction()</code> function
          will be shown to the user.
        </p>
      </>
    ),
  },
};

export const MULTI_SELLER_CONFIG = {
  SSP_ADAPTER_HEADER_BIDDING: {
    title: 'SSP Adapter',
    description: '(header-bidding lib)',
    info: (
      <>
        <p>
          The header bidding tag loads on the browser and initiates the header
          bidding process using libraries like Pre-bid or Amazon TAM. This
          approach maximizes competition and has the potential to increase
          revenue.
        </p>

        <h4 className="font-bold mt-2">Role in the Current Flow</h4>
        <p className="mt-1">
          The SSP adapter sends ad requests to the SSP server, indicating that
          the browser supports the Protected Audience API.
        </p>
      </>
    ),
  },
  SSPs: SINGLE_SELLER_CONFIG.SSP,
  DSPs: SINGLE_SELLER_CONFIG.DSPS,
  PUBLISHER_ADSERVER_TAG: {
    title: 'Publisher',
    description: 'Ad Server Tag',
    info: (
      <>
        <p>
          These are script tags embedded in the advertiser&apos;s webpage that
          enable communication with the publisher&apos;s ad tag webpage. When a
          user visits a webpage with an ad tag, the tag signals, along with the
          header bidding winner, to the publisher&apos;s ad server that
          there&apos;s an opportunity to show an ad.
        </p>

        <h4 className="font-bold mt-2">Key Information in Ad Tags</h4>
        <ul className="list-disc ml-4 mt-1">
          <li>
            <strong>Ad unit ID:</strong> Identifies the specific ad slot on the
            page.
          </li>
          <li>
            <strong>Ad size:</strong> Specifies the dimensions of the ad slot
            (e.g., 300x250 pixels).
          </li>
          <li>
            <strong>Page context:</strong> May include information about the
            webpage content, user demographics, or other targeting parameters.
          </li>
        </ul>

        <h4 className="font-bold mt-2">Importance in Ad Delivery</h4>
        <p className="mt-2">
          These tags are crucial for the ad delivery process, ensuring that the
          right ads are shown to the right users at the right time.
        </p>

        <h4 className="font-bold mt-2">Role in the Current Flow</h4>
        <p className="mt-1">
          The Publisher Ad Server tag sends an ad request to the Publisher Ad
          Server. It initiates an on-device auction by calling the{' '}
          <a href="https://github.com/WICG/turtledove/blob/main/FLEDGE.md#21-initiating-an-on-device-auction">
            <code className="text-upsed-tomato">runAdAuction()</code>
          </a>{' '}
          function.
        </p>
      </>
    ),
  },
  PUBLISHER_ADSERVER: {
    title: 'Publisher',
    description: 'Ad Server',
    info: (
      <>
        <p>
          The publisher ad server is the central hub that controls and manages
          the entire ad-serving process on a publisher&apos;s website or app. It
          handles tasks such as delivering and optimizing ads, tracking
          performance, generating reports, and integrating with other ad tech
          platforms. Additionally, it runs a contextual auction using data from
          header bidding as a comparison source.
        </p>

        <h4 className="font-bold mt-2">Role in the Current Flow</h4>
        <p>
          In the current flow, any bid higher than the header bidding winner is
          accepted for comparison, while other bids are rejected. The winning
          bid is sent to the Publisher Ad Tag as the contextual ad winner, which
          is then used in the{' '}
          <code className="text-upsed-tomato">scoreAd()</code> function within
          the Protected Audience API.
        </p>
      </>
    ),
  },
  RUN_AD_AUCTION: {
    title: 'runAdAuction()',
    info: (
      <>
        <p>
          A multi-seller auction involves multiple sellers offering their
          inventory simultaneously, enabling multiple buyers (advertisers or
          DSPs) to bid on available items. The auction typically takes place on
          a shared platform (e.g., an SSP or ad exchange), where all
          sellers&apos; inventories are pooled for bidding.
        </p>

        <h4 className="font-bold mt-2">How It Works</h4>
        <p>
          Each seller conducts a component auction, selecting a winner to
          represent them in the top-level auction. The top-level auction
          determines the overall winner, whose ad gets displayed. This structure
          optimizes revenue for sellers while ensuring fair competition among
          buyers.
        </p>
      </>
    ),
  },
  SSP_X: {
    title: 'SSP A',
    info: (
      <>
        <p>
          An SSP (Supply-Side Platform) is a platform that helps publishers
          manage, sell, and optimize their ad inventory programmatically. It
          connects publishers with multiple demand sources like DSPs,
          advertisers, and ad exchanges to facilitate real-time bidding (RTB)
          auctions.
        </p>
        <p>
          <strong>Examples:</strong> Google Ad Manager, Magnite.
        </p>

        <h4 className="font-bold mt-2">Role in the Current Flow</h4>
        <p>
          In this case, the SSP conducts a sub-auction to select a winner. The
          winner of the sub-auction is then allowed to bid again in the
          top-level auction. The winner of the top-level auction gets to display
          the ad.
        </p>
      </>
    ),
  },
  COMPONENT_AUCTION: {
    title: '',
    info: (
      <>
        <p>
          A component auction is conducted by a single seller among a collection
          of buyers as part of a multi-seller auction process. The winner of
          each component auction advances to the top-level auction, which
          determines the final ad to be displayed.
        </p>

        <h4 className="font-bold mt-2">Unified Flows</h4>
        <p>
          In unified flows, the top-level auction includes winners from both
          contextual and Protected Audience auctions. Each component auction
          adheres to the single-seller unified flow outlined in the{' '}
          <em>Bidding and Auction Services Design</em>.
        </p>

        <a
          className="text-bright-navy-blue"
          href="https://github.com/privacysandbox/protected-auction-services-docs/blob/main/bidding_auction_services_multi_seller_auctions.md#component-auction"
          target="_blank"
          rel="noreferrer"
        >
          Read more
        </a>
      </>
    ),
  },
  SCORE_AD: {
    title: 'Score Ad',
    info: (
      <>
        <p>
          The <code className="text-upsed-tomato">scoreAd()</code> function
          evaluates and ranks bids during an ad auction based on price,
          relevance, and publisher-defined criteria. It outputs a ranked list of
          bids, selecting the top bid as the winner for ad display. This
          function is implemented by the SSP or publisher and is called by the
          SSPs to determine the winning bid.
        </p>

        <h4 className="font-bold mt-2">Role in Multi-Seller Configuration</h4>
        <p>
          In a multi-seller configuration, the{' '}
          <code className="text-upsed-tomato">scoreAd()</code> function ranks
          bids from the component auctions and compares them with the contextual
          bid winner passed during the start of the{' '}
          <code className="text-upsed-tomato">runAdAuction()</code>. Any bid
          lower than the contextual bid winner is rejected, while bids higher
          than the contextual bid winner are accepted for comparison.
        </p>

        <h4 className="font-bold mt-2">Role in the Current Flow</h4>
        <p className="mt-1">
          Chrome calls the{' '}
          <a
            className="text-bright-navy-blue"
            href="https://github.com/WICG/turtledove/blob/main/FLEDGE.md#23-scoring-bids"
            target="_blank"
            rel="noreferrer"
          >
            <code className="text-upsed-tomato">scoreAd()</code>
          </a>{' '}
          SSP JavaScript function for each participating interest group.
        </p>
      </>
    ),
  },
  REPORT_WIN: {
    title: 'reportWin()',
    description: '(on dsp.js)',
    info: (
      <>
        <p>
          The <code className="text-upsed-tomato">reportWin()</code> function
          sends a report to the winning DSP to log auction details. It is
          implemented by the DSPs and called by the SSPs or ad server to log the
          auction details.
        </p>

        <h4 className="font-bold mt-2">Role in the Current Flow</h4>
        <p className="mt-1">
          Chrome calls the{' '}
          <a
            className="text-bright-navy-blue"
            href="https://github.com/WICG/turtledove/blob/main/FLEDGE.md#52-buyer-reporting-on-render-and-ad-events"
            target="_blank"
            rel="noreferrer"
          >
            <code className="text-upsed-tomato">reportWin()</code>
          </a>{' '}
          DSP JavaScript function to report the winner to the DSP.
        </p>
      </>
    ),
  },
  REPORT_RESULT: {
    title: 'reportResult()',
    description: '(on ssp.js)',
    info: (
      <>
        <p>
          The <code className="text-upsed-tomato">reportResult()</code> function
          sends a report to all the SSPs to log the winner and other auction
          details. It is implemented by the SSPs and called by the ad server at
          the end of the top-level auction.
        </p>

        <h4 className="font-bold mt-2">Role in the Current Flow</h4>
        <p className="mt-1">
          Chrome calls the{' '}
          <a
            className="text-bright-navy-blue"
            href="https://github.com/WICG/turtledove/blob/main/FLEDGE.md#51-seller-reporting-on-render"
            target="_blank"
            rel="noreferrer"
          >
            <code className="text-upsed-tomato">reportResult()</code>
          </a>{' '}
          SSP JavaScript function to report the winner to the SSP.
        </p>
      </>
    ),
  },
};
