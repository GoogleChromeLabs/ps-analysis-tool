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
/**
 * External dependencies.
 */
import {
  Animator,
  FigureFactory,
  Group,
  Main,
  type NextCoordinates,
} from '@google-psat/ee-workflow';

/**
 * Internal dependencies.
 */
import { scenarios } from '../store/scenarios';

const helpers = {
  createEntity: (
    id: string,
    componentName: string,
    x: number,
    y: number,
    canvas: Main,
    figureFactory: FigureFactory
  ) => {
    const figureConfig = {
      line: {
        x,
        y,
        endYwith: 1400,
        stroke: '#A9A9A9',
      },
      box: {
        width: 80,
        height: 40,
        fill: '#f0f0f0',
        stroke: '#999',
        nextTipHelper: (nextCoordinates: NextCoordinates) => {
          return {
            x: nextCoordinates.up.x - 40,
            y: nextCoordinates.up.y - 20,
          };
        },
      },
      text: {
        text: componentName,
        fill: '#212121',
        size: 14,
        nextTipHelper: (nextCoordinates: NextCoordinates) => {
          return {
            x: nextCoordinates.middle.x,
            y: nextCoordinates.middle.y,
          };
        },
      },
    };

    const figures = [
      figureFactory.line(figureConfig.line),
      figureFactory.box(figureConfig.box),
      figureFactory.text(figureConfig.text),
    ];

    const group = new Group(canvas, figures, id);
    canvas.addGroup(group, true);

    return group;
  },

  createArrowWithLabel: (
    from: Group,
    to: Group,
    label: string,
    selfMessage: boolean,
    id: string,
    setCoordinates: (id: string, x: number, y: number) => void,
    currentYToDraw: number,
    canvas: Main,
    figureFactory: FigureFactory
  ) => {
    if (selfMessage) {
      const fromLineX = from.getFigures()[2].getX();

      setCoordinates(id, fromLineX + 25, currentYToDraw + 50);

      const group = new Group(canvas, [
        figureFactory.text({
          text: label,
          fill: '#292929',
          size: 14,
          x: fromLineX + 25,
          y: currentYToDraw,
          id,
          isDispatcher: true,
        }),
        figureFactory.line({
          x: fromLineX,
          y: currentYToDraw + 15,
          endX: fromLineX + 50,
          endY: currentYToDraw + 15,
          shouldTravel: true,
        }),
        figureFactory.line({
          endYwith: 50,
          nextTipHelper: (nextCoordinates) => {
            return {
              x: nextCoordinates.right.x,
              y: nextCoordinates.right.y,
            };
          },
          shouldTravel: true,
        }),
        figureFactory.line({
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

      return group;
    }

    const fromLineX = from.getFigures()[2].getX();
    const toLineX = to.getFigures()[2].getX();

    setCoordinates(id, (fromLineX + toLineX) / 2, currentYToDraw);

    const group = new Group(canvas, [
      figureFactory.text({
        text: label,
        fill: '#292929',
        size: 14,
        x: (fromLineX + toLineX) / 2,
        y: currentYToDraw,
        id,
        isDispatcher: true,
      }),
      figureFactory.line({
        x: fromLineX,
        y: currentYToDraw + 15,
        endX: toLineX,
        hasArrow: true,
        shouldTravel: true,
      }),
    ]);

    return group;
  },

  processScenarios: (
    canvas: Main,
    figureFactory: FigureFactory,
    userComponent: Group,
    browserComponent: Group,
    rpComponent: Group,
    idpComponent: Group,
    setCoordinates: (id: string, x: number, y: number) => void
  ) => {
    let currentYToDraw = 20;

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
            helpers.createArrowWithLabel(
              fromGroup,
              toGroup,
              label as string,
              selfMessage as boolean,
              key + '-' + index,
              setCoordinates,
              currentYToDraw,
              canvas,
              figureFactory
            )
          );

          currentYToDraw += selfMessage ? 100 : 50;
        }
      });

      const animator = new Animator(animatorFigures, figureFactory, key);
      canvas.addAnimator(animator, false, true);

      currentYToDraw = 20;
    });
  },
};

export const initializeCanvas = (
  componentContainer: HTMLDivElement,
  flowContainer: HTMLDivElement,
  setCoordinates: (id: string, x: number, y: number) => void,
  idToStartWith?: string
) => {
  const componentCanvas = new Main(false, componentContainer);
  const flowCanvas = new Main(
    false,
    flowContainer,
    undefined,
    undefined,
    idToStartWith,
    undefined,
    true
  );

  const componentFigureFactory = new FigureFactory(
    componentCanvas,
    componentContainer
  );
  const flowFigureFactory = new FigureFactory(flowCanvas, flowContainer);

  const userCompoent = helpers.createEntity(
    'user-entity',
    'User',
    100,
    50,
    componentCanvas,
    componentFigureFactory
  );
  const browserComponent = helpers.createEntity(
    'browser-entity',
    'Browser',
    300,
    50,
    componentCanvas,
    componentFigureFactory
  );
  const rpComponent = helpers.createEntity(
    'rp-entity',
    'RP',
    500,
    50,
    componentCanvas,
    componentFigureFactory
  );
  const idpComponent = helpers.createEntity(
    'idp-entity',
    'IDP',
    700,
    50,
    componentCanvas,
    componentFigureFactory
  );

  helpers.processScenarios(
    flowCanvas,
    flowFigureFactory,
    userCompoent,
    browserComponent,
    rpComponent,
    idpComponent,
    setCoordinates
  );

  return flowCanvas;
};
