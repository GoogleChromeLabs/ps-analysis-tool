/*
 * Copyright 2025 Google LLC
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

import { Animator, FigureFactory, Group, Main } from '@google-psat/ee-workflow';
import { scenarios } from '../store/scenarios';

export const initializeCanvas = (
  container: HTMLDivElement,
  parentContainer: HTMLDivElement
) => {
  const componentCanvas = new Main(false, container);
  const flowCanvas = new Main(false, container);
  flowCanvas.togglePause(true);

  const componentFigureFactory = new FigureFactory(componentCanvas, container);
  const flowFigureFactory = new FigureFactory(flowCanvas, container);

  // Create horizontal four components, User, Browser, RP and IDP
  const userComponent = new Group(
    componentCanvas,
    [
      componentFigureFactory.line({
        x: 100,
        y: 50,
        endYwith: 1200,
        stroke: '#999',
      }),
      componentFigureFactory.box({
        width: 100,
        height: 50,
        fill: '#f0f0f0',
        stroke: '#999',
        nextTipHelper: (nextCoordinates) => {
          return {
            x: nextCoordinates.up.x - 50,
            y: nextCoordinates.up.y - 25,
          };
        },
      }),
      componentFigureFactory.text({
        text: 'User',
        nextTipHelper: (nextCoordinates) => {
          return {
            x: nextCoordinates.middle.x,
            y: nextCoordinates.middle.y,
          };
        },
      }),
    ],
    'user-entity'
  );

  const browserComponent = new Group(
    componentCanvas,
    [
      componentFigureFactory.line({
        x: 300,
        y: 50,
        endYwith: 1200,
        stroke: '#999',
      }),
      componentFigureFactory.box({
        width: 100,
        height: 50,
        fill: '#f0f0f0',
        stroke: '#999',
        nextTipHelper: (nextCoordinates) => {
          return {
            x: nextCoordinates.up.x - 50,
            y: nextCoordinates.up.y - 25,
          };
        },
      }),
      componentFigureFactory.text({
        text: 'Browser',
        nextTipHelper: (nextCoordinates) => {
          return {
            x: nextCoordinates.middle.x,
            y: nextCoordinates.middle.y,
          };
        },
      }),
    ],
    'browser-entity'
  );

  const rpComponent = new Group(
    componentCanvas,
    [
      componentFigureFactory.line({
        x: 500,
        y: 50,
        endYwith: 1200,
        stroke: '#999',
      }),
      componentFigureFactory.box({
        width: 100,
        height: 50,
        fill: '#f0f0f0',
        stroke: '#999',
        nextTipHelper: (nextCoordinates) => {
          return {
            x: nextCoordinates.up.x - 50,
            y: nextCoordinates.up.y - 25,
          };
        },
      }),
      componentFigureFactory.text({
        text: 'RP',
        nextTipHelper: (nextCoordinates) => {
          return {
            x: nextCoordinates.middle.x,
            y: nextCoordinates.middle.y,
          };
        },
      }),
    ],
    'rp-entity'
  );

  const idpComponent = new Group(
    componentCanvas,
    [
      componentFigureFactory.line({
        x: 700,
        y: 50,
        endYwith: 1200,
        stroke: '#999',
      }),
      componentFigureFactory.box({
        width: 100,
        height: 50,
        fill: '#f0f0f0',
        stroke: '#999',
        nextTipHelper: (nextCoordinates) => {
          return {
            x: nextCoordinates.up.x - 50,
            y: nextCoordinates.up.y - 25,
          };
        },
      }),
      componentFigureFactory.text({
        text: 'IDP',
        nextTipHelper: (nextCoordinates) => {
          return {
            x: nextCoordinates.middle.x,
            y: nextCoordinates.middle.y,
          };
        },
      }),
    ],
    'idp-entity'
  );

  componentCanvas.addGroup(userComponent, true);
  componentCanvas.addGroup(browserComponent, true);
  componentCanvas.addGroup(rpComponent, true);
  componentCanvas.addGroup(idpComponent, true);

  let currentYToDraw = 130;

  const createArrowWithLabel = (
    from: Group,
    to: Group,
    label: string,
    selfMessage: boolean,
    id: string
  ) => {
    const _currentYToDraw = currentYToDraw;
    const sideEffect = () => {
      if (_currentYToDraw + 250 > parentContainer.clientHeight) {
        parentContainer.scrollTo({
          top: _currentYToDraw - parentContainer.clientHeight + 150,
          behavior: 'smooth',
        });
      }
    };

    if (selfMessage) {
      const fromLineX = from.getFigures()[2].getX();

      const group = new Group(flowCanvas, [
        flowFigureFactory.text({
          text: label,
          x: fromLineX + 25,
          y: currentYToDraw,
          id,
          isDispatcher: true,
        }),
        flowFigureFactory.line({
          x: fromLineX,
          y: currentYToDraw + 15,
          endX: fromLineX + 50,
          endY: currentYToDraw + 15,
          shouldTravel: true,
        }),
        flowFigureFactory.line({
          endYwith: 50,
          nextTipHelper: (nextCoordinates) => {
            return {
              x: nextCoordinates.right.x,
              y: nextCoordinates.right.y,
            };
          },
          shouldTravel: true,
        }),
        flowFigureFactory.line({
          endXwith: -50,
          nextTipHelper: (nextCoordinates) => {
            return {
              x: nextCoordinates.down.x,
              y: nextCoordinates.down.y,
            };
          },
          hasArrow: true,
          shouldTravel: true,
        }),
      ]);

      group.setSideEffectOnDraw(sideEffect);

      currentYToDraw += 100;

      return group;
    }

    const fromLineX = from.getFigures()[2].getX();
    const toLineX = to.getFigures()[2].getX();

    const arrow = flowFigureFactory.line({
      x: fromLineX,
      y: currentYToDraw + 15,
      endX: toLineX,
      hasArrow: true,
      shouldTravel: true,
    });

    const group = new Group(flowCanvas, [
      flowFigureFactory.text({
        text: label,
        x: (fromLineX + toLineX) / 2,
        y: currentYToDraw,
        id,
        isDispatcher: true,
      }),
      arrow,
    ]);

    group.setSideEffectOnDraw(sideEffect);

    currentYToDraw += 50;

    return group;
  };

  Object.entries(scenarios).forEach(([key, { steps }]) => {
    const animatorFigures: Group[] = [];

    steps.forEach((step, index) => {
      const actionData = step.action?.();

      if (!actionData) {
        return;
      }

      const { addMessage } = actionData;

      if (addMessage) {
        const [from, to, label, selfMessage] = addMessage;

        const groupFinder = (groupId: string) => {
          switch (groupId) {
            case 'user-entity':
              return userComponent;
            case 'browser-entity':
              return browserComponent;
            case 'rp-entity':
              return rpComponent;
            case 'idp-entity':
              return idpComponent;
            default:
              return userComponent;
          }
        };

        const fromGroup = groupFinder(from as string);
        const toGroup = groupFinder(to as string);

        animatorFigures.push(
          createArrowWithLabel(
            fromGroup,
            toGroup,
            label as string,
            selfMessage as boolean,
            key + '-' + index
          )
        );
      }
    });

    const animator = new Animator(animatorFigures, flowFigureFactory);
    flowCanvas.addAnimator(animator, false, true);

    currentYToDraw = 130;
  });

  return flowCanvas;
};
