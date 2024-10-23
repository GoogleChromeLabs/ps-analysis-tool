const app = {
  timeline: {
    isPaused: false,
    circlePositions: [],
    smallCirclePositions:[],
    circlePublisherIndices: [],
    currentIndex: 0,
  },
  auction: {
    auctions: [],
  },
  joinInterestGroup: {
    joinings: [],
  },
  flow: {
    intervals: {},
  },
  utils: {},
  animated: {
    timelineVerticleLine: undefined,
    ssp: undefined
  },
  canDrawAuctionFlow: true,
  p: null,
  ip: null,
}

export default app;