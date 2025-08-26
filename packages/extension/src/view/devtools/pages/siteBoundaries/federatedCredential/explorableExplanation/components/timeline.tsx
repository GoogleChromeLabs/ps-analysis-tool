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

  const { interactiveMode, loadScenarioForInteractiveMode } = useStore(
    ({ state, actions }) => ({
      interactiveMode: state.interactiveMode,
      loadScenarioForInteractiveMode: actions.loadScenarioForInteractiveMode,
    })
  );

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
                'timeline-node font-medium text-center relative min-w-[120px] transition-all duration-300 cursor-pointer text-sm px-[15px] py-[10px] rounded text-raisin-black',
                isActive
                  ? 'active bg-bright-navy-blue text-white shadow-[0_2px_5px_rgba(0,0,0,0.2)]'
                  : isCompleted
                  ? 'completed bg-[#38b559] text-white'
                  : 'bg-[#f0f0f0]  hover:bg-[#d0d0d0]',
              ].join(' ')}
              id={`${Object.keys(ScenarioKeys)[index]}-node`}
              onClick={() => {
                if (interactiveMode) {
                  const checkpoint = scenarioKeys[index] + '-0';
                  loadScenarioForInteractiveMode(
                    checkpoint,
                    Boolean(currentScenarioKey !== scenarioKeys[index])
                  );
                }
              }}
            >
              {index + 1}. {title}
            </div>
            {index < titles.length - 1 && (
              <div className="timeline-connector flex-grow h-[2px] bg-[#e0e0e0]"></div>
            )}
          </Fragment>
        );
      })}
    </div>
  );
};

export default Timeline;
