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
  protected groupId = '';

  /**
   * Animator id of the figure if it belongs to an animator.
   */
  protected animatorId = '';

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
   * Property to determine if the object should travel.
   * If true, the object will travel to the end coordinates.
   */
  protected shouldTravel = false;

  /**
   * Function to be executed when the object has to travel.
   */
  protected traveller?: (figure: Figure, speed: number) => boolean;

  /**
   * Function to be executed when the object has to reset travel.
   */
  protected resetTravel?: (figure: Figure) => void;

  /**
   * Function to complete the travel of the object to the end coordinates at once.
   */
  protected completeTravel?: (figure: Figure, skipDraw: boolean) => void;

  /**
   * Whether the side effect should be run.
   */
  protected runSideEffect?: boolean;

  /**
   * Function to be executed when the object has done drawing.
   */
  protected sideEffectOnDraw?: (figure: Figure) => void;

  /**
   * Whether the figure is a checkpoint.
   */
  protected isCheckpoint = false;

  /**
   * The number of objects created.
   */
  static objectCount = 0;

  /**
   * Constructor for the figure.
   * @param canvasRunner - The canvas runner instance.
   * @param x - The x coordinate of the figure.
   * @param y - The y coordinate of the figure.
   * @param id - The unique id of the figure.
   * @param fill - The fill color of the figure.
   * @param stroke - The stroke color of the figure.
   * @param tags - The tags of the figure for bucketing.
   * @param mouseClickedHandler - The function to be executed when the figure is clicked.
   * @param mouseMovedHandler - The function to be executed when the figure is hovered.
   * @param onLeaveHandler - The function to be executed when the figure is unhovered.
   */
  constructor(
    protected canvasRunner: Main,
    protected x: number,
    protected y: number,
    id?: string,
    protected fill: string = 'black',
    protected stroke: string = 'black',
    protected tags: string[] = [],
    public mouseClickedHandler?: (figure: Figure) => void,
    public mouseMovedHandler?: (figure: Figure) => void,
    public onLeaveHandler?: (figure: Figure) => void
  ) {
    Figure.objectCount++;
    this.id = id || `object-${Figure.objectCount}`;
    this.canvasRunner = canvasRunner;
    this.p5 = this.canvasRunner.getP5Instance();
    this.previousFill = this.fill;
    this.previousStroke = this.stroke;
    this.mouseClickedHandler = mouseClickedHandler;
    this.mouseMovedHandler = mouseMovedHandler;
    this.onLeaveHandler = onLeaveHandler;
    this.runSideEffect = true;
  }

  /**
   * Method to draw the figure.
   */
  abstract draw(): void;

  /**
   * Method to check if the figure is being hovered.
   */
  abstract isHovering(): boolean;

  /**
   * Method to redraw the figure.
   * @param params - The parameters to redraw the figure with.
   */
  abstract reDraw(...params: Array<any>): void;

  getP5(): p5 | null {
    return this.p5;
  }

  getX(): number {
    return this.x;
  }

  getY(): number {
    return this.y;
  }

  /**
   * Method to remove the figure.
   */
  remove() {
    this.canvasRunner.removeFigure(this);
  }

  /**
   * Method to get whether the figure have traveller function.
   * @returns boolean indicating if the figure have traveller function.
   */
  getCanTravel(): boolean {
    return this.traveller !== undefined;
  }

  /**
   * Method to get the shouldTravel property.
   * @returns boolean indicating if the figure should travel.
   */
  getShouldTravel(): boolean {
    return this.shouldTravel;
  }

  /**
   * Method to set shouldTravel property.
   * @param shouldTravel - boolean indicating if the figure should travel.
   */
  setShouldTravel(shouldTravel: boolean) {
    this.shouldTravel = shouldTravel;
  }

  /**
   * Method to run the traveller function.
   * @param speed - The speed at which the object should travel.
   * @returns boolean indicating if the traveller function was executed
   */
  runTraveller(speed: number): boolean {
    if (this.traveller) {
      return this.traveller(this, speed);
    }

    return true;
  }

  /**
   * Method to call the reset traveller function.
   */
  resetTraveller() {
    if (this.resetTravel) {
      this.resetTravel(this);
      this.shouldTravel = true;
    }
  }

  /**
   * Method to call the complete traveller function.
   * @param skipDraw - boolean indicating if the draw function should be skipped
   */
  completeTraveller(skipDraw = false) {
    if (this.completeTravel) {
      this.completeTravel(this, skipDraw);
    }
  }

  /**
   * Method to set the traveller function.
   * @param traveller - The traveller function to set.
   */
  setTraveller(traveller: (figure: Figure, speed: number) => boolean) {
    this.traveller = traveller;
  }

  /**
   * Method to set the reset traveller function.
   * @param resetTravel - The reset traveller function to set.
   */
  setResetTravel(resetTravel: (figure: Figure) => void) {
    this.resetTravel = resetTravel;
  }

  /**
   * Method to set the complete traveller function.
   * @param completeTravel - The complete traveller function to set.
   */
  setCompleteTravel(
    completeTravel: (figure: Figure, skipDraw: boolean) => void
  ) {
    this.completeTravel = completeTravel;
  }

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
  getGroupId(): string {
    return this.groupId;
  }

  /**
   * Set the group id of the figure.
   * @param groupId - The group id to set.
   */
  setGroupId(groupId: string) {
    this.groupId = groupId;
  }

  /**
   * Get the animator id of the figure.
   * @returns The animator id of the
   */
  getAnimatorId(): string {
    return this.animatorId;
  }

  /**
   * Set the animator id of the figure.
   * @param animatorId - The animator id to set.
   */
  setAnimatorId(animatorId: string) {
    this.animatorId = animatorId;
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
   * Get the tags of the figure.
   * @returns The tags of the figure.
   */
  getTags(): string[] {
    return this.tags;
  }

  /**
   * Set the tags of the figure.
   * @param tags - The tags to set.
   */
  setTags(tags: string[]) {
    this.tags = tags;
  }

  /**
   * Add a tag to the figure.
   * @param tag - The tag to add.
   */
  addTag(tag: string) {
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
    }
  }

  /**
   * Remove a tag from the figure.
   * @param tag - The tag to remove.
   */
  removeTag(tag: string) {
    this.tags = this.tags.filter((t) => t !== tag);
  }

  /**
   * Set the figure as a checkpoint.
   * @param isCheckpoint - boolean indicating if the figure is a checkpoint.
   */
  setCheckpoint(isCheckpoint: boolean) {
    this.isCheckpoint = isCheckpoint;
  }

  /**
   * Get whether the figure is a checkpoint.
   * @returns - boolean indicating if the figure is a checkpoint.
   */
  getIsCheckpoint() {
    return this.isCheckpoint;
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

  /**
   * Method to handle mouseClicked event.
   */
  mouseClicked() {
    this.mouseClickedHandler?.(this);
  }

  /**
   * Method to handle mouseMoved event.
   */
  mouseMoved() {
    this.mouseMovedHandler?.(this);
  }

  /**
   * Method to handle onLeave event.
   */
  onLeave() {
    this.onLeaveHandler?.(this);
  }

  /**
   * Method to handle mouseMoved event.
   * @param mouseClicked - The function to be executed when the figure is clicked.
   */
  setMouseClicked(mouseClicked: (figure: Figure) => void) {
    this.mouseClickedHandler = mouseClicked;
  }

  /**
   * Method to handle mouseMoved event.
   * @param mouseMoved - The function to be executed when the figure is hovered.
   */
  setMouseMoved(mouseMoved: (figure: Figure) => void) {
    this.mouseMovedHandler = mouseMoved;
  }

  /**
   * Method to handle onLeave event.
   * @param onLeave - The function to be executed when the figure is unhovered.
   */
  setOnLeave(onLeave: (figure: Figure) => void) {
    this.onLeaveHandler = onLeave;
  }

  /**
   * Set the x coordinate of the figure.
   * @param x - The x coordinate to set.
   */
  setX(x: number) {
    this.x = x;
  }

  /**
   * Set the y coordinate of the figure.
   * @param y - The y coordinate to set.
   */
  setY(y: number) {
    this.y = y;
  }

  /**
   * Set whether the side effect should be run.
   * @param runSideEffect - boolean indicating if the side effect should be run.
   */
  shouldRunSideEffect(runSideEffect: boolean) {
    this.runSideEffect = runSideEffect;
  }

  /**
   * Set the function to be executed when the object has done drawing.
   * @param sideEffectOnDraw - The function to be executed when the object has done drawing.
   */
  setSideEffectOnDraw(sideEffectOnDraw: (figure: Figure) => void) {
    this.sideEffectOnDraw = sideEffectOnDraw;
  }
}
