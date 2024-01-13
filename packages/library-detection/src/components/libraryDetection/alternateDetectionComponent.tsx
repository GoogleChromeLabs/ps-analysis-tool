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
 * External dependencies.
 */
import React, { useState, useEffect } from 'react';
import { ProgressBar } from '@ps-analysis-tool/design-system';

const AlternateDetectionComponent = () => {
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setPageLoaded(true);
    }, 2000);
  }, []);

  return (
    <div>
      {!pageLoaded ? (
        <>
          <ProgressBar additionalStyles="w-1/3 mx-auto h-full" />
          <p className="text-center">
            Checking libraries for any known breakages on the page....
          </p>
        </>
      ) : (
        <p className="text-center">
          No libraries with known breakages found yet!
        </p>
      )}
    </div>
  );
};

export default AlternateDetectionComponent;
