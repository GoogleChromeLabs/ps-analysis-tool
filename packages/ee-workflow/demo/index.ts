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
import p5 from 'p5';
/**
 * Internal dependencies.
 */
import {
  Animator,
  FigureFactory,
  Group,
  NextCoordinates,
} from '../src/components';
import Figure from '../src/components/figure';
import Main from '../src/main';
import { downArrowData, nodes, upArrowData } from './data';
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
  interactiveCheckboxOnChange,
} from './listeners';
import { circleTravelInit, getRandomOffset, rippleEffect } from './utils';

const flow = {
  init: () => {
    const variables = flow.initVariables();
    const controls = flow.initControls(
      variables.getExpanded,
      variables.mainCanvas,
      variables.interestGroupCanvas,
      variables.getWasinterestGroupPlaying,
      variables.setWasinterestGroupPlaying,
      variables.getImage,
      variables.setIsInteractive
    );

    return {
      ...variables,
      ...controls,
    };
  },

  initImages: () => {
    let downArrowImage = null as p5.Image | null;
    let upArrowImage = null as p5.Image | null;

    const getImage = (key: 'down' | 'up') => {
      if (key === 'down') {
        return downArrowImage;
      }

      return upArrowImage;
    };

    const setImage = (key: 'down' | 'up', image: p5.Image) => {
      if (key === 'down') {
        downArrowImage = image;
      } else {
        upArrowImage = image;
      }
    };

    return {
      getImage,
      setImage,
    };
  },

  initStates: () => {
    let isInteractive = false;
    const getIsInteractive = () => isInteractive;
    const setIsInteractive = (value: boolean) => {
      isInteractive = value;
    };

    let wasinterestGroupPlaying = false;
    const getWasinterestGroupPlaying = () => wasinterestGroupPlaying;
    const setWasinterestGroupPlaying = (value: boolean) => {
      wasinterestGroupPlaying = value;
    };

    const checkpoints: string[] = [];
    const getCheckpoint = (index: number) => {
      if (index < checkpoints.length) {
        return checkpoints[index];
      }

      return '';
    };
    const setCheckpoint = (checkpoint: string) => {
      checkpoints.push(checkpoint);
    };

    let expanded = {
      animator: null as Animator | null,
      image: null as ReturnType<FigureFactory['image']> | null,
      wasExpanded: false,
    };
    const getExpanded = () => expanded;
    const setExpanded = (value: typeof expanded) => {
      expanded = value;
    };

    return {
      getIsInteractive,
      setIsInteractive,
      getCheckpoint,
      setCheckpoint,
      getWasinterestGroupPlaying,
      setWasinterestGroupPlaying,
      getExpanded,
      setExpanded,
    };
  },

  initCanvasVariables: (preloader: (p: p5) => void) => {
    const container = document.getElementById('canvas-container')!;
    const idToStart = localStorage.getItem('ee-workflow') || '';

    const mainCanvas = new Main(
      undefined,
      container,
      undefined,
      {
        x: 0,
        y: 100,
      },
      idToStart,
      preloader,
      true
    );
    const mainFigureFactory = new FigureFactory(mainCanvas, container);

    const interestGroupCanvas = new Main(
      true,
      undefined,
      {
        width: 1600,
        height: 2000,
      },
      {
        x: 0,
        y: 100,
      }
    );
    const interestGroupFigureFactory = new FigureFactory(
      interestGroupCanvas,
      container
    );
    interestGroupCanvas.togglePause(true);

    return {
      mainCanvas,
      mainFigureFactory,
      interestGroupCanvas,
      interestGroupFigureFactory,
    };
  },

  initVariables: () => {
    const {
      getIsInteractive,
      setIsInteractive,
      getCheckpoint,
      setCheckpoint,
      getWasinterestGroupPlaying,
      setWasinterestGroupPlaying,
      getExpanded,
      setExpanded,
    } = flow.initStates();
    const { getImage, setImage } = flow.initImages();

    const preloader = (p: p5) => {
      setImage('down', p.loadImage(downArrowData));
      setImage('up', p.loadImage(upArrowData));
    };

    const {
      mainCanvas,
      mainFigureFactory,
      interestGroupCanvas,
      interestGroupFigureFactory,
    } = flow.initCanvasVariables(preloader);

    return {
      getIsInteractive,
      setIsInteractive,
      getCheckpoint,
      setCheckpoint,
      getWasinterestGroupPlaying,
      setWasinterestGroupPlaying,
      getExpanded,
      setExpanded,
      getImage,
      mainCanvas,
      mainFigureFactory,
      interestGroupCanvas,
      interestGroupFigureFactory,
    };
  },

  initControls: (
    getExpanded: () => {
      wasExpanded: boolean;
      image: Figure | null;
      animator: Animator | null;
    },
    mainCanvas: Main,
    interestGroupCanvas: Main,
    getWasinterestGroupPlaying: () => boolean,
    setWasinterestGroupPlaying: (value: boolean) => void,
    getImage: (key: 'down' | 'up') => p5.Image | null,
    setIsInteractive: (value: boolean) => void
  ) => {
    const expanded = getExpanded();

    const prevButton = document.getElementById('prev');
    prevButton?.addEventListener(
      'click',
      prevButtonClick.bind(
        null,
        expanded.wasExpanded,
        mainCanvas,
        interestGroupCanvas
      )
    );

    const stepPrevButton = document.getElementById('step-prev');
    stepPrevButton?.addEventListener(
      'click',
      stepPrevButtonClick.bind(
        null,
        expanded.wasExpanded,
        mainCanvas,
        interestGroupCanvas
      )
    );

    const playButton = document.getElementById('play');
    playButton?.addEventListener(
      'click',
      playClick.bind(
        null,
        mainCanvas,
        interestGroupCanvas,
        getWasinterestGroupPlaying,
        setWasinterestGroupPlaying,
        playButton,
        expanded,
        () => getImage('down')!,
        true
      )
    );

    const stepNextButton = document.getElementById('step-next');
    stepNextButton?.addEventListener(
      'click',
      stepNextButtonClick.bind(
        null,
        expanded.wasExpanded,
        mainCanvas,
        interestGroupCanvas
      )
    );

    const nextButton = document.getElementById('next');
    nextButton?.addEventListener(
      'click',
      nextButtonClick.bind(
        null,
        expanded.wasExpanded,
        mainCanvas,
        interestGroupCanvas
      )
    );

    const resetButton = document.getElementById('reset');
    resetButton?.addEventListener(
      'click',
      resetButtonClick.bind(
        null,
        expanded,
        mainCanvas,
        interestGroupCanvas,
        playButton,
        getWasinterestGroupPlaying,
        setWasinterestGroupPlaying,
        () => getImage('down')!
      )
    );

    const speedSlider = document.getElementById('speed');
    speedSlider?.addEventListener(
      'input',
      speedSliderChange.bind(null, mainCanvas, interestGroupCanvas)
    );

    const interactiveCheckbox = document.getElementById('interactive');
    interactiveCheckbox?.addEventListener(
      'click',
      interactiveCheckboxOnChange.bind(
        null,
        mainCanvas,
        setIsInteractive,
        playButton
      )
    );

    return {
      prevButton,
      stepPrevButton,
      playButton,
      stepNextButton,
      nextButton,
      resetButton,
      speedSlider,
      interactiveCheckbox,
    };
  },
};

const draw = {
  start: (variables: ReturnType<typeof flow.init>) => {
    draw.timeline(variables);

    const interestGroupBubblesCoordinates = [];
    const publisherBubblesCoordinates = [];

    interestGroupBubblesCoordinates.push(
      draw.interestGroupFlow(150, 187.5, 'IG-1', variables),
      draw.interestGroupFlow(300, 187.5, 'IG-2', variables)
    );
    publisherBubblesCoordinates.push(
      draw.publisherFlow(450, 187.5, 'P-1', variables)
    );

    interestGroupBubblesCoordinates.push(
      draw.interestGroupFlow(600, 187.5, 'IG-3', variables),
      draw.interestGroupFlow(750, 187.5, 'IG-4', variables)
    );

    publisherBubblesCoordinates.push(
      draw.publisherFlow(900, 187.5, 'P-2', variables)
    );

    interestGroupBubblesCoordinates.push(
      draw.interestGroupFlow(1050, 187.5, 'IG-5', variables),
      draw.interestGroupFlow(1200, 187.5, 'IG-6', variables)
    );

    publisherBubblesCoordinates.push(
      draw.publisherFlow(1350, 187.5, 'P-3', variables)
    );

    return {
      interestGroupBubblesCoordinates,
      publisherBubblesCoordinates,
    };
  },

  timeline: (variables: ReturnType<typeof flow.init>) => {
    const {
      mainCanvas,
      mainFigureFactory,
      interestGroupCanvas,
      getIsInteractive,
      getWasinterestGroupPlaying,
      setWasinterestGroupPlaying,
      playButton,
      getExpanded,
      getImage,
      getCheckpoint,
    } = variables;

    mainCanvas.addFigure(
      mainFigureFactory.line({
        x: 0,
        y: 150,
        endX: 1600,
        endY: 150,
      }),
      true
    );

    // Add nodes circles
    nodes.forEach((node, index) => {
      const circle = mainFigureFactory.circle({
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
          if (
            getIsInteractive() &&
            mainCanvas.isPaused() &&
            interestGroupCanvas.isPaused()
          ) {
            if (mainCanvas.isPaused()) {
              playClick(
                mainCanvas,
                interestGroupCanvas,
                getWasinterestGroupPlaying,
                setWasinterestGroupPlaying,
                playButton,
                getExpanded(),
                () => getImage('down')!,
                false
              );
            }
            mainCanvas.loadCheckpointToHelper(getCheckpoint(index));
          }
        },
      });

      const nodeGroup = new Group(mainCanvas, [
        circle,
        mainFigureFactory.text({
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

      mainCanvas.addGroup(nodeGroup, true);
    });
  },

  interestGroupFlow: (
    x: number,
    y: number,
    id: string,
    variables: ReturnType<typeof flow.init>
  ) => {
    const {
      mainCanvas,
      mainFigureFactory,
      setCheckpoint,
      getImage,
      getExpanded,
      playButton,
    } = variables;

    const lastFigureCoordinates = {
      x: 0,
      y: 0,
    };

    const checkpointId = 'checkpoint-' + id;
    setCheckpoint(checkpointId);

    const animator = new Animator(
      [
        mainFigureFactory.line({
          x,
          y,
          endX: x,
          endY: y + 50,
          hasArrow: true,
          shouldTravel: true,
          id: checkpointId,
        }),
        new Group(mainCanvas, [
          mainFigureFactory.box({
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
          mainFigureFactory.text({
            text: 'Box 1',
            fill: '#000',
            nextTipHelper: (nextCoordinates: NextCoordinates) =>
              nextCoordinates.middle,
          }),
        ]),
        mainFigureFactory.line({
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
          mainFigureFactory.box({
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
          mainFigureFactory.text({
            text: 'Box 2',
            fill: '#000',
            nextTipHelper: (nextCoordinates: NextCoordinates) =>
              nextCoordinates.middle,
          }),
        ]),
        mainFigureFactory.line({
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
        mainFigureFactory.line({
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
        mainFigureFactory.text({
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
          isDispatcher: true,
          id: 'dispatcher-' + id,
        }),
      ],
      mainFigureFactory,
      id
    );

    mainCanvas.addAnimator(animator, false, true);

    const image = mainFigureFactory.image({
      x,
      y: y + 15,
      height: 30,
      width: 30,
      imageLoader: () => getImage('down')!,
      mouseClicked: (figure) => {
        arrowClick(
          figure,
          animator,
          mainCanvas,
          () => getImage('up')!,
          () => getImage('down')!,
          getExpanded(),
          playButton
        );
      },
      isDispatcher: true,
    });

    mainCanvas.addFigure(image);

    return lastFigureCoordinates;
  },

  interestGroupBubbles: (
    bubbleCount: number,
    mainCanvas: Main,
    interestGroupCanvas: Main,
    interestGroupFigureFactory: FigureFactory,
    x: number,
    y: number,
    stepping: boolean
  ) => {
    const bubbles = Array.from({ length: bubbleCount }, (_, index) => {
      return interestGroupFigureFactory.circle({
        x: x + index * 20 + getRandomOffset(20),
        y: y + getRandomOffset(20),
        diameter: 10,
        fill: 'red',
        stroke: 'black',
        shouldTravel: true,
        travelInit: circleTravelInit(),
      });
    });

    const bubbleFlow = new Group(interestGroupCanvas, bubbles);
    bubbleFlow.setThrow(true);
    bubbleFlow.setSideEffectOnDraw(() => {
      interestGroupCanvas.resetQueuesAndReDrawAll();
      interestGroupCanvas.togglePause(true);
      bubbles.forEach((bubble) => bubble.resetTraveller());

      if (!stepping) {
        mainCanvas.togglePause(false);
      }
      mainCanvas.reDrawAll();
    });

    interestGroupCanvas.addGroup(bubbleFlow);
    interestGroupCanvas.togglePause(false);
  },

  publisherFlow: (
    x: number,
    y: number,
    id: string,
    variables: ReturnType<typeof flow.init>
  ) => {
    const {
      mainCanvas,
      mainFigureFactory,
      setCheckpoint,
      getImage,
      getExpanded,
      playButton,
    } = variables;

    const bubblesToCoordinates = {
      x: 0,
      y: 0,
    };

    const arcGroup = rippleEffect(mainCanvas, mainFigureFactory);

    const checkpointId = 'checkpoint-' + id;
    setCheckpoint(checkpointId);

    const animator = new Animator(
      [
        mainFigureFactory.line({
          x,
          y,
          endX: x,
          endY: y + 50,
          shouldTravel: true,
          id: checkpointId,
        }),
        mainFigureFactory.line({
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
          mainFigureFactory.line({
            endYwith: 20,
            shouldTravel: true,
            nextTipHelper: (nextCoordinates: NextCoordinates) => {
              return {
                x: nextCoordinates.left.x,
                y: nextCoordinates.left.y,
              };
            },
          }),
          mainFigureFactory.line({
            endYwith: 20,
            shouldTravel: true,
            nextTipHelper: (nextCoordinates: NextCoordinates) => {
              return {
                x: nextCoordinates.up.x + 200,
                y: nextCoordinates.up.y,
              };
            },
          }),
          mainFigureFactory.line({
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
          mainFigureFactory.box({
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
          mainFigureFactory.text({
            text: 'Box 1',
            fill: '#000',
            nextTipHelper: (nextCoordinates: NextCoordinates) =>
              nextCoordinates.middle,
          }),
          mainFigureFactory.box({
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
          mainFigureFactory.text({
            text: 'Box 2',
            fill: '#000',
            nextTipHelper: (nextCoordinates: NextCoordinates) =>
              nextCoordinates.middle,
          }),
          mainFigureFactory.box({
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
          mainFigureFactory.text({
            text: 'Box 3',
            fill: '#000',
            nextTipHelper: (nextCoordinates: NextCoordinates) =>
              nextCoordinates.middle,
          }),
        ]),
        mainFigureFactory.line({
          endYwith: 50,
          shouldTravel: true,
          nextTipHelper: (nextCoordinates: NextCoordinates) => {
            return {
              x: nextCoordinates.middle.x - 200,
              y: nextCoordinates.middle.y + 25,
            };
          },
        }),
        mainFigureFactory.line({
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
          mainFigureFactory.line({
            endYwith: 20,
            shouldTravel: true,
            nextTipHelper: (nextCoordinates: NextCoordinates) => {
              return {
                x: nextCoordinates.left.x,
                y: nextCoordinates.left.y,
              };
            },
          }),
          mainFigureFactory.line({
            endYwith: 20,
            shouldTravel: true,
            nextTipHelper: (nextCoordinates: NextCoordinates) => {
              return {
                x: nextCoordinates.up.x + 200,
                y: nextCoordinates.up.y,
              };
            },
          }),
          mainFigureFactory.line({
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
          mainFigureFactory.text({
            text: 'Text 1',
            fill: '#000',
            nextTipHelper: (nextCoordinates: NextCoordinates) => {
              return {
                x: nextCoordinates.down.x - 400,
                y: nextCoordinates.down.y + 25,
              };
            },
          }),
          mainFigureFactory.text({
            text: 'Text 2',
            fill: '#000',
            nextTipHelper: (nextCoordinates: NextCoordinates) => {
              return {
                x: nextCoordinates.middle.x + 200,
                y: nextCoordinates.middle.y,
              };
            },
          }),
          mainFigureFactory.text({
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
        mainFigureFactory.line({
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
          mainFigureFactory.box({
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
          mainFigureFactory.text({
            text: 'Box 4',
            fill: '#000',
            nextTipHelper: (nextCoordinates: NextCoordinates) =>
              nextCoordinates.middle,
          }),
        ]),
        mainFigureFactory.line({
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
          mainFigureFactory.box({
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
          mainFigureFactory.text({
            text: 'Box 5',
            fill: '#000',
            nextTipHelper: (nextCoordinates: NextCoordinates) =>
              nextCoordinates.middle,
          }),
        ]),
        arcGroup(600, 6),
        mainFigureFactory.line({
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
        mainFigureFactory.line({
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
        new Group(mainCanvas, [
          mainFigureFactory.box({
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
          mainFigureFactory.text({
            text: 'Box 6',
            fill: '#000',
            nextTipHelper: (nextCoordinates: NextCoordinates) => {
              bubblesToCoordinates.x = nextCoordinates.middle.x;
              bubblesToCoordinates.y = nextCoordinates.middle.y;

              return nextCoordinates.middle;
            },
            isDispatcher: true,
            id: 'dispatcher-' + id,
          }),
        ]),
        mainFigureFactory.line({
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
          mainFigureFactory.box({
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
          mainFigureFactory.text({
            text: 'Box 7',
            fill: '#000',
            nextTipHelper: (nextCoordinates: NextCoordinates) =>
              nextCoordinates.middle,
          }),
        ]),
      ],
      mainFigureFactory,
      id
    );

    mainCanvas.addAnimator(animator, false, true);

    const image = mainFigureFactory.image({
      x,
      y: y + 15,
      height: 30,
      width: 30,
      imageLoader: () => getImage('down')!,
      mouseClicked: (figure: Figure) => {
        arrowClick(
          figure,
          animator,
          mainCanvas,
          () => getImage('up')!,
          () => getImage('down')!,
          getExpanded(),
          playButton
        );
      },
      isDispatcher: true,
    });

    mainCanvas.addFigure(image);

    return bubblesToCoordinates;
  },

  publisherBubbles: (
    bubbleCount: number,
    mainCanvas: Main,
    interestGroupCanvas: Main,
    interestGroupFigureFactory: FigureFactory,
    x: number,
    y: number,
    stepping: boolean
  ) => {
    const bubbles = Array.from({ length: bubbleCount }, (_, index) => {
      return interestGroupFigureFactory.circle({
        x: 0,
        y: 0,
        diameter: 10,
        fill: 'orange',
        stroke: 'black',
        shouldTravel: true,
        travelInit: circleTravelInit(
          x + index * 20 + getRandomOffset(20),
          y + getRandomOffset(20)
        ),
      });
    });

    const bubbleFlow = new Group(interestGroupCanvas, bubbles);
    bubbleFlow.setThrow(true);
    bubbleFlow.setSideEffectOnDraw(() => {
      interestGroupCanvas.resetQueuesAndReDrawAll();
      interestGroupCanvas.togglePause(true);
      bubbles.forEach((bubble) => bubble.resetTraveller());

      if (!stepping) {
        mainCanvas.togglePause(false);
      }
    });

    interestGroupCanvas.addGroup(bubbleFlow);
    interestGroupCanvas.togglePause(false);
  },
};

const handleListeners = (
  playButton: HTMLElement,
  interestGroupBubbles: { x: number; y: number }[],
  publisherBubbles: { x: number; y: number }[],
  mainCanvas: Main
) => {
  let isSkipping = false;
  let isStepping = false;

  document.addEventListener('ee:loop', onLoopEvent.bind(null, playButton));

  document.addEventListener('ee:noLoop', onNoLoopEvent.bind(null, playButton));

  document.addEventListener('ee:figureDraw', figureDraw);

  document.addEventListener('ee:stepNext', (event: Event) => {
    const { start } = (event as CustomEvent).detail;

    isStepping = start;
  });

  document.addEventListener('ee:stepBack', (event: Event) => {
    const { start } = (event as CustomEvent).detail;

    isStepping = start;
  });

  document.addEventListener('ee:skipping', (event: Event) => {
    const { isSkipping: skipping } = (event as CustomEvent).detail;

    isSkipping = skipping;
  });

  document.addEventListener('ee:dispatchId', (event: Event) => {
    const { dispatchId } = (event as CustomEvent).detail;

    if (!dispatchId || isSkipping) {
      return;
    }

    const stepping = isStepping;

    if (dispatchId.includes('IG')) {
      const index = dispatchId.split('IG-')[1] - 1;
      mainCanvas.togglePause(true);

      const coordinates = interestGroupBubbles[index];
      draw.interestGroupBubbles(
        5,
        variables.mainCanvas,
        variables.interestGroupCanvas,
        variables.interestGroupFigureFactory,
        coordinates.x,
        coordinates.y,
        stepping
      );
    } else if (dispatchId.includes('P')) {
      const index = dispatchId.split('P-')[1] - 1;
      mainCanvas.togglePause(true);

      const coordinates = publisherBubbles[index];
      draw.publisherBubbles(
        5,
        variables.mainCanvas,
        variables.interestGroupCanvas,
        variables.interestGroupFigureFactory,
        coordinates.x,
        coordinates.y,
        stepping
      );
    }
  });
};

const variables = flow.init();
const { interestGroupBubblesCoordinates, publisherBubblesCoordinates } =
  draw.start(variables);

handleListeners(
  variables.playButton!,
  interestGroupBubblesCoordinates,
  publisherBubblesCoordinates,
  variables.mainCanvas
);
