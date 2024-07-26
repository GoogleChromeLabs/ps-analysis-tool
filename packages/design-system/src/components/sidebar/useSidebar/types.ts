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

export type SidebarComponent = {
  Element?: (props: any) => React.JSX.Element;
  props?: Record<string, unknown>;
};

export type SidebarItemValue = {
  title: (() => string) | string;
  children: SidebarItems;
  popupTitle?: string;
  infoIconDescription?: string;
  extraInterfaceToTitle?: SidebarComponent;
  dropdownOpen?: boolean;
  panel?: SidebarComponent;
  icon?: SidebarComponent;
  selectedIcon?: SidebarComponent;
  isBlurred?: boolean;
};

export type SidebarItems = {
  [key: string]: SidebarItemValue;
};

export interface useSidebarProps {
  data: SidebarItems;
  defaultSelectedItemKey?: string | null;
}
