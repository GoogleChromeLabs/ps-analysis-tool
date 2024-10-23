const config = {
    canvas: {
      width: 700,
      background: 245,
      fontSize: 12
    },
    timeline: {
      position: {x: 160, y: 50},
      circleProps: {
        diameter: 50,
        verticalSpacing: 70,
      },
      stepDelay: 1500,
      user: {
        width: 30,
        height: 30,
      },
      circles: [
        { type: 'advertiser', website: 'adv1.com', datetime: '2023-10-01 10:00' },
        { type: 'advertiser', website: 'adv2.com', datetime: '2023-10-01 11:00' },
        { type: 'publisher', website: 'pub1.com', datetime: '2023-10-01 12:00' },
        { type: 'advertiser', website: 'adv3.com', datetime: '2023-10-01 13:00' },
        { type: 'advertiser', website: 'adv5.com', datetime: '2023-10-01 13:02' },
        { type: 'publisher', website: 'pub2.com', datetime: '2023-10-01 14:00' },
        { type: 'advertiser', website: 'adv6.com', datetime: '2023-10-01 14:01' },
        { type: 'advertiser', website: 'adv7.com', datetime: '2023-10-01 15:00' },
      ],
    },
    flow: {
      box: { width: 125, height: 100 },
      smallBox: { width: 80, height: 50 },
      mediumBox: { width: 125, height: 50 },
      lineWidth: 100,
      lineHeight: 50,
    },
    rippleEffect: {
      ripples: [],
      numRipples: 3,
      maxRadius: 200,
      time: 4000,
      speed: 1,
      rippled: false,
    }
  };

export default config;