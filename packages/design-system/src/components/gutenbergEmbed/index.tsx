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
/**
 * External dependencies.
 */
import React, { useEffect, useRef, useState } from 'react';

interface GutenbergEmbedProps {
  url: string;
}

const STYLE_URLS = [
  'https://psat-landing-pages.rt.gw/wp-includes/css/dist/block-library/style.min.css',
  'https://psat-landing-pages.rt.gw/wp-includes/css/dist/block-library/theme.min.css',
  'https://psat-landing-pages.rt.gw/wp-content/themes/amp-wp-org-theme/assets/build/css/main.css?ver=1739290079',
];

const fixRelativeUrls = (cssText: string, cssUrl: string) => {
  const baseUrl =
    new URL(cssUrl).origin + new URL(cssUrl).pathname.replace(/\/[^/]*$/, '/');

  // Convert relative URLs to absolute URLs
  cssText = cssText.replace(
    /url\((['"]?)(\.{1,2}\/[^)]+)\1\)/g,
    (match, quote, relativePath) => {
      const absoluteUrl = new URL(relativePath, baseUrl).href;
      return `url(${quote || ''}${absoluteUrl}${quote || ''})`;
    }
  );

  // Convert global body/html styles to apply inside the Shadow DOM
  cssText = cssText.replace(/html|body/g, ':host');

  return cssText;
};

const GutenbergEmbed = ({ url }: GutenbergEmbedProps) => {
  const shadowHostRef = useRef<HTMLDivElement>(null);
  const [htmlContent, setHtmlContent] = useState('');
  const [styles, setStyles] = useState<string[]>([]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setHtmlContent(data.content.rendered || '<p>Error loading content</p>');
      } catch (error) {
        console.error('Error fetching content:', error);
        setHtmlContent(
          '<p>Failed to load content. Please try again later.</p>'
        );
      }
    };

    const fetchStyles = async () => {
      try {
        const cssResponses = await Promise.all(
          STYLE_URLS.map(async (cssUrl) => {
            const response = await fetch(cssUrl);
            const cssText = await response.text();
            return fixRelativeUrls(cssText, cssUrl);
          })
        );
        setStyles(cssResponses);
      } catch (error) {
        console.error('Error fetching styles:', error);
      }
    };

    fetchContent();
    fetchStyles();
  }, [url]);

  useEffect(() => {
    if (shadowHostRef.current && htmlContent) {
      const shadowRoot = shadowHostRef.current.attachShadow({ mode: 'open' });
      shadowRoot.innerHTML = ''; // Clear existing content before re-rendering

      styles.forEach((cssText) => {
        const styleElement = document.createElement('style');
        styleElement.textContent = cssText;
        shadowRoot.appendChild(styleElement);
      });

      const contentWrapper = document.createElement('div');
      contentWrapper.innerHTML = htmlContent;
      shadowRoot.appendChild(contentWrapper);
    }
  }, [htmlContent, styles]);

  return <div ref={shadowHostRef}></div>;
};

export default GutenbergEmbed;
