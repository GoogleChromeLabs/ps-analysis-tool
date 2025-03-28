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
 * Internal dependencies.
 */
import { Animator, FigureFactory, Group, NextCoordinates } from './components';
import Figure from './components/figure';
import Arc from './components/figure/arc';
import Circle from './components/figure/circle';
import Main from './main';

const mainCanvas = new Main();
const mainFF = new FigureFactory(mainCanvas);

const IGCanvas = new Main(true);
const IGFF = new FigureFactory(IGCanvas);
IGCanvas.togglePause();

// Buttons
mainCanvas.addGroup(
  new Group(mainCanvas, [
    mainFF.box({
      x: 10,
      y: 10,
      width: 100,
      height: 50,
      fill: '#f00',
      mouseClicked: () => {
        mainCanvas.loadPreviousCheckpoint();
      },
    }),
    mainFF.text({
      x: 30,
      y: 20,
      text: 'Prev',
      fill: '#fff',
    }),
  ]),
  true
);

mainCanvas.addGroup(
  new Group(mainCanvas, [
    mainFF.box({
      x: 120,
      y: 10,
      width: 100,
      height: 50,
      fill: '#0f0',
      mouseClicked: () => {
        mainCanvas.togglePause();
      },
    }),
    mainFF.text({
      x: 140,
      y: 20,
      text: 'Play',
    }),
  ]),
  true
);

mainCanvas.addGroup(
  new Group(mainCanvas, [
    mainFF.box({
      x: 230,
      y: 10,
      width: 100,
      height: 50,
      fill: '#00f',
      mouseClicked: () => {
        mainCanvas.loadNextCheckpoint();
      },
    }),
    mainFF.text({
      x: 250,
      y: 20,
      text: 'Next',
      fill: '#fff',
    }),
  ]),
  true
);

mainCanvas.addGroup(
  new Group(mainCanvas, [
    mainFF.box({
      x: 340,
      y: 10,
      width: 100,
      height: 50,
      fill: '#f0f',
      mouseClicked: () => {
        mainCanvas.updateSpeed(0.5);
        IGCanvas.updateSpeed(0.5);
      },
    }),
    mainFF.text({
      x: 360,
      y: 20,
      text: '0.5x',
    }),
  ]),
  true
);

// Timeline
mainCanvas.addFigure(
  mainFF.line({
    x: 0,
    y: 300,
    endX: 1600,
    endY: 300,
  }),
  true
);

const nodes = [
  {
    type: 'advertiser',
    website: 'adv1.com',
    datetime: '2023-10-01 10:00',
    igGroupsCount: 3,
    interestGroups: ['shoes', 'heels', 'phones'],
    visited: false,
    visitedIndex: null,
  },
  {
    type: 'advertiser',
    website: 'adv2.com',
    datetime: '2023-10-01 11:00',
    igGroupsCount: 2,
    interestGroups: ['stilletos', 'shorts'],
    visited: false,
    visitedIndex: null,
  },
  {
    type: 'publisher',
    website: 'pub1.com',
    datetime: '2023-10-01 12:00',
    visited: false,
    visitedIndex: null,
  },
  {
    type: 'advertiser',
    website: 'adv3.com',
    datetime: '2023-10-01 13:00',
    igGroupsCount: 2,
    interestGroups: ['bike', 'car'],
    visited: false,
    visitedIndex: null,
  },
  {
    type: 'advertiser',
    website: 'adv5.com',
    datetime: '2023-10-01 13:02',
    igGroupsCount: 3,
    interestGroups: ['football', 'basketball', 'baseball'],
    visited: false,
    visitedIndex: null,
  },
  {
    type: 'publisher',
    website: 'pub2.com',
    datetime: '2023-10-01 14:00',
    visited: false,
    visitedIndex: null,
  },
  {
    type: 'advertiser',
    website: 'adv6.com',
    datetime: '2023-10-01 14:01',
    igGroupsCount: 3,
    interestGroups: ['movies', 'series', 'books'],
    visited: false,
    visitedIndex: null,
  },
  {
    type: 'advertiser',
    website: 'adv7.com',
    datetime: '2023-10-01 15:00',
    igGroupsCount: 3,
    interestGroups: ['IGG220', 'IGG201', 'IG225'],
    visited: false,
    visitedIndex: null,
  },
  {
    type: 'publisher',
    website: 'pub3.com',
    datetime: '2023-10-01 16:00',
    visited: false,
    visitedIndex: null,
  },
];

nodes.forEach((node, index) => {
  const group = new Group(mainCanvas, [
    mainFF.circle({
      diameter: 75,
      fill: '#d3d3d3',
      stroke: '#000',
      nextTipHelper: (nextCoordinates: NextCoordinates) => {
        const x = nextCoordinates.left.x + 150;
        let y = nextCoordinates.left.y;

        if (index) {
          y = nextCoordinates.middle.y + 87.5;
        }

        return {
          x,
          y,
        };
      },
    }),
    mainFF.text({
      text: node.website,
      fill: '#000',
      nextTipHelper: (nextCoordinates: NextCoordinates) => {
        const x = nextCoordinates.up.x;
        const y = nextCoordinates.up.y - 50;

        return {
          x,
          y,
        };
      },
    }),
  ]);

  mainCanvas.addGroup(group, true);
});

const circleTravelInit = (endX?: number, endY?: number) => {
  return (object: Figure, ...args: any) => {
    const circle = <Circle>object;
    const possibleX = args[0];
    const possibleY = args[1];
    let currentX = possibleX;
    let currentY = possibleY;
    const _endX = endX ?? 0;
    const _endY = endY ?? 0;
    let lerpSpeed = 0.01;
    circle.setShouldTravel(true);

    const traveller = (figure: Figure, speed: number) => {
      const _figure = <Circle>figure;
      const p5 = _figure.getP5();

      currentX = p5?.lerp(currentX, _endX, lerpSpeed * speed) ?? _endX;
      currentY = p5?.lerp(currentY, _endY, lerpSpeed * speed) ?? _endY;

      _figure.setX(currentX);
      _figure.setY(currentY);
      _figure.draw();

      if (
        (Math.floor(currentX) === Math.floor(_endX) &&
          Math.floor(currentY) === Math.floor(_endY)) ||
        (Math.ceil(currentX) === Math.ceil(_endX) &&
          Math.ceil(currentY) === Math.ceil(_endY))
      ) {
        return true;
      }

      lerpSpeed += 0.0003;

      return false;
    };

    const resetTravel = (figure: Figure) => {
      const _figure = <Circle>figure;
      currentX = possibleX;
      currentY = possibleY;
      _figure.setX(currentX);
      _figure.setY(currentY);
      lerpSpeed = 0.01;
    };

    const completeTravel = (figure: Figure, skipDraw: boolean) => {
      const _figure = <Circle>figure;
      _figure.setX(_endX);
      _figure.setY(_endY);

      if (!skipDraw) {
        _figure.draw();
      }
    };

    circle.setTraveller(traveller);
    circle.setResetTravel(resetTravel);
    circle.setCompleteTravel(completeTravel);
  };
};

const getRandomOffset = (range: number) =>
  Math.floor(Math.random() * range) - range / 2;

const drawIGFlow = (x: number, y: number, bubbleCount: number) => {
  const lastFigureCoordinates = {
    x: 0,
    y: 0,
  };

  const animator = new Animator(
    [
      mainFF.line({
        x,
        y,
        endX: x,
        endY: y + 50,
        hasArrow: true,
        shouldTravel: true,
      }),
      new Group(mainCanvas, [
        mainFF.box({
          width: 100,
          height: 50,
          fill: '#d3d3d3',
          nextTipHelper: (nextCoordinates: NextCoordinates) => {
            return {
              x: nextCoordinates.down.x - 50,
              y: nextCoordinates.down.y,
            };
          },
        }),
        mainFF.text({
          text: 'Box 1',
          fill: '#000',
          nextTipHelper: (nextCoordinates: NextCoordinates) =>
            nextCoordinates.middle,
        }),
      ]),
      mainFF.line({
        endYwith: 50,
        hasArrow: true,
        shouldTravel: true,
        nextTipHelper: (nextCoordinates: NextCoordinates) => {
          return {
            x: nextCoordinates.middle.x,
            y: nextCoordinates.middle.y + 25,
          };
        },
      }),
      new Group(mainCanvas, [
        mainFF.box({
          width: 100,
          height: 50,
          fill: '#d3d3d3',
          nextTipHelper: (nextCoordinates: NextCoordinates) => {
            return {
              x: nextCoordinates.down.x - 50,
              y: nextCoordinates.down.y,
            };
          },
        }),
        mainFF.text({
          text: 'Box 2',
          fill: '#000',
          nextTipHelper: (nextCoordinates: NextCoordinates) =>
            nextCoordinates.middle,
        }),
      ]),
      mainFF.line({
        endYwith: -50,
        hasArrow: true,
        shouldTravel: true,
        nextTipHelper: (nextCoordinates: NextCoordinates) => {
          return {
            x: nextCoordinates.middle.x + 10,
            y: nextCoordinates.middle.y - 25,
          };
        },
      }),
      mainFF.line({
        endYwith: -50,
        hasArrow: true,
        shouldTravel: true,
        nextTipHelper: (nextCoordinates: NextCoordinates) => {
          return {
            x: nextCoordinates.middle.x,
            y: nextCoordinates.middle.y - 75,
          };
        },
      }),
      mainFF.text({
        text: 'IG',
        fill: '#000',
        nextTipHelper: (nextCoordinates: NextCoordinates) => {
          lastFigureCoordinates.x = nextCoordinates.middle.x + 20;
          lastFigureCoordinates.y = nextCoordinates.middle.y;

          return {
            x: nextCoordinates.middle.x + 20,
            y: nextCoordinates.middle.y,
          };
        },
      }),
    ],
    mainFF
  );

  const bubbles = Array.from({ length: bubbleCount }, (_, index) => {
    return IGFF.circle({
      x: lastFigureCoordinates.x + index * 20 + getRandomOffset(20),
      y: lastFigureCoordinates.y + getRandomOffset(20),
      diameter: 10,
      fill: 'red',
      stroke: 'black',
      shouldTravel: true,
      travelInit: circleTravelInit(),
    });
  });

  const bubbleFlow = new Group(IGCanvas, bubbles);
  bubbleFlow.setThrow(true);
  bubbleFlow.setSideEffectOnDraw(() => {
    IGCanvas.resetQueuesAndReDrawAll();
    IGCanvas.togglePause();
    bubbles.forEach((bubble) => bubble.resetTraveller());

    mainCanvas.togglePause();
    mainCanvas.reDrawAll();
  });

  animator.setSideEffectOnDraw(() => {
    IGCanvas.addGroup(bubbleFlow);
    mainCanvas.togglePause();
    IGCanvas.togglePause();
  });

  mainCanvas.addAnimator(animator, false, true);
};

const arcTravelInit = (startDiameterOnTravel: number) => {
  return (object: Figure, ...args: any) => {
    let currentDiameter = startDiameterOnTravel ?? 0;
    const [possibleX, possibleY, startAngle, stopAngle, diameter] = args;

    const arc = <Arc>object;
    arc.setShouldTravel(true);
    arc.setDiameter(currentDiameter);

    const traveller = (figure: Figure, speed: number) => {
      const _figure = <Arc>figure;
      const p5 = _figure.getP5();

      const clearTravelMarks = () => {
        p5?.push();
        p5?.stroke('white');
        p5?.arc(
          possibleX - 1,
          possibleY,
          currentDiameter / 2 + 5,
          currentDiameter / 2 + 5,
          startAngle,
          stopAngle
        );
        p5?.pop();
      };

      currentDiameter = currentDiameter + 5 * speed;

      _figure.setDiameter(currentDiameter);

      if (currentDiameter > 0) {
        clearTravelMarks();
        _figure.draw();
      }

      if (Math.ceil(currentDiameter) === Math.ceil(diameter)) {
        clearTravelMarks();
        _figure.setDiameter(0);

        return true;
      }

      return false;
    };

    const resetTravel = (figure: Figure) => {
      const _figure = <Arc>figure;
      currentDiameter = startDiameterOnTravel ?? 0;
      _figure.setDiameter(currentDiameter);
    };

    const completeTravel = (figure: Figure, skipDraw: boolean) => {
      const _figure = <Arc>figure;
      _figure.setDiameter(diameter);

      if (!skipDraw) {
        _figure.draw();
      }
    };

    arc.setTraveller(traveller);
    arc.setResetTravel(resetTravel);
    arc.setCompleteTravel(completeTravel);
  };
};

const rippleEffect = () => {
  return (diameter: number, times: number) => {
    const startingCoordinates = {
      x: 0,
      y: 0,
    };

    const arcs = Array.from({ length: times }, (_, index) => {
      return mainFF.arc({
        diameter,
        startAngle: -Math.PI / 2,
        stopAngle: Math.PI / 2,
        fill: 'white',
        stroke: 'white',
        shouldTravel: true,
        travelInit: arcTravelInit(-index * 200),
        nextTipHelper: (nextCoordinates: NextCoordinates) => {
          if (!index) {
            startingCoordinates.x = nextCoordinates.middle.x + 52;
            startingCoordinates.y = nextCoordinates.middle.y;
          }

          return startingCoordinates;
        },
      });
    });

    const arcGroup = new Group(mainCanvas, arcs);

    return arcGroup;
  };
};

const drawPublisherFlow = (x: number, y: number) => {
  const bubblesToCoordinates = {
    x: 0,
    y: 0,
  };

  const arcGroup = rippleEffect();

  const renderBox6 = () => {
    const box6 = new Group(mainCanvas, [
      mainFF.box({
        width: 100,
        height: 50,
        fill: '#d3d3d3',
        nextTipHelper: (nextCoordinates: NextCoordinates) => {
          return {
            x: nextCoordinates.right.x,
            y: nextCoordinates.right.y - 25,
          };
        },
      }),
      mainFF.text({
        text: 'Box 6',
        fill: '#000',
        nextTipHelper: (nextCoordinates: NextCoordinates) => {
          bubblesToCoordinates.x = nextCoordinates.middle.x;
          bubblesToCoordinates.y = nextCoordinates.middle.y;

          return nextCoordinates.middle;
        },
      }),
    ]);

    const bubbles = Array.from({ length: 3 }, (_, index) => {
      return IGFF.circle({
        x: 0,
        y: 0,
        diameter: 10,
        fill: 'orange',
        stroke: 'black',
        shouldTravel: true,
        travelInit: circleTravelInit(
          bubblesToCoordinates.x + index * 20 + getRandomOffset(20),
          bubblesToCoordinates.y + getRandomOffset(20)
        ),
      });
    });

    const bubbleFlow = new Group(IGCanvas, bubbles);
    bubbleFlow.setThrow(true);
    bubbleFlow.setSideEffectOnDraw(() => {
      IGCanvas.resetQueuesAndReDrawAll();
      IGCanvas.togglePause();
      bubbles.forEach((bubble) => bubble.resetTraveller());

      box6.reDraw();
      mainCanvas.togglePause();
    });

    box6.setSideEffectOnDraw(() => {
      IGCanvas.addGroup(bubbleFlow);
      mainCanvas.togglePause();
      IGCanvas.togglePause();
    });

    return box6;
  };

  const animator = new Animator(
    [
      mainFF.line({
        x,
        y,
        endX: x,
        endY: y + 20,
        shouldTravel: true,
      }),
      mainFF.line({
        endXwith: 400,
        shouldTravel: true,
        nextTipHelper: (nextCoordinates: NextCoordinates) => {
          return {
            x: nextCoordinates.down.x - 200,
            y: nextCoordinates.down.y,
          };
        },
      }),
      new Group(mainCanvas, [
        mainFF.line({
          endYwith: 20,
          shouldTravel: true,
          nextTipHelper: (nextCoordinates: NextCoordinates) => {
            return {
              x: nextCoordinates.left.x,
              y: nextCoordinates.left.y,
            };
          },
        }),
        mainFF.line({
          endYwith: 20,
          shouldTravel: true,
          nextTipHelper: (nextCoordinates: NextCoordinates) => {
            return {
              x: nextCoordinates.up.x + 200,
              y: nextCoordinates.up.y,
            };
          },
        }),
        mainFF.line({
          endYwith: 20,
          shouldTravel: true,
          nextTipHelper: (nextCoordinates: NextCoordinates) => {
            return {
              x: nextCoordinates.up.x + 200,
              y: nextCoordinates.up.y,
            };
          },
        }),
      ]),
      new Group(mainCanvas, [
        mainFF.box({
          width: 100,
          height: 50,
          fill: '#d3d3d3',
          nextTipHelper: (nextCoordinates: NextCoordinates) => {
            return {
              x: nextCoordinates.up.x - 450,
              y: nextCoordinates.down.y,
            };
          },
        }),
        mainFF.text({
          text: 'Box 1',
          fill: '#000',
          nextTipHelper: (nextCoordinates: NextCoordinates) =>
            nextCoordinates.middle,
        }),
        mainFF.box({
          width: 100,
          height: 50,
          fill: '#d3d3d3',
          nextTipHelper: (nextCoordinates: NextCoordinates) => {
            return {
              x: nextCoordinates.middle.x + 150,
              y: nextCoordinates.middle.y - 25,
            };
          },
        }),
        mainFF.text({
          text: 'Box 2',
          fill: '#000',
          nextTipHelper: (nextCoordinates: NextCoordinates) =>
            nextCoordinates.middle,
        }),
        mainFF.box({
          width: 100,
          height: 50,
          fill: '#d3d3d3',
          nextTipHelper: (nextCoordinates: NextCoordinates) => {
            return {
              x: nextCoordinates.middle.x + 150,
              y: nextCoordinates.middle.y - 25,
            };
          },
        }),
        mainFF.text({
          text: 'Box 3',
          fill: '#000',
          nextTipHelper: (nextCoordinates: NextCoordinates) =>
            nextCoordinates.middle,
        }),
      ]),
      mainFF.line({
        endYwith: 50,
        shouldTravel: true,
        nextTipHelper: (nextCoordinates: NextCoordinates) => {
          return {
            x: nextCoordinates.middle.x - 200,
            y: nextCoordinates.middle.y + 25,
          };
        },
      }),
      mainFF.line({
        endXwith: 400,
        shouldTravel: true,
        nextTipHelper: (nextCoordinates: NextCoordinates) => {
          return {
            x: nextCoordinates.down.x - 200,
            y: nextCoordinates.down.y,
          };
        },
      }),
      new Group(mainCanvas, [
        mainFF.line({
          endYwith: 20,
          shouldTravel: true,
          nextTipHelper: (nextCoordinates: NextCoordinates) => {
            return {
              x: nextCoordinates.left.x,
              y: nextCoordinates.left.y,
            };
          },
        }),
        mainFF.line({
          endYwith: 20,
          shouldTravel: true,
          nextTipHelper: (nextCoordinates: NextCoordinates) => {
            return {
              x: nextCoordinates.up.x + 200,
              y: nextCoordinates.up.y,
            };
          },
        }),
        mainFF.line({
          endYwith: 20,
          shouldTravel: true,
          nextTipHelper: (nextCoordinates: NextCoordinates) => {
            return {
              x: nextCoordinates.up.x + 200,
              y: nextCoordinates.up.y,
            };
          },
        }),
      ]),
      new Group(mainCanvas, [
        mainFF.text({
          text: 'Text 1',
          fill: '#000',
          nextTipHelper: (nextCoordinates: NextCoordinates) => {
            return {
              x: nextCoordinates.down.x - 400,
              y: nextCoordinates.down.y + 25,
            };
          },
        }),
        mainFF.text({
          text: 'Text 2',
          fill: '#000',
          nextTipHelper: (nextCoordinates: NextCoordinates) => {
            return {
              x: nextCoordinates.middle.x + 200,
              y: nextCoordinates.middle.y,
            };
          },
        }),
        mainFF.text({
          text: 'Text 3',
          fill: '#000',
          nextTipHelper: (nextCoordinates: NextCoordinates) => {
            return {
              x: nextCoordinates.middle.x + 200,
              y: nextCoordinates.middle.y,
            };
          },
        }),
      ]),
      mainFF.line({
        endYwith: 50,
        shouldTravel: true,
        nextTipHelper: (nextCoordinates: NextCoordinates) => {
          return {
            x: nextCoordinates.middle.x - 200,
            y: nextCoordinates.middle.y + 25,
          };
        },
      }),
      new Group(mainCanvas, [
        mainFF.box({
          width: 100,
          height: 50,
          fill: '#d3d3d3',
          nextTipHelper: (nextCoordinates: NextCoordinates) => {
            return {
              x: nextCoordinates.down.x - 50,
              y: nextCoordinates.down.y,
            };
          },
        }),
        mainFF.text({
          text: 'Box 4',
          fill: '#000',
          nextTipHelper: (nextCoordinates: NextCoordinates) =>
            nextCoordinates.middle,
        }),
      ]),
      mainFF.line({
        endYwith: 50,
        shouldTravel: true,
        hasArrow: true,
        nextTipHelper: (nextCoordinates: NextCoordinates) => {
          return {
            x: nextCoordinates.down.x,
            y: nextCoordinates.down.y + 25,
          };
        },
      }),
      new Group(mainCanvas, [
        mainFF.box({
          width: 100,
          height: 50,
          fill: '#d3d3d3',
          nextTipHelper: (nextCoordinates: NextCoordinates) => {
            return {
              x: nextCoordinates.down.x - 50,
              y: nextCoordinates.down.y,
            };
          },
        }),
        mainFF.text({
          text: 'Box 5',
          fill: '#000',
          nextTipHelper: (nextCoordinates: NextCoordinates) =>
            nextCoordinates.middle,
        }),
      ]),
      arcGroup(600, 6),
      mainFF.line({
        endYwith: -50,
        shouldTravel: true,
        hasArrow: true,
        nextTipHelper: (nextCoordinates: NextCoordinates) => {
          return {
            x: nextCoordinates.middle.x - 40,
            y: nextCoordinates.middle.y - 25,
          };
        },
      }),
      mainFF.line({
        endXwith: 50,
        shouldTravel: true,
        hasArrow: true,
        nextTipHelper: (nextCoordinates: NextCoordinates) => {
          return {
            x: nextCoordinates.up.x + 40,
            y: nextCoordinates.up.y - 75,
          };
        },
      }),
      renderBox6(),
      mainFF.line({
        endYwith: 50,
        shouldTravel: true,
        hasArrow: true,
        nextTipHelper: (nextCoordinates: NextCoordinates) => {
          return {
            x: nextCoordinates.down.x,
            y: nextCoordinates.down.y + 25,
          };
        },
      }),
      new Group(mainCanvas, [
        mainFF.box({
          width: 100,
          height: 50,
          fill: '#d3d3d3',
          nextTipHelper: (nextCoordinates: NextCoordinates) => {
            return {
              x: nextCoordinates.down.x - 50,
              y: nextCoordinates.down.y,
            };
          },
        }),
        mainFF.text({
          text: 'Box 7',
          fill: '#000',
          nextTipHelper: (nextCoordinates: NextCoordinates) =>
            nextCoordinates.middle,
        }),
      ]),
    ],
    mainFF
  );

  mainCanvas.addAnimator(animator, false, true);
};

drawIGFlow(150, 337.5, 2);
drawIGFlow(300, 337.5, 3);
drawPublisherFlow(450, 337.5);
drawIGFlow(600, 337.5, 3);
drawIGFlow(750, 337.5, 3);
drawPublisherFlow(900, 337.5);
drawIGFlow(1050, 337.5, 3);
drawIGFlow(1200, 337.5, 3);
drawPublisherFlow(1350, 337.5);
