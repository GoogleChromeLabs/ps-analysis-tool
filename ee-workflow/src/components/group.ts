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
import Main from '../main';
import Figure from './figure';

/**
 * Class for creating a group of figures.
 */
export default class Group {
  /**
   * Figures in the group.
   */
  private figures: Figure[];

  /**
   * Unique id of the group.
   */
  private id: string;

  /**
   * Animator id of the group if it belongs to an animator.
   */
  private animatorId = '';

  /**
   * Canvas runner instance.
   */
  private canvasRunner: Main;

  /**
   * Property to check if the group should be saved in groupSnapshot.
   * If true, the group will NOT be saved in groupSnapshot.
   */
  private throw = false;

  /**
   * Whether the side effect should be run.
   */
  protected runSideEffect?: boolean;

  /**
   * Function to be executed when the animation ends.
   */
  private sideEffectOnEnd: (() => void) | undefined;

  /**
   * Counter for the number of groups created.
   */
  static groupCount = 0;

  constructor(canvasRunner: Main, figures: Figure[], id?: string) {
    Group.groupCount++;
    this.canvasRunner = canvasRunner;
    this.id =
      id ||
      `group-${Group.groupCount}` + Math.random().toString(36).slice(2, 9);
    this.figures = figures;
    this.figures.forEach((figure) => figure.setGroupId(this.id));
  }

  /**
   * Method to draw the group. Calls the draw method of each figure in the group.
   */
  draw() {
    this.figures.forEach((figure) => {
      figure.draw();
    });

    if (this.runSideEffect) {
      this.sideEffectOnEnd?.();
    }
  }

  /**
   * Method to handle hover event. Calls the mouseMoved method of each figure in the group.
   */
  mouseMoved() {
    this.figures.forEach((figure) => {
      figure.mouseMoved();
    });
    this.canvasRunner.addGroup(this, true);
  }

  /**
   * Method to handle leave event. Calls the onLeave method of each figure in the group.
   */
  onLeave() {
    this.figures.forEach((figure) => {
      figure.onLeave();
    });
    this.canvasRunner.addGroup(this, true);
  }

  /**
   * Method to handle click event. Calls the mouseClicked method of each figure in the group.
   */
  mouseClicked() {
    this.figures.forEach((figure) => {
      figure.mouseClicked();
    });
  }

  /**
   * Method to get the id of the group.
   * @returns The id of the group.
   */
  getId() {
    return this.id;
  }

  /**
   * Method to get the animator id of the group.
   * @returns The animator id of the group.
   */
  getAnimatorId() {
    return this.animatorId;
  }

  /**
   * Method to set the animator id to the group and its figures.
   * @param animatorId - The animator id of the group.
   */
  setAnimatorId(animatorId: string) {
    this.animatorId = animatorId;
    this.figures.forEach((figure) => figure.setAnimatorId(animatorId));
  }

  /**
   * Method to get throw property of the group.
   * @returns The throw property of the group.
   */
  getThrow() {
    return this.throw;
  }

  /**
   * Method to set throw property of the group.
   * @param throwFlag - The throw property of the group.
   */
  setThrow(throwFlag: boolean) {
    this.throw = throwFlag;
  }

  /**
   * Method to get the figures in the group.
   * @returns The figures in the group.
   */
  getFigures() {
    return this.figures;
  }

  /**
   * Method to remove a figure from the group.
   * @param figure - The figure to remove from the group.
   */
  removeFigure(figure: Figure) {
    const index = this.figures.indexOf(figure);
    if (index > -1) {
      this.figures.splice(index, 1);
    }
  }

  /**
   * Method to get detail if any figure in the group should travel.
   * @returns boolean indicating if any figure in the group should travel.
   */
  getShouldTravel() {
    return this.figures.some((figure) => figure.getShouldTravel());
  }
}
