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
import Figure from './figure';
import Group from './group';

export default class Traveller {
  /**
   * Object to be drawn. Can be a figure or a group.
   */
  private object: Figure | Group | null = null;

  /**
   * Array to store the ids of the group objects that have completed travelling.
   */
  private groupObjectsCompleted: string[] = [];

  constructor(object: Figure | Group) {
    this.object = object;
  }

  /**
   * Function to manage the drawing of a group with travelling figures.
   * @returns boolean indicating if the group has completed travelling.
   */
  private drawGroup() {
    const object = <Group>this.object;

    const nonTravellingFigures = object
      .getFigures()
      .filter((figure) => figure.getShouldTravel() === false);

    const travellingFigures = object
      .getFigures()
      .filter((figure) => figure.getShouldTravel() === true);

    nonTravellingFigures.forEach((figure) => figure.draw());

    travellingFigures.forEach((figure) => {
      if (this.groupObjectsCompleted.includes(figure.getId())) {
        return;
      }

      if (figure.runTraveller()) {
        this.groupObjectsCompleted.push(figure.getId());
        figure.setShouldTravel(false);
      }
    });

    if (this.groupObjectsCompleted.length !== travellingFigures.length) {
      return false;
    }

    return true;
  }

  /**
   * Function to draw the object.
   * @returns boolean indicating if the object has completed travelling.
   */
  draw() {
    if (!this.object) {
      return true;
    }

    if (this.object instanceof Group) {
      return this.drawGroup();
    } else if (this.object.runTraveller()) {
      this.object.setShouldTravel(false);
      return true;
    }

    return false;
  }

  /**
   * Function to get the object.
   * @returns The object to be drawn.
   */
  getObject() {
    return this.object;
  }
}
