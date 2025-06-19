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
  const {
    selectedFrameId,
    pbjsNamespaces,
    setFrameId,
    namespace,
    setNamespace,
  } = usePrebid(({ state, actions }) => ({
    selectedFrameId: state.selectedFrameId,
    pbjsNamespaces: state.pbjsNamespaces,
    namespace: state.namespace,
    setNamespace: actions.setNamespace,
    setFrameId: actions.setFrameId,
  }));

  return (
    <>
      <div className="w-full h-full flex flex-row gap-6 px-4">
        <div className="w-max">
          <Dropdown
            options={Object.keys(pbjsNamespaces).map((frameId) => {
              return {
                label: pbjsNamespaces[Number(frameId)].host,
                value: frameId,
              };
            })}
            value={`${selectedFrameId}`}
            onChange={(value) => {
              const _frameId = Number(value);
              const defaultNamespace =
                pbjsNamespaces[_frameId].namespaces[0].namespace;

              setFrameId(Number(_frameId));
              setNamespace(defaultNamespace);
            }}
          />
        </div>
        <div className="w-max">
          <Dropdown
            options={pbjsNamespaces[selectedFrameId].namespaces.map(
              (_namespace) => {
                return {
                  label: _namespace.namespace,
                  value: _namespace.namespace,
                };
              }
            )}
            value={`${namespace}`}
            onChange={(value) => {
              setNamespace(value);
            }}
          />
        </div>
      </div>
    </>
  );
};

export default NamespaceTab;
