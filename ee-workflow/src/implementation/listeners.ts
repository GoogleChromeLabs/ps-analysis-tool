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
import { Animator, FigureFactory } from '../components';
import Figure from '../components/figure';
import Main from '../main';

export const figureDraw = (e: Event) => {
  const detail = (e as CustomEvent).detail;

  if (detail?.figureId) {
    // eslint-disable-next-line no-console
    console.log('Figure ID:', detail.figureId);
    localStorage.setItem('ee-workflow', detail.figureId);
  }
};

export const prevButtonClick = (wasExpanded: boolean, mainCanvas: Main) => {
  if (wasExpanded) {
    return;
  }

  mainCanvas.loadPreviousCheckpoint();
};

export const stepPrevButtonClick = (wasExpanded: boolean, mainCanvas: Main) => {
  if (wasExpanded) {
    return;
  }

  mainCanvas.stepBack();
};

export const arrowClick = (
  figure: Figure,
  animator: Animator,
  wasExpanded: boolean,
  mainCanvas: Main,
  upArrowImage: p5.Image | null,
  downArrowImage: p5.Image | null,
  expandedAnimator: Animator | null,
  expandedImage: Figure | null
) => {
  if (!wasExpanded) {
    if (mainCanvas.isPaused()) {
      mainCanvas.togglePause();
    }

    playClick(
      wasExpanded,
      mainCanvas,
      null,
      expandedImage,
      expandedAnimator,
      upArrowImage,
      downArrowImage
    );
    wasExpanded = true;
  }

  const _image = <ReturnType<FigureFactory['image']>>figure;

  if (expandedAnimator?.getId() === animator.getId()) {
    _image.reDraw(undefined, undefined, () => downArrowImage!);
    mainCanvas.loadSnapshotAndReDraw();
    expandedAnimator = null;
    expandedImage = null;
  } else {
    _image.reDraw(undefined, undefined, () => upArrowImage!);
    expandedImage?.reDraw(undefined, undefined, () => downArrowImage!);
    expandedImage = _image;
    expandedAnimator = animator;
    mainCanvas.loadSnapshotAndReDraw(animator.getId(), { x: 0, y: 30 });
  }
};

export const playClick = (
  wasExpanded: boolean,
  mainCanvas: Main,
  playButton: HTMLElement | null,
  expandedImage: Figure | null,
  expandedAnimator: Animator | null,
  upArrowImage: p5.Image | null,
  downArrowImage: p5.Image | null
) => {
  if (wasExpanded) {
    if (expandedImage && expandedAnimator) {
      arrowClick(
        expandedImage,
        expandedAnimator,
        wasExpanded,
        mainCanvas,
        upArrowImage,
        downArrowImage,
        expandedAnimator,
        expandedImage
      );
    }
    wasExpanded = false;

    mainCanvas.loadPreviousCheckpoint();
    mainCanvas.togglePause();
  }

  mainCanvas.togglePause();

  if (playButton) {
    if (mainCanvas.isPaused()) {
      playButton.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M320-203v-560l440 280-440 280Zm60-280Zm0 171 269-171-269-171v342Z"/></svg>';
    } else {
      playButton.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M525-200v-560h235v560H525Zm-325 0v-560h235v560H200Zm385-60h115v-440H585v440Zm-325 0h115v-440H260v440Zm0-440v440-440Zm325 0v440-440Z"/></svg>';
    }
  }
};

export const onLoopEvent = (playButton: HTMLElement | null) => {
  if (playButton) {
    playButton.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M525-200v-560h235v560H525Zm-325 0v-560h235v560H200Zm385-60h115v-440H585v440Zm-325 0h115v-440H260v440Zm0-440v440-440Zm325 0v440-440Z"/></svg>';
  }
};

export const onNoLoopEvent = (playButton: HTMLElement | null) => {
  if (playButton) {
    playButton.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M320-203v-560l440 280-440 280Zm60-280Zm0 171 269-171-269-171v342Z"/></svg>';
  }
};

export const stepNextButtonClick = (wasExpanded: boolean, mainCanvas: Main) => {
  if (wasExpanded) {
    return;
  }

  mainCanvas.stepNext();
};

export const nextButtonClick = (wasExpanded: boolean, mainCanvas: Main) => {
  if (wasExpanded) {
    return;
  }

  mainCanvas.loadNextCheckpoint();
};

export const resetButtonClick = (
  wasExpanded: boolean,
  mainCanvas: Main,
  playButton: HTMLElement | null,
  expandedImage: Figure | null,
  expandedAnimator: Animator | null,
  upArrowImage: p5.Image | null,
  downArrowImage: p5.Image | null
) => {
  if (wasExpanded) {
    playClick(
      wasExpanded,
      mainCanvas,
      playButton,
      expandedImage,
      expandedAnimator,
      upArrowImage,
      downArrowImage
    );
  }

  mainCanvas.reset();
};

export const speedSliderChange = (mainCanvas: Main, e: Event) => {
  const target = e.target as HTMLInputElement;
  const value = parseFloat(target.value);

  if (mainCanvas) {
    mainCanvas.updateSpeed(value);
  }
};
