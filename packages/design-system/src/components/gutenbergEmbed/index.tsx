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

const STYLE_URL =
  'https://psat-landing-pages.rt.gw/wp-includes/css/dist/block-library/style.min.css';

const GutenbergEmbed = ({ url }: GutenbergEmbedProps) => {
  const shadowHostRef = useRef<HTMLDivElement>(null);
  const [htmlContent, setHtmlContent] = useState('');
  const [styles, setStyles] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        setHtmlContent(data.content.rendered || '');
      } catch (error) {
        console.error('Error fetching content:', error);
      }
    };

    const fetchStyles = async () => {
      try {
        const response = await fetch(STYLE_URL);
        const cssText = await response.text();
        setStyles(cssText);
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

      const styleElement = document.createElement('style');
      styleElement.textContent = styles;

      const contentWrapper = document.createElement('div');
      contentWrapper.innerHTML = htmlContent;

      shadowRoot.appendChild(styleElement);
      shadowRoot.appendChild(contentWrapper);
    }
  }, [htmlContent, styles]);

  return <div ref={shadowHostRef}></div>;
};

export default GutenbergEmbed;
