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
import p5 from 'p5';
import { Animator, FigureFactory, Group, NextCoordinates } from './components';
import Figure from './components/figure';
import Arc from './components/figure/arc';
import Circle from './components/figure/circle';
import Main from './main';

const downArrowData =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iNDhweCIgdmlld0JveD0iMCAtOTYwIDk2MCA5NjAiIHdpZHRoPSI0OHB4IiBmaWxsPSIjNWY2MzY4Ij48cGF0aCBkPSJNNDgwLTIwMCAyNDAtNDQwbDQyLTQyIDE5OCAxOTggMTk4LTE5OCA0MiA0Mi0yNDAgMjQwWm0wLTI1M0wyNDAtNjkzbDQyLTQyIDE5OCAxOTggMTk4LTE5OCA0MiA0Mi0yNDAgMjQwWiIvPjwvc3ZnPg==';

const upArrowData =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iNDhweCIgdmlld0JveD0iMCAtOTYwIDk2MCA5NjAiIHdpZHRoPSI0OHB4IiBmaWxsPSIjNWY2MzY4Ij48cGF0aCBkPSJtMjgyLTIyNS00Mi00MiAyNDAtMjQwIDI0MCAyNDAtNDIgNDItMTk4LTE5OC0xOTggMTk4Wm0wLTI1My00Mi00MiAyNDAtMjQwIDI0MCAyNDAtNDIgNDItMTk4LTE5OC0xOTggMTk4WiIvPjwvc3ZnPg==';

let downArrowImage: p5.Image | null = null;
let upArrowImage: p5.Image | null = null;
const preloader = (p: p5) => {
  downArrowImage = p.loadImage(downArrowData);
  upArrowImage = p.loadImage(upArrowData);
};
document.addEventListener('figureDraw', (e) => {
  const detail = (e as CustomEvent).detail;

  if (detail?.figureId) {
    // eslint-disable-next-line no-console
    console.log('Figure ID:', detail.figureId);
    localStorage.setItem('ee-workflow', detail.figureId);
  }
});

const idToStart = localStorage.getItem('ee-workflow') || '';

let expandedAnimator: Animator | null = null;
let expandedImage: ReturnType<FigureFactory['image']> | null = null;
let wasExpanded = false;
const arrowClick = (figure: Figure, animator: Animator) => {
  if (!wasExpanded) {
    if (mainCanvas.isPaused()) {
      mainCanvas.togglePause();
    }

    playClick();
    wasExpanded = true;
  }

  const _image = <ReturnType<FigureFactory['image']>>figure;

  if (expandedAnimator?.getId() === animator.getId()) {
    _image.reDraw(undefined, undefined, () => downArrowImage!);
    mainCanvas.loadSnapshotAndReDraw();
    expandedAnimator = null;
    expandedImage = null;
  } else {
    _image.reDraw(undefined, undefined, () => upArrowImage!);
    expandedImage?.reDraw(undefined, undefined, () => downArrowImage!);
    expandedImage = _image;
    expandedAnimator = animator;
    mainCanvas.loadSnapshotAndReDraw(animator.getId(), { x: 0, y: 20 });
  }
};

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

const container = document.getElementById('canvas-container') ?? undefined;

const mainCanvas = new Main(undefined, container, idToStart, preloader);
const mainFF = new FigureFactory(mainCanvas);

const IGCanvas = new Main(true);
const IGFF = new FigureFactory(IGCanvas);
IGCanvas.togglePause(true);

const prevButton = document.getElementById('prev');
prevButton?.addEventListener('click', () => {
  if (wasExpanded) {
    return;
  }

  mainCanvas.loadPreviousCheckpoint();
});

const stepPrevButton = document.getElementById('step-prev');
stepPrevButton?.addEventListener('click', () => {
  if (wasExpanded) {
    return;
  }

  mainCanvas.stepBack();
});

const playButton = document.getElementById('play');
const playClick = () => {
  if (wasExpanded) {
    if (expandedImage && expandedAnimator) {
      arrowClick(expandedImage, expandedAnimator);
    }
    wasExpanded = false;

    mainCanvas.loadPreviousCheckpoint();
    mainCanvas.togglePause();
  }

  mainCanvas.togglePause();

  if (playButton) {
    if (mainCanvas.isPaused()) {
      playButton.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="#5f6368"><path d="M320-203v-560l440 280-440 280Zm60-280Zm0 171 269-171-269-171v342Z"/></svg>';
    } else {
      playButton.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="#5f6368"><path d="M525-200v-560h235v560H525Zm-325 0v-560h235v560H200Zm385-60h115v-440H585v440Zm-325 0h115v-440H260v440Zm0-440v440-440Zm325 0v440-440Z"/></svg>';
    }
  }
};

document.addEventListener('loop', () => {
  if (playButton) {
    playButton.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="#5f6368"><path d="M525-200v-560h235v560H525Zm-325 0v-560h235v560H200Zm385-60h115v-440H585v440Zm-325 0h115v-440H260v440Zm0-440v440-440Zm325 0v440-440Z"/></svg>';
  }
});

document.addEventListener('noLoop', () => {
  if (playButton) {
    playButton.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="#5f6368"><path d="M320-203v-560l440 280-440 280Zm60-280Zm0 171 269-171-269-171v342Z"/></svg>';
  }
});

playButton?.addEventListener('click', playClick);

const stepNextButton = document.getElementById('step-next');
stepNextButton?.addEventListener('click', () => {
  if (wasExpanded) {
    return;
  }

  mainCanvas.stepNext();
});

const nextButton = document.getElementById('next');
nextButton?.addEventListener('click', () => {
  if (wasExpanded) {
    return;
  }

  mainCanvas.loadNextCheckpoint();
});

const resetButton = document.getElementById('reset');
resetButton?.addEventListener('click', () => {
  if (wasExpanded) {
    playClick();
  }

  mainCanvas.reset();
});

const speedSlider = document.getElementById('speed');
speedSlider?.addEventListener('input', (e) => {
  const target = e.target as HTMLInputElement;
  const value = parseFloat(target.value);

  if (mainCanvas) {
    mainCanvas.updateSpeed(value);
  }
});

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

nodes.forEach((node, index) => {
  const circle = mainFF.circle({
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
    mouseClicked: () => {
      // eslint-disable-next-line no-console
      console.log(node.website, node);
      mainCanvas.removeFigure(circle);
    },
  });

  const group = new Group(mainCanvas, [
    circle,
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
      const p = _figure.getP5();

      currentX = p?.lerp(currentX, _endX, lerpSpeed * speed) ?? _endX;
      currentY = p?.lerp(currentY, _endY, lerpSpeed * speed) ?? _endY;

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
    IGCanvas.togglePause(true);
    bubbles.forEach((bubble) => bubble.resetTraveller());

    mainCanvas.togglePause(false);
    mainCanvas.reDrawAll();
  });

  animator.setSideEffectOnDraw(() => {
    IGCanvas.addGroup(bubbleFlow);
    mainCanvas.togglePause(true);
    IGCanvas.togglePause(false);
  });

  mainCanvas.addAnimator(animator, false, true);

  const image = mainFF.image({
    x,
    y: y + 10,
    height: 30,
    width: 30,
    imageLoader: () => downArrowImage!,
    mouseClicked: (figure) => {
      arrowClick(figure, animator);
    },
  });

  mainCanvas.addFigure(image);
};

const arcTravelInit = (startDiameterOnTravel: number) => {
  return (object: Figure, ...args: any) => {
    let currentDiameter = startDiameterOnTravel ?? 0;
    const [possibleX, possibleY, startAngle, stopAngle, diameter] = args;

    const arc = <Arc>object;
    arc.setShouldTravel(true);
    arc.setDiameter(currentDiameter);

    const clearTravelMarks = (p: p5 | null) => {
      p?.push();
      p?.stroke('white');
      p?.arc(
        possibleX - 1,
        possibleY,
        currentDiameter / 2 + 5,
        currentDiameter / 2 + 5,
        startAngle,
        stopAngle
      );
      p?.pop();
    };

    const traveller = (figure: Figure, speed: number) => {
      const _figure = <Arc>figure;
      const p = _figure.getP5();

      currentDiameter = currentDiameter + 5 * speed;

      _figure.setDiameter(currentDiameter);

      if (currentDiameter > 0) {
        clearTravelMarks(p);
        _figure.draw();
      }

      if (Math.ceil(currentDiameter) === Math.ceil(diameter)) {
        clearTravelMarks(p);
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
      _figure.setDiameter(0);

      if (!skipDraw) {
        currentDiameter = diameter;
        clearTravelMarks(_figure.getP5());
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
      IGCanvas.togglePause(true);
      bubbles.forEach((bubble) => bubble.resetTraveller());

      box6.reDraw();
      mainCanvas.togglePause(false);
    });

    box6.setSideEffectOnDraw(() => {
      IGCanvas.addGroup(bubbleFlow);
      mainCanvas.togglePause(true);
      IGCanvas.togglePause(false);
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

  const image = mainFF.image({
    x,
    y: y + 10,
    height: 30,
    width: 30,
    imageLoader: () => downArrowImage!,
    mouseClicked: (figure: Figure) => {
      arrowClick(figure, animator);
    },
  });

  mainCanvas.addFigure(image);
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
