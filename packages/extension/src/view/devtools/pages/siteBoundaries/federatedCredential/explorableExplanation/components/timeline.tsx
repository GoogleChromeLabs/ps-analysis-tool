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
import { Fragment } from 'react/jsx-runtime';

/**
 * Internal dependencies.
 */
import { ScenarioKeys } from '../store/scenariosTypes';
import { useStore } from '../store';

interface TimelineProps {
  currentScenarioKey: ScenarioKeys;
}

const Timeline = ({ currentScenarioKey }: TimelineProps) => {
  const titles = [
    'Registration',
    'Sign In',
    'Silent ReAuth',
    'Interactive ReAuth',
    'Permissions',
    'Sign Out',
  ];

  const scenarioKeys = Object.values(ScenarioKeys);

  const { loadScenarioForInteractiveMode } = useStore(({ actions }) => ({
    loadScenarioForInteractiveMode: actions.loadScenarioForInteractiveMode,
  }));

  return (
    <div className="journey-timeline flex items-center justify-between px-5 min-h-[80px]">
      {titles.map((title, index) => {
        const isActive =
          index === Object.values(ScenarioKeys).indexOf(currentScenarioKey);
        const isCompleted =
          index < Object.values(ScenarioKeys).indexOf(currentScenarioKey);

        return (
          <Fragment key={title}>
            <div
              className={[
                'timeline-node font-medium text-center min-w-[100px] relative transition-all duration-300 cursor-pointer text-xs px-3 py-2.5 rounded text-raisin-black',
                isActive
                  ? 'active bg-bright-navy-blue text-white shadow-lg'
                  : isCompleted
                  ? 'completed bg-green-500 text-white'
                  : 'bg-gray-100  hover:bg-gray-200',
              ].join(' ')}
              id={`${Object.keys(ScenarioKeys)[index]}-node`}
              onClick={() => {
                loadScenarioForInteractiveMode(scenarioKeys[index]);
              }}
            >
              {index + 1}. {title}
            </div>
            {index < titles.length - 1 && (
              <div className="timeline-connector flex-grow h-[2px] bg-gray-200"></div>
            )}
          </Fragment>
        );
      })}
    </div>
  );
};

export default Timeline;
