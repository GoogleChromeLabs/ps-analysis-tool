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

const darkTheme = {
  scheme: 'google-extended',
  base00: 'rgba(0, 0, 0, 0)', // background - transparent
  base01: '#282a2e', // NA
  base02: '#373b41', // Object border
  base03: '#969896', // NA
  base04: '#b4b7b4', // Object size
  base05: '#c5c8c6', // undefined data type
  base06: '#e0e0e0', // NA
  base07: '#7cacf8', // braceColor & object key color
  base08: '#CC342B', // NaN data type
  base09: '#5cd5fb', // string data type & ellipsisColor
  base0A: '#FBA922', // null and regex data type
  base0B: '#816ac7', // float data type
  base0C: '#7cacf8', // array key
  base0D: '#3971ED', // date and function data type
  base0E: '#816ac7', // boolean data type
  base0F: '#816ac7', // integer data type
};

const lightTheme = {
  scheme: 'rjv-default-extended',
  base00: 'rgba(0, 0, 0, 0)',
  base01: 'rgb(245, 245, 245)', // NA
  base02: 'rgb(235, 235, 235)', // Object border
  base03: '#93a1a1', // NA
  base04: 'rgba(0, 0, 0, 0.3)', // Object size
  base05: '#586e75', // undefined data type
  base06: '#073642', // NA
  base07: '#8e004b', // braceColor & object key color
  base08: '#d33682', // NaN data type
  base09: '#cb4b16', // string data type & ellipsisColor
  base0A: '#dc322f', // null and regex data type
  base0B: '#0842A0', // float data type
  base0C: '#6c71c4', // array key
  base0D: '#586e75', // date and function data type
  base0E: '#0842A0', // boolean data type
  base0F: '#0842A0', // integer data type
};

export { darkTheme, lightTheme };
