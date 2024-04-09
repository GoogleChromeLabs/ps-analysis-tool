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
import { I18n } from '@ps-analysis-tool/i18n';
import React from 'react';

interface ErrorFallbackProps {
  error: Record<string, string>;
}

const ErrorFallback = ({ error }: ErrorFallbackProps) => {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.

  return (
    <div className="p-4 text-center" role="alert">
      <p className="font-bold mb-5 text-xl">{I18n.getMessage('dsWentWrong')}</p>
      <p className="mb-10">{I18n.getMessage('dsOpenInNewTab')}</p>
      <pre className="text-red-700 text-xs bg-slate-50 p-5 text-left border-l-4">
        {error?.message} {I18n.getMessage('dsOpenInNewTab')}
      </pre>
    </div>
  );
};

export default ErrorFallback;
