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
          parameter to the
          <code className="text-upsed-tomato">joinAdInterestGroup()</code>
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
          DSP servers on the advertiser&apos;s side are responsible for
          analyzing anonymous interactions, processing information, and managing
          interest categories. They evaluate website interactions and determine
          if a visitor meets criteria for specific interest categories. These
          determinations are based on information collected through the DSP
          tags. DSPs are also the owners of these interest categories that
          website visitors can become part of.
        </p>
        <h4 className="font-bold mt-2">Role in the Current Flow</h4>
        <p className="mt-1">
          In the current flow, DSP servers receive anonymized data from DSP
          tags, process it, and send organized data back to the DSP tags. This
          data is used to associate browsers with relevant interest categories.
          These categories are stored in the visitor&apos;s browser and appear
          as small bubbles in the diagram. They contain generalized information
          about browser activity based on broad characteristics, location zones,
          and browsing patterns while adhering to privacy guidelines like those
          in the Protected Audience API.
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
          <li>Gathers contextual information about the page environment.</li>
          <li>
            Sends ad requests to the SSP server, which forwards the information
            to DSPs using RTB (Real-Time Bidding) protocols.
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
          API. It also returns contextual auction responses to the
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
          ad creative, which is used during the ad scoring process in the
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
          does this by calling the
          <code className="text-upsed-tomato">runAdAuction()</code> function.
        </p>

        <h4 className="font-bold mt-2">Role in the Current Flow</h4>
        <p>
          In the current flow, the SSP ad tag passes signals and the contextual
          ad winner, derived from the DSP&apos;s OpenRTB bid response, to the
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
          This is a browser-based mechanism for accessing interest group
          information that has been stored using the
          <code className="text-upsed-tomato">joinAdInterestGroup()</code> API.
          It enables this information to be used in ad auctions to help display
          more relevant ad content while maintaining privacy standards.
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
          Chrome interacts with the
          <a
            className="text-bright-navy-blue"
            href="https://github.com/WICG/turtledove/blob/main/FLEDGE.md#31-fetching-real-time-data-from-a-trusted-server"
            target="_blank"
            rel="noreferrer"
          >
            Key/Value trusted DSP bidding server
          </a>
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
          Chrome calls the
          <a
            className="text-bright-navy-blue"
            href="https://github.com/WICG/turtledove/blob/main/FLEDGE.md#32-on-device-bidding"
            target="_blank"
            rel="noreferrer"
          >
            <code className="text-upsed-tomato">generateBid()</code>
          </a>
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
          DSP servers generate a bid when the
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
          Chrome interacts with the
          <a
            className="text-bright-navy-blue"
            href="https://github.com/WICG/turtledove/blob/main/FLEDGE.md#25-additional-trusted-signals-directfromsellersignals"
            target="_blank"
            rel="noreferrer"
          >
            Key/Value trusted SSP scoring server
          </a>
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
          SSP tag while calling the
          <code className="text-upsed-tomato">runAdAuction()</code> function is
          rejected.
        </p>

        <h4 className="font-bold mt-2">Role in the Current Flow</h4>
        <p className="mt-1">
          Chrome calls the
          <a
            className="text-bright-navy-blue"
            href="https://github.com/WICG/turtledove/blob/main/FLEDGE.md#23-scoring-bids"
            target="_blank"
            rel="noreferrer"
          >
            <code className="text-upsed-tomato">scoreAd()</code>
          </a>
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
          A function executed by the winning DSP to record auction results,
          including bid price and ad performance metrics, for reporting and
          campaign optimization purposes. It ensures transparency in campaign
          performance tracking and provides essential data for analytics and
          billing processes.
        </p>

        <h4 className="font-bold mt-2">Role in the Current Flow</h4>
        <p className="mt-1">
          Chrome calls the
          <a
            className="text-bright-navy-blue"
            href="https://github.com/WICG/turtledove/blob/main/FLEDGE.md#52-buyer-reporting-on-render-and-ad-events"
            target="_blank"
            rel="noreferrer"
          >
            <code className="text-upsed-tomato">reportWin()</code>
          </a>
          DSP JavaScript function to notify the DSP about their winning bid.
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
          A function executed by the SSP or publisher to record auction
          outcomes, providing transparency and detailed analytics to all
          participating parties. It captures key metrics including winning bid
          values, comprehensive auction details, and subsequent ad performance
          indicators.
        </p>

        <h4 className="font-bold mt-2">Role in the Current Flow</h4>
        <p className="mt-1">
          Chrome calls the
          <a
            className="text-bright-navy-blue"
            href="https://github.com/WICG/turtledove/blob/main/FLEDGE.md#51-seller-reporting-on-render"
            target="_blank"
            rel="noreferrer"
          >
            <code className="text-upsed-tomato">reportResult()</code>
          </a>
          SSP JavaScript function to communicate the auction results to the SSP.
        </p>
      </>
    ),
  },
  SHOW_WINNING_AD: {
    title: 'Show Winning Ad',
    info: (
      <>
        <p>
          The winning advertisement is presented once the protected audience
          auction process concludes. In cases where there are no successful bids
          or no interest group participation, the system defaults to displaying
          the contextual advertisement that was originally provided in the
          <code className="text-upsed-tomato">runAdAuction()</code> function
          call to the user.
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
          The header bidding tag activates within the browser environment and
          launches the header bidding process by utilizing specialized libraries
          such as Pre-bid or Amazon TAM. This strategic approach enhances
          competitive bidding and offers significant potential for revenue
          improvement.
        </p>

        <h4 className="font-bold mt-2">Role in the Current Flow</h4>
        <p className="mt-1">
          The SSP adapter transmits ad requests to the SSP server, specifically
          indicating that the user&apos;s browser has compatibility with the
          Protected Audience API.
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
          facilitate communication with the publisher&apos;s ad tag webpage.
          When a user navigates to a webpage containing an ad tag, this tag
          signals to the publisher&apos;s ad server, along with the header
          bidding winner information, that there is an opportunity to display an
          advertisement.
        </p>

        <h4 className="font-bold mt-2">Key Information in Ad Tags</h4>
        <ul className="list-disc ml-4 mt-1">
          <li>
            <strong>Ad unit ID:</strong> Identifies the specific ad placement
            location on the webpage.
          </li>
          <li>
            <strong>Ad size:</strong> Defines the exact dimensions of the ad
            placement area (e.g., 300x250 pixels).
          </li>
          <li>
            <strong>Page context:</strong> May include detailed information
            about the webpage content, user demographic data, or various
            targeting parameters.
          </li>
        </ul>

        <h4 className="font-bold mt-2">Importance in Ad Delivery</h4>
        <p className="mt-2">
          These tags play a vital role in the ad delivery ecosystem, ensuring
          optimal matching between advertisements, target audiences, and
          appropriate timing.
        </p>

        <h4 className="font-bold mt-2">Role in the Current Flow</h4>
        <p className="mt-1">
          The Publisher Ad Server tag transmits an ad request to the Publisher
          Ad Server. It triggers an on-device auction by invoking the
          <a href="https://github.com/WICG/turtledove/blob/main/FLEDGE.md#21-initiating-an-on-device-auction">
            <code className="text-upsed-tomato">runAdAuction()</code>
          </a>
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
          The publisher ad server functions as the primary control center that
          orchestrates and supervises the complete ad-serving ecosystem across a
          publisher&apos;s digital properties. It executes essential operations
          including ad delivery optimization, performance monitoring, analytics
          reporting, and seamless integration with various ad technology
          platforms. Furthermore, it conducts contextual auctions utilizing data
          obtained from header bidding as a comparative benchmark.
        </p>

        <h4 className="font-bold mt-2">Role in the Current Flow</h4>
        <p>
          Within the current operational flow, any bid exceeding the header
          bidding winner&apos;s value is considered for comparison, while all
          lower bids are automatically disqualified. The successful bid is
          transmitted to the Publisher Ad Tag as the contextual auction winner,
          which subsequently serves as a reference point within the
          <code className="text-upsed-tomato">scoreAd()</code> function
          implemented in the Protected Audience API.
        </p>
      </>
    ),
  },
  RUN_AD_AUCTION: {
    title: 'runAdAuction()',
    info: (
      <>
        <p>
          A multi-seller auction framework enables numerous sellers to present
          their inventory concurrently, allowing multiple buyers (including
          advertisers and DSPs) to compete for available advertising
          opportunities. This auction model typically operates on a centralized
          platform (such as an SSP or ad exchange), where the inventories from
          all participating sellers are consolidated to facilitate efficient
          bidding.
        </p>

        <h4 className="font-bold mt-2">How It Works</h4>
        <p>
          Each participating seller manages their individual component auction,
          selecting a single winning bid to represent them in the overarching
          top-level auction. The top-level auction then evaluates all these
          representative bids to determine the ultimate winner, whose
          advertisement will be displayed. This hierarchical structure maximizes
          revenue potential for sellers while maintaining competitive fairness
          across the buyer ecosystem.
        </p>
      </>
    ),
  },
  SSP_X: {
    title: 'SSP A',
    info: (
      <>
        <p>
          An SSP (Supply-Side Platform) functions as a comprehensive technology
          solution that assists publishers in efficiently managing, monetizing,
          and optimizing their advertising inventory through programmatic
          methods. It creates valuable connections between publishers and
          various demand sources including DSPs, advertisers, and ad exchanges
          to enable sophisticated real-time bidding (RTB) auction processes.
        </p>
        <p>
          <strong>Examples:</strong> Google Ad Manager, Magnite.
        </p>

        <h4 className="font-bold mt-2">Role in the Current Flow</h4>
        <p>
          Within this specific implementation, the SSP orchestrates a
          preliminary sub-auction to identify a leading bid. The winner of this
          initial sub-auction earns the opportunity to participate in the
          subsequent top-level auction. Ultimately, the participant who secures
          victory in the top-level auction gains the privilege of displaying
          their advertisement to the user.
        </p>
      </>
    ),
  },
  COMPONENT_AUCTION: {
    title: '',
    info: (
      <>
        <p>
          A component auction represents a specialized auction process conducted
          by an individual seller among multiple participating buyers as an
          integral part of a broader multi-seller auction framework. The
          successful bidder from each component auction progresses to
          participate in the top-level auction, which ultimately determines
          which advertisement will be presented to the user.
        </p>

        <h4 className="font-bold mt-2">Unified Flows</h4>
        <p>
          Within unified flow implementations, the top-level auction
          incorporates winning bids from both traditional contextual auctions
          and the more privacy-focused Protected Audience auctions. Each
          individual component auction strictly follows the single-seller
          unified flow methodology as detailed in the
          <em>Bidding and Auction Services Design</em> documentation.
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
          performs comprehensive evaluation and prioritization of bids during
          advertising auctions by analyzing factors such as bid price, content
          relevance, and custom publisher-specified criteria. It generates an
          ordered list of bids and identifies the highest-ranked bid as the
          auction winner for advertisement display. This critical function is
          developed and maintained by the SSP or publisher and is invoked by
          SSPs to determine which bid ultimately succeeds.
        </p>

        <h4 className="font-bold mt-2">Role in Multi-Seller Configuration</h4>
        <p>
          Within multi-seller environments, the
          <code className="text-upsed-tomato">scoreAd()</code> function
          systematically ranks bids originating from various component auctions
          and evaluates them against the contextual bid winner that was provided
          at the initiation of the
          <code className="text-upsed-tomato">runAdAuction()</code> process. Any
          bid with a value below the contextual bid winner is automatically
          disqualified, while bids exceeding the contextual bid winner&apos;s
          value proceed to the comparative evaluation phase.
        </p>
        <h4 className="font-bold mt-2">Role in the Current Flow</h4>
        <p className="mt-1">
          Chrome executes the
          <a
            className="text-bright-navy-blue"
            href="https://github.com/WICG/turtledove/blob/main/FLEDGE.md#23-scoring-bids"
            target="_blank"
            rel="noreferrer"
          >
            <code className="text-upsed-tomato">scoreAd()</code>
          </a>
          SSP JavaScript function independently for each interest group that
          participates in the auction.
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
          transmits a comprehensive notification to the successful DSP
          containing detailed auction information. This specialized function is
          engineered by the DSPs themselves and is invoked by either SSPs or the
          ad server to create a permanent record of the auction parameters and
          outcomes.
        </p>

        <h4 className="font-bold mt-2">Role in the Current Flow</h4>
        <p className="mt-1">
          Chrome executes the
          <a
            className="text-bright-navy-blue"
            href="https://github.com/WICG/turtledove/blob/main/FLEDGE.md#52-buyer-reporting-on-render-and-ad-events"
            target="_blank"
            rel="noreferrer"
          >
            <code className="text-upsed-tomato">reportWin()</code>
          </a>
          DSP JavaScript function to communicate the auction results to the
          victorious DSP with relevant performance metrics.
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
          distributes comprehensive auction outcome notifications to all
          participating SSPs, documenting the winning bid and other critical
          auction metrics. This function is developed by the SSPs themselves and
          is triggered by the ad server once the top-level auction concludes.
        </p>

        <h4 className="font-bold mt-2">Role in the Current Flow</h4>
        <p className="mt-1">
          Chrome initiates the
          <a
            className="text-bright-navy-blue"
            href="https://github.com/WICG/turtledove/blob/main/FLEDGE.md#51-seller-reporting-on-render"
            target="_blank"
            rel="noreferrer"
          >
            <code className="text-upsed-tomato">reportResult()</code>
          </a>
          SSP JavaScript function to communicate the final auction results to
          the relevant SSP with detailed performance data.
        </p>
      </>
    ),
  },
};
