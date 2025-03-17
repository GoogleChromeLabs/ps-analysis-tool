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
import p5 from 'p5';
import { config } from '../config';

type CircleProps = {
  p: p5;
  position: { x: number; y: number };
  visited: boolean;
  completedIcon: p5.Image;
  diameter: number;
};

export const Circle = ({
  p,
  position,
  visited,
  completedIcon,
  diameter,
}: CircleProps) => {
  p.push();

  if (visited) {
    p.stroke('#1A73E8');
  }

  p.circle(position.x, position.y, diameter);

  if (visited && completedIcon) {
    const user = config.timeline.user;

    p.image(
      completedIcon,
      position.x - user.width / 2,
      position.y - user.height / 2,
      user.width,
      user.height
    );
  }

  p.pop();
};
