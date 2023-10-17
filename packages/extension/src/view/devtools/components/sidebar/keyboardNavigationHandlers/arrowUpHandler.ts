/*
 * Copyright 2023 Google LLC
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
 * Internal dependencies
 */
import TABS from '../../../tabs';

interface ArrowUpHandlerProps {
  accordionState: Record<string, boolean> | undefined;
  currentIndex: number;
  mainMenuTabSelector: (index: number) => void;
  setSelectedAccordionChild: React.Dispatch<
    React.SetStateAction<string | null>
  >;
  selectedFrame: string | null;
  setIndex: (index: number) => void;
  setSelectedFrame: (key: string | null) => void;
  selectedIndex: number;
  keys: string[];
}

const getPreviousTab = (selectedIndex: number) => {
  for (let i = selectedIndex; i > 0; i = i - 1) {
    if (
      TABS[i]?.parentId &&
      TABS[i]?.hasChildren &&
      TABS[i].id !== TABS[selectedIndex].id
    ) {
      return i;
    }
  }
  return 0;
};

export const arrowUpHandler = ({
  accordionState,
  currentIndex,
  mainMenuTabSelector,
  setSelectedAccordionChild,
  selectedFrame,
  setIndex,
  setSelectedFrame,
  selectedIndex,
  keys,
}: ArrowUpHandlerProps) => {
  if (accordionState && accordionState['cookies']) {
    if (selectedFrame) {
      if (currentIndex === 0) {
        mainMenuTabSelector(1);
        setSelectedAccordionChild(TABS[1].id);
      } else {
        setSelectedFrame(keys[currentIndex - 1]);
      }
    } else {
      if (TABS[selectedIndex].id === 'siteBoundaries') {
        setIndex(1);
        setSelectedFrame(keys[keys.length - 1]);
      } else {
        if (selectedIndex > 0) {
          if (
            accordionState && //@ts-ignore We have already set the parents in useEffect
            accordionState[TABS[selectedIndex].parentId] && //@ts-ignore We have already set the parents in useEffect
            accordionState[TABS[selectedIndex - 1].parentId]
          ) {
            setSelectedAccordionChild(TABS[selectedIndex - 1].id);
            setIndex(selectedIndex - 1);
          } else {
            const previousTab = getPreviousTab(selectedIndex);
            setSelectedAccordionChild(TABS[previousTab].id);
            setIndex(previousTab);
          }
        }
      }
    }
  } else {
    if (selectedIndex > 0) {
      if (
        accordionState && //@ts-ignore Since we are using Boolean this will default to false
        accordionState[TABS[selectedIndex].parentId] && //@ts-ignore Since we are using Boolean this will default to false
        accordionState[TABS[selectedIndex - 1].parentId]
      ) {
        setSelectedAccordionChild(TABS[selectedIndex - 1].id);
        setIndex(selectedIndex - 1);
      } else {
        const previousTab = getPreviousTab(selectedIndex);
        setSelectedAccordionChild(TABS[previousTab].id);
        setIndex(previousTab);
      }
    }
  }
};
