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
import main from '../../main';

/**
 * Abstract class for creating figures.
 * Contains the basic properties and methods that all figures should have.
 */
export default abstract class Figure {
  /**
   * p5 instance.
   */
  p5: p5 | null = null;

  /**
   * Unique id of the figure.
   */
  id = '';

  /**
   * Group id of the figure if it belongs to a group.
   */
  gid = '';

  /**
   * Animator id of the figure if it belongs to an animator.
   */
  aid = '';

  /**
   * x coordinate of the figure.
   */
  x = 0;

  /**
   * y coordinate of the figure.
   */
  y = 0;

  /**
   * Fill color of the figure.
   */
  fill = 'black';

  /**
   * Stroke color of the figure.
   */
  stroke = 'black';

  /**
   * Previous fill color of the figure to be used when the figure is unhovered.
   */
  previousFill = '';

  /**
   * Previous stroke color of the figure to be used when the figure is unhovered.
   */
  previousStroke = '';

  /**
   * Property to determine if the object should be added to the snapshot.
   * If true, the object will not be added to the snapshot.
   */
  throw?: boolean;

  /**
   * The number of objects created.
   */
  static objectCount = 0;

  constructor(x: number, y: number, fill?: string, stroke?: string) {
    Figure.objectCount++;
    this.id =
      `object-${Figure.objectCount}` + Math.random().toString(36).slice(2, 9);
    this.p5 = main.getP5Instance();
    this.x = x;
    this.y = y;
    this.fill = fill || 'black';
    this.stroke = stroke || 'black';
    this.previousFill = this.fill;
    this.previousStroke = this.stroke;
  }

  /**
   * Method to draw the figure.
   */
  abstract draw(): void;

  /**
   * Method to handle the hover event.
   */
  abstract onHover(): void;

  /**
   * Method to handle the leave event.
   */
  abstract onLeave(): void;

  /**
   * Method to handle the click event.
   */
  abstract onClick(): void;

  /**
   * Method to check if the figure is being hovered.
   */
  abstract isHovering(): boolean;

  /**
   * Method to remove the figure.
   */
  abstract remove(): void;

  /**
   * Method to redraw the figure.
   * @param params - The parameters to redraw the figure with.
   */
  abstract reDraw(...params: Array<any>): void;

  /**
   * Set the group id of the figure.
   * @param gid - The group id to set.
   */
  setGid(gid: string) {
    this.gid = gid;
  }

  /**
   * Set the animator id of the figure.
   * @param aid - The animator id to set.
   */
  setAid(aid: string) {
    this.aid = aid;
  }

  /**
   * Save the previous fill and stroke colors.
   */
  savePreviousColors() {
    if (this.previousFill === this.fill) {
      this.previousFill = this.fill;
    }

    if (this.previousStroke === this.stroke) {
      this.previousStroke = this.stroke;
    }
  }

  /**
   * Reapply the previous fill and stroke colors.
   */
  reApplyPreviousColors() {
    this.fill = this.previousFill;
    this.previousFill = this.fill;
    this.stroke = this.previousStroke;
    this.previousStroke = this.stroke;
  }
}
