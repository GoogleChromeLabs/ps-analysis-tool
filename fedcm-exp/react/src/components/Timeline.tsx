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
import { Fragment } from 'react/jsx-runtime';
import { useStore } from '../store';
import { ScenarioKeys } from '../scenariosTypes';

/**
 *
 */
export default function Timeline() {
  const { currentScenario, selectScenario } = useStore(
    ({ state, actions }) => ({
      currentScenario: state.currentScenario,
      selectScenario: actions.selectScenario,
    })
  );

  const titles = [
    'Registration',
    'Sign In',
    'Silent ReAuth',
    'Interactive ReAuth',
    'Permissions',
    'Sign Out',
  ];

  return (
    <div className="journey-timeline">
      {titles.map((title, index) => {
        const isActive =
          index === Object.values(ScenarioKeys).indexOf(currentScenario);

        const isCompleted =
          index < Object.values(ScenarioKeys).indexOf(currentScenario);

        return (
          <Fragment key={title}>
            <div
              className={`timeline-node ${isActive ? 'active' : ''} ${
                isCompleted ? 'completed' : ''
              }`}
              id={`${Object.keys(ScenarioKeys)[index]}-node`}
              onClick={() => {
                if (!isActive) {
                  selectScenario(Object.values(ScenarioKeys)[index]);
                }
              }}
            >
              {index + 1}. {title}
            </div>
            {index < titles.length - 1 && (
              <div className="timeline-connector"></div>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
