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
 * External dependencies
 */
import { Dropdown } from '@google-psat/design-system';

/**
 * Internal dependencies
 */
import { usePrebid } from '../../../../../../stateProviders';

const NamespaceTab = () => {
  const { selectedFrameId, pbjsNamespaces, setFrameId } = usePrebid(
    ({ state, actions }) => ({
      selectedFrameId: state.selectedFrameId,
      pbjsNamespaces: state.pbjsNamespaces,
      setFrameId: actions.setFrameId,
    })
  );

  return (
    <>
      <div className="w-full h-full">
        <div className="w-max">
          <Dropdown
            options={Object.keys(pbjsNamespaces).map((namespace) => {
              return {
                label: pbjsNamespaces[Number(namespace)].host,
                value: namespace,
              };
            })}
            value={selectedFrameId.toString()}
            onChange={(value) => setFrameId(Number(value))}
          />
        </div>
      </div>
    </>
  );
};

export default NamespaceTab;
