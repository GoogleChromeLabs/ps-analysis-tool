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
import Main from './main';
import { downArrowData, nodes, upArrowData } from './implementation/data';
import {
  figureDraw,
  prevButtonClick,
  stepPrevButtonClick,
  arrowClick,
  playClick,
  onLoopEvent,
  onNoLoopEvent,
  stepNextButtonClick,
  nextButtonClick,
  resetButtonClick,
  speedSliderChange,
} from './implementation/listeners';
import {
  circleTravelInit,
  getRandomOffset,
  rippleEffect,
} from './implementation/utils';

let downArrowImage: p5.Image | null = null;
let upArrowImage: p5.Image | null = null;
const preloader = (p: p5) => {
  downArrowImage = p.loadImage(downArrowData);
  upArrowImage = p.loadImage(upArrowData);
};

document.addEventListener('figureDraw', figureDraw);

const idToStart = localStorage.getItem('ee-workflow') || '';

const expandedAnimator: Animator | null = null;
const expandedImage: ReturnType<FigureFactory['image']> | null = null;
const wasExpanded = false;

const container = document.getElementById('canvas-container') ?? undefined;

const mainCanvas = new Main(undefined, container, idToStart, preloader, true);
const mainFF = new FigureFactory(mainCanvas);

const IGCanvas = new Main(true);
const IGFF = new FigureFactory(IGCanvas);
IGCanvas.togglePause(true);

const prevButton = document.getElementById('prev');
prevButton?.addEventListener(
  'click',
  prevButtonClick.bind(null, wasExpanded, mainCanvas)
);

const stepPrevButton = document.getElementById('step-prev');
stepPrevButton?.addEventListener(
  'click',
  stepPrevButtonClick.bind(null, wasExpanded, mainCanvas)
);

const playButton = document.getElementById('play');

document.addEventListener('loop', onLoopEvent.bind(null, playButton));

document.addEventListener('noLoop', onNoLoopEvent.bind(null, playButton));

playButton?.addEventListener(
  'click',
  playClick.bind(
    null,
    wasExpanded,
    mainCanvas,
    playButton,
    expandedImage,
    expandedAnimator,
    upArrowImage,
    downArrowImage
  )
);

const stepNextButton = document.getElementById('step-next');
stepNextButton?.addEventListener(
  'click',
  stepNextButtonClick.bind(null, wasExpanded, mainCanvas)
);

const nextButton = document.getElementById('next');
nextButton?.addEventListener(
  'click',
  nextButtonClick.bind(null, wasExpanded, mainCanvas)
);

const resetButton = document.getElementById('reset');
resetButton?.addEventListener(
  'click',
  resetButtonClick.bind(
    null,
    wasExpanded,
    mainCanvas,
    playButton,
    expandedImage,
    expandedAnimator,
    upArrowImage,
    downArrowImage
  )
);

const speedSlider = document.getElementById('speed');
speedSlider?.addEventListener(
  'input',
  speedSliderChange.bind(null, mainCanvas)
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
    y: y + 15,
    height: 30,
    width: 30,
    imageLoader: () => downArrowImage!,
    mouseClicked: (figure) => {
      arrowClick(
        figure,
        animator,
        wasExpanded,
        mainCanvas,
        upArrowImage,
        downArrowImage,
        expandedAnimator,
        expandedImage
      );
    },
  });

  mainCanvas.addFigure(image);
};

const drawPublisherFlow = (x: number, y: number) => {
  const bubblesToCoordinates = {
    x: 0,
    y: 0,
  };

  const arcGroup = rippleEffect(mainCanvas, mainFF);

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
        endY: y + 50,
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
    y: y + 15,
    height: 30,
    width: 30,
    imageLoader: () => downArrowImage!,
    mouseClicked: (figure: Figure) => {
      arrowClick(
        figure,
        animator,
        wasExpanded,
        mainCanvas,
        upArrowImage,
        downArrowImage,
        expandedAnimator,
        expandedImage
      );
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
