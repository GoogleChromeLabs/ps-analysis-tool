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
          These are script tags embedded in the advertiser's webpage that enable
          communication with DSP servers. DSP tags help associate users with
          interest groups for retargeting and audience building in future ad
          campaigns.
        </p>
        <p className="mt-1">
          They collect user data, which is sent to DSP servers for processing
          (see the next DSPs box) and the received JSON response from DSP
          servers is passed as a parameter to the{' '}
          <code className="text-upsed-tomato">joinAdInterestGroup()</code>{' '}
          function to join interest groups.
        </p>
      </>
    ),
  },
  DSPS: {
    title: 'DSPs',
    info: (
      <>
        <p>
          DSP servers on the advertiser's side handle user tracking, data
          processing, and interest group management. They process user behavior
          and decide if the user should be added to specific interest groups.
          (called from the DSP Tag). DSPs are the owners of the interest groups
          that the user joins.
        </p>
        <p className="mt-1">
          It receives the user data from the DSP tags, processes it, and sends
          JSON responses to the DSP tags for joining interest groups (see DSP
          Tags box). These <strong>interest groups</strong> are added to the
          user's browser and are shown with small bubbles here. They store user
          profiles based on demographics, location, and behavior while ensuring
          compliance with privacy standards like the Protected Audience API.
        </p>
      </>
    ),
  },
};

export const SINGLE_SELLER_CONFIG = {
  SSP_TAG: {
    title: 'SSP Tag',
    info: (
      <>
        <p>
          <p>
            An SSP tag is a script placed on the publisher's page that enables
            the SSP to initiate ad requests and pass them to DSPs. It does the
            following:
          </p>
          <ul className="list-disc ml-3 mt-1">
            <li>Collects contextual data about the page and user.</li>
            <li>
              Sends ad requests to SSP server which then forwards those data to
              DSPs via RTB protocols.
            </li>
            <li>
              Returns the RTB responses from the SSP server to the SSP tag.
            </li>
          </ul>
        </p>
        <p className="mt-1">
          The SSP ad tag sends an ad request to the SSP server indicating that
          the browser supports Protected Audience API. It also returns
          contextual auction responses to the{' '}
          <code className="text-upsed-tomato">runAdAuction()</code> function.
        </p>
      </>
    ),
  },
  SSP: {
    title: 'SSP',
    info: (
      <>
        <p>
          An SSP is a platform that helps publishers manage, sell, and optimize
          their ad inventory programmatically. It connects publishers with
          multiple demand sources like DSPs, advertisers, and ad exchanges to
          facilitate real-time bidding (RTB) auctions.
        </p>
        <p>
          The SSP server sends ad requests received from the SSP Tag to the DSPs
          who bid on the ad space via RTB. It also returns the winning ad
          creative that is used while scoring the ad in{' '}
          <code className="text-upsed-tomato">scoreAd()</code>.
        </p>
        <p>Example: Google Ad Manager, Magnite.</p>
        <p className="mt-1">
          SSP server sends contextual OpenRTB bid requests to DSP indicating
          that the browser supports Protected Audience API. It also runs
          contextual auction and returns the winner along with auctions
          configuration to SSP tags.
        </p>
      </>
    ),
  },
  DSPS: {
    title: 'DSPs',
    info: (
      <>
        <p>
          On the publisher side, DSP servers process ad requests, evaluate bids,
          and serve ads based on campaign targeting and bidding strategies. They
          handle bid generation, ad selection, and reporting during ad auctions
          initiated by SSPs. The DSP server evaluates bid requests in real-time,
          using signals such as interest groups, contextual relevance, and
          advertiser budgets to decide whether to bid.
        </p>
        <p>
          When contacted by SSP during contextual auction they respond with bids
          based on the results calculated on the basis of ad requests received
          via SSP. The DSPs and the SSP communicate using RTB protocols.
        </p>
        <p className="mt-1">
          DSP responds with an OpenRTB bid response containing signals for the
          on-device auction.
        </p>
      </>
    ),
  },
  RUN_AD_AUCTION: {
    title: 'runAdAuction()',
    info: (
      <>
        <p>
          SSP ad tag initiates the on-device auction by calling{' '}
          <code className="text-upsed-tomato">runAdAuction()</code>, passing in
          signals and contextual ad winner from DSP's openRTB bid response which
          was sent by the SSP server.
        </p>
      </>
    ),
  },
  LOAD_INTEREST_GROUP: {
    title: 'Load Interest Group',
    info: (
      <>
        <p>
          A browser-based mechanism for retrieving user interest group data,
          stored using the{' '}
          <code className="text-upsed-tomato">joinAdInterestGroup()</code> API,
          for use in ad auctions. This ensures ads match user preferences while
          preserving privacy.
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
          A secure DSP-side server that handles bid generation using key/value
          pairs for interest group and contextual data. It ensures data
          processing aligns with privacy requirements, creating competitive bids
          based on predefined values.
        </p>
        <p className="mt-1">
          Chrome calls{' '}
          <a
            className="text-bright-navy-blue"
            href="https://github.com/WICG/turtledove/blob/main/FLEDGE.md#31-fetching-real-time-data-from-a-trusted-server"
            target="_blank"
            rel="noreferrer"
          >
            Key/Value trusted DSP bidding server
          </a>{' '}
          to fetch real-time bidding signals.
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
          Outputs include bid amount, ad creative, and metadata, ensuring
          relevance and competitiveness in the auction.
        </p>
        <p className="mt-1">
          Chrome calls{' '}
          <a
            className="text-bright-navy-blue"
            href="https://github.com/WICG/turtledove/blob/main/FLEDGE.md#32-on-device-bidding"
            target="_blank"
            rel="noreferrer"
          >
            <code className="text-upsed-tomato">generateBid()</code>
          </a>{' '}
          DSP JavaScript function for each participating interest group.
        </p>
      </>
    ),
  },
  DSP_X: {
    title: 'DSP 1',
    info: (
      <>
        <p>
          On the publisher side, DSP servers process ad requests, evaluate bids,
          and serve ads based on campaign targeting and bidding strategies. They
          handle bid generation, ad selection, and reporting during ad auctions
          initiated by SSPs. The DSP server evaluates bid requests in real-time,
          using signals such as interest groups, contextual relevance, and
          advertiser budgets to decide whether to bid.
        </p>
        <p>
          When contacted by SSP during contextual auction they respond with bids
          based on the results calculated on the basis of ad requests received
          via SSP. The DSPs and the SSP communicate using RTB protocols.
        </p>
        <p className="mt-1">
          DSP responds with a bid when{' '}
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
        <p className="mt-1">
          Chrome calls{' '}
          <a
            className="text-bright-navy-blue"
            href="https://github.com/WICG/turtledove/blob/main/FLEDGE.md#25-additional-trusted-signals-directfromsellersignals"
            target="_blank"
            rel="noreferrer"
          >
            Key/Value trusted SSP scoring server
          </a>{' '}
          to fetch real-time scoring signals.
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
          auction based on price, relevance, and publisher-defined criteria.
          Outputs a ranked list of bids, selecting the top bid as the winner for
          ad display. Any bid that is less than the contextual bid passed by the
          SSP tag while calling the runAdAuction is rejected.
        </p>
        <p className="mt-1">
          Chrome calls{' '}
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
          A function executed by the winning DSP to log auction details,
          including bid price and ad performance, for reporting and
          optimization. It ensures transparency for campaign performance and
          provides data for analytics and billing.
        </p>
        <p className="mt-1">
          Chrome calls{' '}
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
        <p className="mt-1">
          Chrome calls{' '}
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
          completed. In case where there is no winning bid or no interest group
          bids then the contextual ad which was sent in{' '}
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
    description: 'header-bidding lib',
    info: (
      <>
        <p>
          The header bidding tag loads on the browser and initiates the header
          bidding process using libraries like Pre-bid or Amazon TAM. This
          maximizes competition and potentially increases revenue.
        </p>
        <p className="mt-1">
          The SSP adapter sends ad requests to the SSP server indicating that
          the browser supports Protected Audience API.
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
          These are script tags embedded in the advertiser's webpage that enable
          communication with publisher ad tag webpage. When a user visits a
          webpage with an ad tag, the tag signals along with header bidding
          winner to the publisher's ad server that there's an opportunity to
          show an ad.
        </p>
        <p className="mt-1">
          The ad tag contains key information about the ad space, such as:
        </p>
        <ul className="list-disc ml-4 mt-1">
          <li>
            <strong>Ad unit ID:</strong> This identifies the specific ad slot on
            the page.
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
        <p className="mt-2">
          These tags are crucial for the ad delivery process, ensuring that the
          right ads are shown to the right users at the right time.
        </p>
        <p className="mt-1">
          The Publisher Ad Server tag sends an ad request to the Publisher Ad
          Server. It initiates on-device auction by calling{' '}
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
          the entire ad-serving process on a publisher's website or app. It also
          does a couple of other tasks like delivering and optimizing ads,
          tracking performance, and generating reports, and integrates with
          other ad tech platforms. It also does a couple of other tasks like
          delivering and optimizing ads, tracks performance and generating
          reports, and integrating with other ad tech platforms. The publisher
          ad server will also run a contextual auction with the data from header
          bidding as a comparison source.
        </p>
        <p>
          Any bid that is higher than the header bidding winner will be accepted
          for comparison other bids will be rejected. The winning bid is sent to
          the Publisher Ad Tag as the contextual ad winner which will be used in
          <code className="text-upsed-tomato">scoreAd()</code> function in
          Protected Audience API.
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
          a shared platform (e.g., an SSP or ad exchange), where all sellers'
          inventories are pooled for bidding.
        </p>
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
          An SSP is a platform that helps publishers manage, sell, and optimize
          their ad inventory programmatically. It connects publishers with
          multiple demand sources like DSPs, advertisers, and ad exchanges to
          facilitate real-time bidding (RTB) auctions.
        </p>
        <p>Example: Google Ad Manager, Magnite.</p>
        <p>In this case it conducts an sub auction</p>
        <p>
          The winner of the auction is selected and they are allowed to bid
          again on the top level auction. The winner of the top level auction
          gets to display ad.
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
          determines the final ad to be displayed. In unified flows, the
          top-level auction includes winners from both contextual and Protected
          Audience auctions. Each component auction adheres to the single-seller
          unified flow outlined in the{' '}
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
          relevance, and publisher-defined criteria. The function outputs a
          ranked list of bids, selecting the top bid as the winner for ad
          display.It is implemented by the SSP or publisher, and called by the
          SSPs to determine the winning bid. It ranks bids from the component
          auctions. It is implemented by the SSP or publisher, and called by the
          SSPs to determine the winning bid.
        </p>
        <p>
          The <code className="text-upsed-tomato">scoreAd()</code> function in
          multi-seller configuration ranks bids from the component auctions and
          compares with the contextual bid winner passed during the start of the
          runAdAunction. Any bid less than the contextual bid winner is rejected
          and bids higher than contextual bid winner are accepted for
          comparison.
        </p>
        <p className="mt-1">
          Chrome calls{' '}
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
          sends report to the winning DSP to log auction details. It implemented
          by the DSPs, and called by the SSPs or adServer to log the auction
          details.
        </p>
        <p className="mt-1">
          Chrome calls{' '}
          <a
            className="text-bright-navy-blue"
            href="https://github.com/WICG/turtledove/blob/main/FLEDGE.md#52-buyer-reporting-on-render-and-ad-events"
            target="_blank"
            rel="noreferrer"
          >
            <code className="text-upsed-tomato">reportWin()</code>
          </a>{' '}
          DSP JavaScript function to report winner to DSP.
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
          sends report to all the SSPs to log the winner and all the other
          details to log the auction details. It is implemented by the SSPs, and
          called by the adServer at the end of top-level auction.
        </p>
        <p className="mt-1">
          Chrome calls{' '}
          <a
            className="text-bright-navy-blue"
            href="https://github.com/WICG/turtledove/blob/main/FLEDGE.md#51-seller-reporting-on-render"
            target="_blank"
            rel="noreferrer"
          >
            <code className="text-upsed-tomato">reportResult()</code>
          </a>{' '}
          SSP JavaScript function to report winner to SSP.
        </p>
      </>
    ),
  },
};
