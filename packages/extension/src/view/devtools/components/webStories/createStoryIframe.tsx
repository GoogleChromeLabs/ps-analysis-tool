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
interface CardProps {
  heroImage: string;
  publisherLogo: string;
  publisherName: string;
  storyTitle: string;
}
interface StoryAnchorProps {
  storyUrl: string;
}
export interface SingleStoryJSON {
  heroImage: string;
  publisherLogo: string;
  publisherName: string;
  storyTitle: string;
  storyUrl: string;
}

const getStoryAnchorTags = ({ storyUrl }: StoryAnchorProps) => {
  return `
        <a href="${storyUrl}" class="story"></a>
    `;
};

export const getStoryMarkup = (storyJson: SingleStoryJSON[]) => {
  const predefinedStoryHeader = `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <script async src="${chrome?.runtime?.getURL(
      'assets/amp/amp-player-main.js'
    )}" type="module"></script>
    <script async src="${chrome?.runtime?.getURL(
      'assets/amp/amp-story-player-v0.js'
    )}"></script>
    <link href="https://cdn.ampproject.org/amp-story-player-v0.css" rel="stylesheet" type="text/css">

    <style>
        .carousel-container {
            position: relative;
        }

        .carousel-container::after {
            display: none;
            position: absolute;
            pointer-events: none;
            content: '';
            width: 239px;
            height: 488px;
            bottom: 0;
            right: 0;
            background: linear-gradient(270deg, rgba(255, 255, 255, 0.94) 0%, rgba(255, 255, 255, 0) 89.96%);
            background-attachment: local, local, scroll, scroll;
        }

        .carousel-container.overflow-right::after {
            display: block;
        }

        .carousel-container::before {
            z-index: 1;
            display: none;
            position: absolute;
            pointer-events: none;
            content: '';
            width: 239px;
            height: 488px;
            bottom: 0;
            left: 0;
            background: linear-gradient(90deg, rgba(255, 255, 255, 0.94) 0%, rgba(255, 255, 255, 0) 89.96%);
        }

        .carousel-container.overflow-left::before {
            display: block;
        }


        .carousel-header {
            border: 1px solid #cccccc;
            border-top: 10px solid #000000;
            border-bottom: none;
            font-family: Helvetica;
            font-style: normal;
            font-weight: bold;
            font-size: 32px;
            line-height: 60px;
            padding-left: 36px;
        }

        .carousel-cards-container {
            display: flex;
            position: relative;
            align-items: center;
            height: auto;
            overflow-x: scroll;
        }


        /* Mobile CSS rules here*/
        @media only screen and (hover: none) and (pointer: coarse) {
            .carousel-header {
                padding-left: 24px;
            }

            .carousel-container {
                margin: 0px 13px;
            }

            .carousel-cards-container {
                border: 1px solid #cccccc;
            }

            .carousel-container::after {
                width: 180px;
                height: 349px;
            }

            .carousel-container::before {
                width: 180px;
                height: 349px;
            }
        }

        body h1 {
            font-weight: 600;
            font-size: 18px;
            line-height: 27px;
            color: white;
            font-family: Poppins;
            margin: 30px 20px;
        }

        .fake-content {
            width: 320px;
            height: 427px;
            top: -178px;
            margin: auto;

            background: #24242d;
            box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2);
            border-radius: 16px;
        }

        .viewport {
            position: relative;
            display: flex;
            flex-direction: column;
            border-radius: 10px;
            padding: 15px;
            margin: auto;
            width: 360px;
            height: 800px;
            background-color: #202029;
            overflow: hidden;
        }

        @media (max-width: 410px) {
            .viewport {
                width: 100%;
                border-radius: 0px;
                padding: 0px;
                /*     overflow-x: hidden; */
            }
        }

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
            /* Dismissal has faster duration. */
            transition: transform 0.2s, opacity 0.2s, visibility 0.2s;
            pointer-events: none;
        }

        /* No transitions when dragging, it creates a laggy effect. */
        .dragging {
            transition: none;
        }

        body:before {
            content: "";
            z-index: 2;
            pointer-events: none;
            width: 100vw;
            height: 100vh;
            background-color: rgba(0, 0, 0, 0.8);
            position: fixed;
            top: 0;
            left: 0;
            opacity: 0;
            transition: opacity 0.2s, visibility 0.2s;
            visibility: hidden;
        }

        body.lightbox-open:before {
            opacity: 1;
            visibility: visible;
        }

        amp-story-player.my-player {
            /*   width: 360px;
  height: 600px;
  margin: 70px auto; */
            width: 100%;
            height: 100%;

        }

        ::-webkit-scrollbar {
            display: none;
        }

        .page-indicators>* {
            width: 8px;
            height: 8px;
            margin: 10px 5px;
            border-radius: 100px;
            background-color: white;
        }

        .page-indicator-right {
            opacity: 0.3;
        }

        .page-indicators {
            width: 100%;
            justify-content: center;
            margin: 0;
            display: flex;
            position: absolute;
        }

        body {
            margin: 0px;
            max-width: 1200px;
            margin: auto;
        }


        .entry-points {
            display: flex;
            overflow-y: visible;
            flex-direction: row;
            flex-wrap: wrap;
            gap: 24px 10px;
            scrollbar-width: none;
            padding-right: 36px;
            padding-left: 36px;
        }

        .entry-point-card-img {
            object-fit: cover;
            width: 100%;
            height: 100%;
            box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2);
            border-radius: 16px;
        }

        .entry-point-card-container:after {
            top: 0;
            right: 0;
            left: 0;
            bottom: 0;
            background: linear-gradient(180deg,
                    rgba(0, 0, 0, 0.0001) 49.88%,
                    rgba(0, 0, 0, 0.9) 100%);
            height: 100%;
            width: 100%;
            position: absolute;
            border-radius: 16px;
            content: "";
        }

        .entry-point-arrow {
            z-index: 1;
            cursor: pointer;
            background-repeat: no-repeat;
            background-position: 50%;
            background-size: 14px 24px;
            border: 0px;
            background-color: #000000;
            outline: transparent;
            height: 48px;
            width: 48px;
            min-width: 48px;
            position: absolute;
            border-radius: 50%;
            padding: 0px;
            box-shadow: 0px 0px 10px rgba(60, 64, 67, 0.3);
            visibility: hidden;
            background-image: url('data:image/svg+xml;charset=utf-8,<svg width="14" height="24" viewBox="0 0 14 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 2.82L8.65317 12L0 21.18L2.66397 24L14 12L2.66397 0L0 2.82Z" fill="white"/></svg>');
        }

        .visible {
            visibility: visible;
        }

        .entry-point-left-arrow {
            left: 68px;
            transform: rotate(-180deg);
        }

        .entry-point-right-arrow {
            right: 68px;
        }

        .entry-point-card-container {
            flex-shrink: 0;
            cursor: pointer;
            position: relative;
            margin-right: 24px;
            width: 240px;
            height: 400px;
            opacity: 1;
            transform: scale(1);
            visibility: visible;
            transition: opacity 0.33s, transform 0.33s, visibility 0.33s;
        }

        .entry-point-card-container.hidden {
            opacity: 0;
            visibility: hidden;
        }

        .background-cards {
            display: flex;
            align-items: center;
            z-index: -1;
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            transition: transform 0.2s;
            transform: translate3d(0px, 0px, 0px);
        }

        .entry-point-card-container:hover .background-cards {
            transform: translate3d(24px, 0px, 0px);
        }

        .background-card-1 {
            background: #000000;
            margin: 0px 2px;
            width: 10px;
            height: 368px;
            border-top-right-radius: 16px;
            border-bottom-right-radius: 16px;
        }

        .background-card-2 {
            background: #4d4d4d;
            width: 10px;
            height: 336px;
            border-top-right-radius: 16px;
            border-bottom-right-radius: 16px;
        }

        .author-container {
            position: absolute;
            display: flex;
            align-items: center;
            top: 24px;
            left: 24px;
        }

        .card-headline-container {
            position: absolute;
            bottom: 2px;
            text-align: left;
            padding: 24px;
            z-index: 1;
        }

        .entry-point-card-headline {
            color: #fff;
            font-weight: 700;
            font-family: "Poppins", sans-serif;
            text-transform: uppercase;
            font-size: 24px;
            line-height: 26px;
        }

        .entry-point-card-subtitle {
            color: #fff;
            font-weight: 700;
            font-family: "Noto Sans", sans-serif;
            text-transform: uppercase;
            font-size: 11px;
            line-height: 15px;
        }

        .logo-container {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 38px;
            height: 38px;
            position: relative;
            margin-right: 10px;
        }

        .logo-ring {
            width: 46px;
            height: 46px;
            background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 220 220' width='100%25' height='100%25' preserveAspectRatio='none'><defs><linearGradient id='gradient'><stop offset='0' style='stop-color:%232BAC95' /><stop offset='1' style='stop-color:%236EB6F9' /></linearGradient></defs><ellipse ry='100' rx='100' cy='110' cx='110' style='fill:none;stroke:url(%23gradient);stroke-width:6;' /></svg>");
            border-radius: 100%;
            position: absolute;
        }

        .entry-point-card-logo {
            border-radius: 100%;
            width: 38px;
            height: 38px;
            filter: drop-shadow(0px 0px 20px rgba(255, 255, 255, 0.25));
        }

        /* Mobile CSS rules here*/
        @media only screen and (hover: none) and (pointer: coarse) {
            .entry-point-card-container {
                width: 180px;
                height: 300px;
            }

            .entry-point-card-container.hidden {
                transform: scale(1.2);
            }

            .author-container {
                top: 16px;
                left: 16px;
            }

            .logo-container,
            .entry-point-card-logo {
                width: 20px;
                height: 20px;
            }

            .logo-ring {
                width: 26px;
                height: 26px;
            }

            .entry-point-card-subtitle {
                font-size: 10px;
                line-height: 14px;
            }

            .entry-point-card-headline {
                font-size: 18px;
                line-height: 20px;
            }

            .card-headline-container {
                padding: 16px;
            }

            .background-cards {
                display: none;
            }
        }
    </style>

    <link href="https://fonts.googleapis.com/css2?family=Poppins&amp;display=swap" rel="stylesheet">
    <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
    <title>Web Player</title>
</head>

<body>
    <!-- carousel -->
    <div class="carousel-section">
        <div class="carousel-container">
            <div class="carousel-cards-container">
                <div class="entry-points">
`;

  const predefinedStoryEnder = `
                </div>
            </div>
        </div>
    </div>
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
            },
            {
              "name": "skip-to-next"
            }
          ]
        }
      </script>
`;

  const getCardHTML = ({
    heroImage,
    publisherLogo,
    publisherName,
    storyTitle,
  }: CardProps) => {
    return `
      <div class="entry-point-card-container">
      <div class="background-cards">
          <div class="background-card-1"></div>
          <div class="background-card-2"></div>
      </div>
      <img src="${heroImage}" class="entry-point-card-img" alt="A cat">
      <div class="author-container">
          <div class="logo-container">
              <div class="logo-ring"></div>
              <img class="entry-point-card-logo"
                  src="${publisherLogo}" alt="Publisher logo">
          </div>
          <span class="entry-point-card-subtitle"> By ${publisherName} </span>
          </div>
  
          <div class="card-headline-container">
              <span class="entry-point-card-headline"> ${storyTitle} </span>
          </div>
      </div>
      `;
  };

  const enderTags = `
        </amp-story-player>
    </div>

</body>

</html>
`;
  const cards = storyJson.map(getCardHTML);
  const storyAnchors = storyJson.map(getStoryAnchorTags);

  return `${predefinedStoryHeader}${cards.join(
    ''
  )}${predefinedStoryEnder}${storyAnchors.join('')}${enderTags}`;
};
