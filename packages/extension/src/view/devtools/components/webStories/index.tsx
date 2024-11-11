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
import React from 'react';

const embeddedHtml = `
<!doctype html>
<html amp4ads="" lang="en">

<head>
  <meta charSet="utf-8" />
  <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1" />
  <script async="" src="https://cdn.ampproject.org/amp4ads-v0.js"></script>
  <script async="" src="https://cdn.ampproject.org/v0/amp-animation-0.1.js" custom-element="amp-animation"></script>
  <script async="" src="https://cdn.ampproject.org/v0/amp-video-0.1.js" custom-element="amp-video"></script>
  <link
    href="https://fonts.googleapis.com/css2?display=swap&amp;family=Monoton&amp;family=Poppins%3Awght%40400%3B600&amp;family=Philosopher"
    rel="stylesheet" />
  <style amp4ads-boilerplate="">
    // body {
    //   visibility: hidden
    // }
  </style>
  <style amp-custom="">
    amp-story-page {
      background-color: #131516;
    }

    amp-story-grid-layer {
      overflow: visible;
    }

    @media (max-aspect-ratio: 9 / 16) {
      @media (min-aspect-ratio: 320 / 678) {
        amp-story-grid-layer.grid-layer {
          margin-top: calc((100% / 0.5625 - 100% / 0.6666666666666666) / 2);
        }
      }
    }

    .page-fullbleed-area,
    .page-background-overlay-area {
      position: absolute;
      overflow: hidden;
      width: 100%;
      left: 0;
      height: calc(1.1851851851851851 * 100%);
      top: calc((1 - 1.1851851851851851) * 100% / 2);
    }

    .page-safe-area {
      overflow: visible;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      height: calc(0.84375 * 100%);
      margin: auto 0;
    }

    .mask {
      position: absolute;
      overflow: hidden;
    }

    .fill {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: 0;
    }

    .grid-layer-main {
      margin: auto;
      width: 100vw;
      height: calc(100vw * 1.5);
      max-width: 630px;
      max-height: 100vh;
      font-size: calc(100vw * 1.5/10);
      pointer-events: none;
      position: relative;
    }

    @media (min-width: 630px) {
      .grid-layer-main {
        font-size: calc(945px/10);
      }
    }

    body,
    html {
      overflow: hidden;
      font-size: calc(var(--story-page-vh, 8px)*2.5);
      height: 100%;
      margin: 0;
    }

    .page-wrapper {
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      position: absolute;
      left: 0;
      top: 0;
    }

    img.i-amphtml-fill-content {
      object-fit: contain;
    }
  </style>
  <meta name="amp-cta-url" content="https://example.com" />
  <meta name="amp-cta-type" content="CTA" />
  <meta name="amp-cta-landing-page-type" content="NONAMP" />
</head>

<body>
  <div id="4483cb7d-468a-4d69-99e8-3a168df71a40" class="page-wrapper" data-auto-advance-after="7s">
    <div class="grid-layer">
      <div class="page-fullbleed-area" style="background-color:#fff">
        <div class="page-safe-area">
          <div
            style="position:absolute;pointer-events:none;left:0%;top:-9.25926%;width:100%;height:118.51852%;opacity:1">
            <div style="pointer-events:initial;width:100%;height:100%;display:block;position:absolute;top:0;left:0"
              class="mask" id="el-bc6fb1a0-b37b-4938-8714-41c5152fe80f">
              <div class="fill" style="will-change:transform"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="grid-layer grid-layer-main">
      <div class="page-fullbleed-area">
        <div class="page-safe-area"></div>
      </div>
    </div>
  </div>
  <div id="fd605c94-77f5-4d51-9ac6-269b8479ae7b" class="page-wrapper" data-auto-advance-after="7s"><amp-animation
      layout="nodisplay" trigger="visibility">
      <script
        type="application/json">[{"selector":"#anim-f0d5a053-0dc3-4c98-9ec3-9c31873d513e","keyframes":{"transform":["translate3d(0px, 230.49438%, 0)","translate3d(0px, 0px, 0)"]},"delay":0,"duration":1000,"easing":"cubic-bezier(0.2, 0.6, 0.0, 1)","fill":"both"}]</script>
    </amp-animation><amp-animation layout="nodisplay" trigger="visibility">
      <script
        type="application/json">[{"selector":"#anim-0d23b77e-8a93-4c6c-80fa-08ec18f263f9","keyframes":{"transform":["translate3d(0px, 396.08771%, 0)","translate3d(0px, 0px, 0)"]},"delay":1000,"duration":1000,"easing":"cubic-bezier(0.2, 0.6, 0.0, 1)","fill":"both"}]</script>
    </amp-animation>
    <div class="grid-layer">
      <div class="page-fullbleed-area" style="background-color:#6a6a6a">
        <div class="page-safe-area">
          <div
            style="position:absolute;pointer-events:none;left:0%;top:-9.25926%;width:100%;height:118.51852%;opacity:1">
            <div style="pointer-events:initial;width:100%;height:100%;display:block;position:absolute;top:0;left:0"
              class="mask" id="el-e47fd3c2-7071-4d66-990f-ffa4456536f0">
              <div style="position:absolute;width:101.65646%;height:100%;left:-0.82823%;top:0%"
                data-leaf-element="true"><amp-img layout="fill"
                  src="https://rtcamp.github.io/web-stories-ad-tool/assets/images/editor/grid-placeholder.png"
                  alt="Placeholder"></amp-img></div>
            </div>
            <div class="element-overlay-area"
              style="background-image:linear-gradient(0.5turn, rgba(0,0,0,0) 20%, rgba(0,0,0,0.3) 100%)"></div>
          </div>
          <div class="page-background-overlay-area"
            style="background-image:linear-gradient(0.5turn, rgba(0,0,0,0) 20%, rgba(0,0,0,0.3) 100%)"></div>
        </div>
      </div>
    </div>
    <div class="grid-layer grid-layer-main">
      <div class="page-fullbleed-area">
        <div class="page-safe-area">
          <div
            style="position:absolute;pointer-events:none;left:9.95146%;top:24.59547%;width:79.85437%;height:36.73139%;opacity:1">
            <div id="anim-f0d5a053-0dc3-4c98-9ec3-9c31873d513e" class="animation-wrapper"
              style="width:100%;height:100%;display:block;position:absolute;top:0;left:0;--initial-transform:translate3d(0px, 230.49438%, 0)">
              <div
                style="pointer-events:initial;width:100%;height:100%;display:block;position:absolute;top:0;left:0;border-radius:0.60790273556231% 0.60790273556231% 0.60790273556231% 0.60790273556231% / 0.881057268722467% 0.881057268722467% 0.881057268722467% 0.881057268722467%"
                id="el-0ab64f73-ebd6-45f4-9b17-d9ed26ec470b">
                <p class="fill"
                  style="white-space:pre-wrap;overflow-wrap:break-word;word-break:break-word;margin:2.609707446808511% 0;font-family:&quot;Monoton&quot;,cursive;font-size:0.906149em;line-height:1.25;text-align:left;padding:0% 0%;color:#000000">
                  <span style="color: #fff">GREAT AUTUMN SALE</span></p>
              </div>
            </div>
          </div>
          <div
            style="position:absolute;pointer-events:none;left:9.95146%;top:63.75405%;width:79.85437%;height:11.48867%;opacity:1">
            <div id="anim-0d23b77e-8a93-4c6c-80fa-08ec18f263f9" class="animation-wrapper"
              style="width:100%;height:100%;display:block;position:absolute;top:0;left:0;--initial-transform:translate3d(0px, 396.08771%, 0)">
              <div
                style="pointer-events:initial;width:100%;height:100%;display:block;position:absolute;top:0;left:0;border-radius:0.60790273556231% 0.60790273556231% 0.60790273556231% 0.60790273556231% / 2.8169014084507045% 2.8169014084507045% 2.8169014084507045% 2.8169014084507045%"
                id="el-5b647ce8-0349-4424-ad50-a84b8fa78bed">
                <p class="fill"
                  style="white-space:pre-wrap;overflow-wrap:break-word;word-break:break-word;margin:-0.24620060790273574% 0;font-family:&quot;Poppins&quot;,sans-serif;font-size:0.262136em;line-height:1.5;text-align:left;padding:0% 0%;color:#000000">
                  <span style="font-weight: 600; color: #fff">Enjoy the start of the holiday season with our
                    special&nbsp;</span>
                  <span style="font-weight: 600; color: #fff">sale discounts</span>
                </p>
              </div>
            </div>
          </div>
          <div
            style="position:absolute;pointer-events:none;left:39.56311%;top:-0.97087%;width:20.87379%;height:8.25243%;opacity:1">
            <div style="pointer-events:initial;width:100%;height:100%;display:block;position:absolute;top:0;left:0"
              class="mask" id="el-5a1e59c8-225c-4623-8a97-ebcb3d7ab48a">
              <div style="position:absolute;width:479.06977%;height:1412.76353%;left:-189.53488%;top:-656.38177%"
                data-leaf-element="true"><amp-img layout="fill"
                  src="https://rtcamp.github.io/web-stories-ad-tool/assets/images/editor/grid-placeholder.png"
                  alt="Placeholder"></amp-img></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div id="18d726cf-860b-457b-88f1-f24cf1debf9c" class="page-wrapper"
    data-auto-advance-after="el-2d61adab-b691-49e1-8016-604cfc1328e7-media">
    <div class="grid-layer">
      <div class="page-fullbleed-area" style="background-color:#898989">
        <div class="page-safe-area">
          <div
            style="position:absolute;pointer-events:none;left:0%;top:-9.25926%;width:100%;height:118.51852%;opacity:1">
            <div style="pointer-events:initial;width:100%;height:100%;display:block;position:absolute;top:0;left:0"
              class="mask" id="el-2d61adab-b691-49e1-8016-604cfc1328e7">
              <div style="position:absolute;width:100.08231%;height:100%;left:-0.04115%;top:0%" data-leaf-element="true"
                data-video-has-local-url="false"><amp-video autoPlay="autoplay"
                  poster="https://wp.stories.google/static/main/images/templates/ad-template-two/page01_bg-poster.jpeg"
                  artwork="https://wp.stories.google/static/main/images/templates/ad-template-two/page01_bg-poster.jpeg"
                  title="adtemplate_singlevideotemplate_bg" alt="adtemplate_singlevideotemplate_bg" layout="fill"
                  id="el-2d61adab-b691-49e1-8016-604cfc1328e7-media">
                  <source type="video/mp4"
                    src="https://wp.stories.google/static/main/images/templates/ad-template-two/page01_bg.mp4" />
                </amp-video></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="grid-layer grid-layer-main">
      <div class="page-fullbleed-area">
        <div class="page-safe-area">
          <div
            style="position:absolute;pointer-events:none;left:0%;top:67.79935%;width:100%;height:41.42395%;opacity:1">
            <div style="pointer-events:initial;width:100%;height:100%;display:block;position:absolute;top:0;left:0"
              class="mask" id="el-8b9d490e-414d-4e45-8db4-ecee33ed6af7">
              <div class="fill"
                style="background-image:linear-gradient(0turn, rgba(0,0,0,0.5) 0%, rgba(196,196,196,0) 100%);will-change:transform">
              </div>
            </div>
          </div>
          <div
            style="position:absolute;pointer-events:none;left:9.95146%;top:78.15534%;width:80.09709%;height:8.57605%;opacity:1">
            <div
              style="pointer-events:initial;width:100%;height:100%;display:block;position:absolute;top:0;left:0;border-radius:0.6060606060606061% 0.6060606060606061% 0.6060606060606061% 0.6060606060606061% / 3.7735849056603774% 3.7735849056603774% 3.7735849056603774% 3.7735849056603774%"
              id="el-fd44893f-11dd-41e6-950d-7502fbfc3c97">
              <p class="fill"
                style="white-space:pre-wrap;overflow-wrap:break-word;word-break:break-word;margin:-2.648484848484848% 0;font-family:&quot;Philosopher&quot;,sans-serif;font-size:0.744337em;line-height:1.5;text-align:center;padding:0% 0%;color:#000000">
                <span style="color: #fff; letter-spacing: 0.01em">Explore the Sea</span></p>
            </div>
          </div>
          <div
            style="position:absolute;pointer-events:none;left:12.62136%;top:89.32039%;width:76.94175%;height:2.91262%;opacity:1">
            <div
              style="pointer-events:initial;width:100%;height:100%;display:block;position:absolute;top:0;left:0;border-radius:0.6309148264984227% 0.6309148264984227% 0.6309148264984227% 0.6309148264984227% / 11.11111111111111% 11.11111111111111% 11.11111111111111% 11.11111111111111%"
              id="el-8f93a817-f3d1-45a2-9fc3-f5be77762a08">
              <p class="fill"
                style="white-space:pre-wrap;overflow-wrap:break-word;word-break:break-word;margin:-0.2050473186119875% 0;font-family:&quot;Poppins&quot;,sans-serif;font-size:0.210356em;line-height:1.5;text-align:center;padding:0% 0%;color:#000000">
                <span style="color: #fff; letter-spacing: 0.39em">DISCOVER THE UNKNOWN</span></p>
            </div>
          </div>
          <div
            style="position:absolute;pointer-events:none;left:42.83981%;top:65.85761%;width:14.32039%;height:9.54693%;opacity:1">
            <div style="pointer-events:initial;width:100%;height:100%;display:block;position:absolute;top:0;left:0"
              class="mask" id="el-ccfff116-5783-4d71-992a-dda8c7b38830">
              <div style="position:absolute;width:698.30508%;height:1221.20216%;left:-299.15254%;top:-560.60108%"
                data-leaf-element="true"><amp-img layout="fill"
                  src="https://rtcamp.github.io/web-stories-ad-tool/assets/images/editor/grid-placeholder.png"
                  alt="Placeholder"></amp-img></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>

</html>
`;

const WebStories = () => {
  return (
    <iframe
      srcDoc={embeddedHtml}
      style={{ width: '100%', height: '100vh', border: 'none' }}
      title="Embedded AMP Content"
    />
  );
};

export default WebStories;
