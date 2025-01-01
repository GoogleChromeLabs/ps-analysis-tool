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
import Main from '../../main';

/**
 * Abstract class for creating figures.
 * Contains the basic properties and methods that all figures should have.
 */
export default abstract class Figure {
  /**
   * p5 instance.
   */
  protected p5: p5 | null = null;

  /**
   * Unique id of the figure.
   */
  protected id = '';

  /**
   * Group id of the figure if it belongs to a group.
   */
  protected gid = '';

  /**
   * Animator id of the figure if it belongs to an animator.
   */
  protected aid = '';

  /**
   * Previous fill color of the figure to be used when the figure is unhovered.
   */
  protected previousFill = '';

  /**
   * Previous stroke color of the figure to be used when the figure is unhovered.
   */
  protected previousStroke = '';

  /**
   * Property to determine if the object should be added to the snapshot.
   * If true, the object will not be added to the snapshot.
   */
  protected throw = false;

  /**
   * The number of objects created.
   */
  static objectCount = 0;

  /**
   * Constructor for the figure.
   * @param canvasRunner - The canvas runner instance.
   * @param x - The x coordinate of the figure.
   * @param y - The y coordinate of the figure.
   * @param fill - The fill color of the figure.
   * @param stroke - The stroke color of the figure.
   */
  constructor(
    protected canvasRunner: Main,
    protected x: number,
    protected y: number,
    protected fill: string = 'black',
    protected stroke: string = 'black'
  ) {
    Figure.objectCount++;
    this.id =
      `object-${Figure.objectCount}` + Math.random().toString(36).slice(2, 9);
    this.canvasRunner = canvasRunner;
    this.p5 = this.canvasRunner.getP5Instance();
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
  remove() {
    this.canvasRunner.removeFigure(this);
  }

  /**
   * Method to redraw the figure.
   * @param params - The parameters to redraw the figure with.
   */
  abstract reDraw(...params: Array<any>): void;

  /**
   * Get the unique id of the figure.
   * @returns The unique id of the figure.
   */
  getId(): string {
    return this.id;
  }

  /**
   * Get the group id of the figure.
   * @returns The group id of the figure.
   */
  getGid(): string {
    return this.gid;
  }

  /**
   * Set the group id of the figure.
   * @param gid - The group id to set.
   */
  setGid(gid: string) {
    this.gid = gid;
  }

  /**
   * Get the animator id of the figure.
   * @returns The animator id of the
   */
  getAid(): string {
    return this.aid;
  }

  /**
   * Set the animator id of the figure.
   * @param aid - The animator id to set.
   */
  setAid(aid: string) {
    this.aid = aid;
  }

  /**
   * Get the throw flag.
   * @returns true if the figure will NOT be saved in snapshot.
   */
  getThrow(): boolean {
    return this.throw;
  }

  /**
   * Set the throw flag to true.
   * If true, the figure will NOT be saved in snapshot.
   * @param throwFlag - boolean indicating if the figure should be saved in snapshot.
   */
  setThrow(throwFlag: boolean) {
    this.throw = throwFlag;
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
