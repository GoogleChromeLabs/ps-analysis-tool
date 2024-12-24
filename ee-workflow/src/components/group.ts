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

import Figure from './figure';

export default class Group {
  figures: Figure[];
  id: string;
  aid = '';
  throw = false;

  static groupCount = 0;

  constructor(figures: Figure[]) {
    Group.groupCount++;
    this.id =
      `group-${Group.groupCount}` + Math.random().toString(36).slice(2, 9);
    this.figures = figures;
    this.figures.forEach((figure) => figure.setGid(this.id));
  }

  draw() {
    this.figures.forEach((figure) => {
      figure.draw();
    });
  }

  onHover() {
    this.figures.forEach((figure) => {
      figure.onHover();
    });
  }

  onLeave() {
    this.figures.forEach((figure) => {
      figure.onLeave();
    });
  }

  onClick() {
    this.figures.forEach((figure) => {
      figure.onClick();
    });
  }

  setAid(aid: string) {
    this.aid = aid;
    this.figures.forEach((figure) => figure.setAid(aid));
  }
}
