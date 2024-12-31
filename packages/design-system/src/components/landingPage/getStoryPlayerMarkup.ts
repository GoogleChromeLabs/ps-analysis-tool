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
interface GetStoryPlayerMarkupProps {
  independentStory: string;
}
export const getStoryPlayerMarkup = ({
  independentStory,
}: GetStoryPlayerMarkupProps) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <script async src="${chrome?.runtime?.getURL(
              'assets/amp/custom-scripts/single-player-main.js'
            )}" type="module"></script>
            <script async src="${chrome?.runtime?.getURL(
              'assets/amp/amp-story-player-v0.js'
            )}"></script>
            <link href="https://cdn.ampproject.org/amp-story-player-v0.css" rel="stylesheet" type="text/css">
            <style>
                .lightbox {
                    z-index: 2;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    position: fixed;
                    overflow: hidden;
                    visibility: visible;
                    opacity: 1;
                    transform: translate3d(0, 0, 0) scale3d(1, 1, 1);
                    transition: transform 0.33s, opacity 0.33s, visibility 0.33s;
                }

                .lightbox.closed {
                    transform: scale3d(0.5, 0.5, 1) !important;
                    opacity: 0;
                    visibility: hidden;
                    z-index: -1;
                    transition: transform 0.2s, opacity 0.2s, visibility 0.2s;
                    pointer-events: none;
                }

                body.lightbox-open:before {
                    opacity: 1;
                    visibility: visible;
                }

                amp-story-player.my-player {
                    width: 100%;
                    height: 100%;
                }
            </style>
        </head>
        <body>
            <div class="lightbox closed">
            <amp-story-player class="my-player">
                <script type="application/json">
                    {
                        "behavior": {
                            "pageScroll": false,
                            "autoplay": false,
                            "action": "circular-wrapping"
                        },
                        "controls": [{
                                "name": "close",
                                "position": "start"
                        }]
                    }
                    </script>
                    <a href="${independentStory}" />
                </amp-story-player>
            </div>
        </body>

    </html>
    `;
};
