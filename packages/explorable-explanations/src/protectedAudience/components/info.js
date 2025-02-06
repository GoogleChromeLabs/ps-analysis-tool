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
import { addCanvasEventListener, isInsideBox } from '../utils';
import config from '../config';
import app from '../app';

const Info = ({ iconX, iconY, title, info, description }) => {
  const {
    timeline: { infoIconSize },
  } = config;
  const p = app.p;

  app.timeline.infoIconsPositions.push({ x: iconX, y: iconY });

  p.image(p.infoIcon, iconX, iconY, infoIconSize, infoIconSize);

  const mouseClickedCallback = (mouseX, mouseY) => {
    if (isInsideBox(mouseX, mouseY, iconX, iconY, infoIconSize)) {
      app.setInfo({
        title,
        description,
        info,
        key: Date.now(), // To force change the state, so that the info modal is shown in case of same value.
      });
    }
  };

  const key = title + description + iconX + iconY;
  addCanvasEventListener('mouseClicked', mouseClickedCallback, key);
};

export default Info;
