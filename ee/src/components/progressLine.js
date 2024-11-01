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
import config from '../config';
import app from '../app';
import utils from '../modules/utils';

const ProgressLine = ({ x1, y1, x2, y2, direction = 'right', text = '' }) => {
  const arrowSize = 10;
  const width = config.flow.lineWidth - arrowSize;
  const height = config.flow.lineHeight - arrowSize;
  const incrementBy = 1;
  const p = app.p;

  let _x2 = x1; // For horizontal directions
  let _y2 = y1; // For vertical direction
  let __x2 = x2;

  return new Promise((resolve) => {
    app.flow.intervals['progressline'] = setInterval(() => {
      // Check the direction and adjust the respective coordinate
      if (direction === 'right') {
        _x2 = _x2 + incrementBy;

        // Check if the line has reached the target length for horizontal direction
        if (_x2 - x1 > width) {
          clearInterval(app.flow.intervals['progressline']);
          resolve(); // Resolve the promise once the interval is cleared
        }

        // Draw the progressing line horizontally
        p.line(x1, y1, _x2, y2);

        // Draw the arrow in the correct direction
        utils.drawArrow(arrowSize, _x2, y1, direction); // Draw new arrow
      } else if (direction === 'left') {
        __x2 = __x2 - incrementBy;
        const margin = 10;

        if (x2 - __x2 > width) {
          clearInterval(app.flow.intervals['progressline']);

          if (text) {
            p.push();
            p.strokeWeight(0.1);
            p.textSize(config.canvas.fontSize - 2);
            p.textFont('ui-sans-serif');
            p.text(text, __x2 + width / 2, y1 + height / 2);
            p.pop();
          }

          resolve(); // Resolve the promise once the interval is cleared
        }

        // Draw the progressing line horizontally (left direction)
        p.line(x2, y2 + margin, __x2, y1 + margin);

        // Draw the arrow in the correct direction
        utils.drawArrow(arrowSize, __x2, y1 + 4, direction); // Draw new arrow
      } else if (direction === 'down') {
        _y2 = _y2 + incrementBy;

        // Check if the line has reached the target length for vertical direction
        if (_y2 - y1 > height) {
          clearInterval(app.flow.intervals['progressline']);

          if (text) {
            p.push();
            p.strokeWeight(0.1);
            p.textSize(config.canvas.fontSize - 2);
            p.textFont('ui-sans-serif');
            p.text(
              text,
              x1 - (text.startsWith('$') ? 10 : width / 2),
              y1 + height / 2
            );
            p.pop();
          }
          resolve(); // Resolve the promise once the interval is cleared
        }

        // Draw the progressing line vertically
        p.line(x1, y1, x2, _y2);

        // Draw the arrow in the correct direction
        utils.drawArrow(arrowSize, x1, _y2, direction); // Draw new arrow
      } else if (direction === 'up') {
        _y2 = _y2 - incrementBy;
        // Check if the line has reached the target length for vertical direction
        if (y1 - _y2 > height) {
          clearInterval(app.flow.intervals['progressline']);

          if (text) {
            p.push();
            p.strokeWeight(0.1);
            p.textSize(config.canvas.fontSize - 2);
            p.textFont('ui-sans-serif');
            p.text(
              text,
              x1 + (text.startsWith('$') ? 10 : width / 2),
              y1 - height / 2
            );
            p.pop();
          }

          resolve(); // Resolve the promise once the interval is cleared
        }

        // Draw the progressing line vertically
        p.line(x1, y1, x2, _y2);

        // Draw the arrow in the correct direction
        utils.drawArrow(arrowSize, x1, _y2, direction); // Draw new arrow
      }
    }, 10);
  });
};

export default ProgressLine;
