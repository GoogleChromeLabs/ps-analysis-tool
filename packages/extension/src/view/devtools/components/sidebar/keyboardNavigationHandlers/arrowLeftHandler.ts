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
  mainMenuTabSelector: (index: number) => void;
  setSelectedAccordionChild: React.Dispatch<
    React.SetStateAction<string | null>
  >;
  selectedFrame: string | null;
  setAccordionState: React.Dispatch<
    React.SetStateAction<Record<string, boolean> | undefined>
  >;
  id: string;
}

export const arrowLeftHandler = ({
  accordionState,
  mainMenuTabSelector,
  setSelectedAccordionChild,
  selectedFrame,
  setAccordionState,
  id,
}: ArrowUpHandlerProps) => {
  if (accordionState && accordionState[id]) {
    if (selectedFrame) {
      mainMenuTabSelector(1);
      setSelectedAccordionChild(TABS[1].id);
    } else {
      setAccordionState((prevState) => ({ ...prevState, [id]: false }));
    }
  }
  if (
    accordionState &&
    Object.keys(accordionState).filter((key) => accordionState[key] === true)
      .length === 1 &&
    accordionState['privacySandbox']
  ) {
    setSelectedAccordionChild(TABS[0].id);
    setAccordionState((prevState) => ({
      ...prevState,
      privacySandbox: false,
    }));
    mainMenuTabSelector(0);
  }
};
