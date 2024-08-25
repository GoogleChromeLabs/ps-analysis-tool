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

interface MenuItem {
  name: string;
  link?: string;
  menu?: MenuItem[];
}

interface Menu {
  title: string;
  menu: MenuItem[];
}

/**
 * Parse menu markup recieved from Github Wiki.
 * @param {string} markup Markup to be parsed.
 * @param {Array} excludeItems Menu items to exclude from the result.
 * @returns array Parsed array from the menu.
 */
const parseMenuMarkDown = (
  markup: string,
  excludeItems: string[] = []
): Menu[] => {
  const lines = markup.split('\n');
  const menu = [];

  let currentSection: Menu | null = null;
  let currentMenuStack: MenuItem[][] = [];

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith('#')) {
      // New section (e.g., ## PSAT DevTools Extension)
      if (currentSection) {
        menu.push(currentSection);
      }
      currentSection = { title: trimmedLine.replace(/^#+\s*/, ''), menu: [] };
      currentMenuStack = [currentSection.menu];
    } else if (trimmedLine.startsWith('-')) {
      // New menu item
      const indentationLevel = (line.match(/^\s+/) || [''])[0].length / 2;
      const menuItem: MenuItem = {} as MenuItem;

      // Extract link or plain text
      const linkMatch = trimmedLine.match(/\[([^\]]+)\]\(([^)]+)\)/);
      const plainMatch = trimmedLine.match(/\[\[([^\]]+)\]\]/);

      if (linkMatch) {
        menuItem.name = linkMatch[1];
        menuItem.link = linkMatch[2];
      } else if (plainMatch) {
        menuItem.name = plainMatch[1];
      }

      // Skip if the menu item should be excluded
      if (excludeItems.includes(menuItem.name)) {
        continue;
      }

      // Place the menu item at the correct level in the hierarchy
      if (indentationLevel < currentMenuStack.length - 1) {
        currentMenuStack = currentMenuStack.slice(0, indentationLevel + 1);
      }

      currentMenuStack[indentationLevel].push(menuItem);

      // If the item is a new category, create a submenu
      if (indentationLevel === currentMenuStack.length - 1) {
        menuItem.menu = [];
        currentMenuStack.push(menuItem.menu);
      }
    }
  }

  // Push the last section
  if (currentSection) {
    menu.push(currentSection);
  }

  return menu;
};

export default parseMenuMarkDown;
