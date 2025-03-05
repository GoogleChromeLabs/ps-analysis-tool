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
import React, { type PropsWithChildren, useState, useCallback } from 'react';
import type { ClassificationResult } from '@google-psat/design-system';
/**
 * Internal dependencies.
 */
import Context, { type TopicsClassifierContext } from './context';

const Provider = ({ children }: PropsWithChildren) => {
  const [websites, setWebsites] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [validationErrors, setInputValidationErrors] = useState<string[]>([]);
  const [classificationResult, setClassificationResult] = useState<
    TopicsClassifierContext['state']['classificationResult']
  >([]);

  const handleClassification = useCallback(async () => {
    const hosts = websites.split('\n');
    const preprocessedHosts: string[] = [];
    const inputValidationErrors: string[] = [];
    setInputValidationErrors([]);

    hosts.forEach((host) => {
      const trimmedHost = host.trim();
      if (trimmedHost === '') {
        return;
      }

      preprocessedHosts.push(trimmedHost);
    });

    preprocessedHosts.forEach((host) => {
      const hostnameRegex = /^(?!:\/\/)([a-zA-Z0-9-_]{1,63}\.)+[a-zA-Z]{2,63}$/;
      if (!hostnameRegex.test(host)) {
        inputValidationErrors.push('Host "' + host + '" is invalid.');
      }
    });

    if (inputValidationErrors.length > 0) {
      setInputValidationErrors(inputValidationErrors);
      return;
    } else {
      try {
        const response = await fetch(
          'https://topics.privacysandbox.report/classify',
          {
            method: 'POST',
            body: JSON.stringify({
              domains: preprocessedHosts,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        let jsonResponse = await response.json();
        jsonResponse = jsonResponse
          .map((res: ClassificationResult, index: number) => {
            return {
              ...res,
              index: index,
            };
          })
          .map((classification: ClassificationResult) => {
            let modifiedCategories: ClassificationResult['categories'] =
              classification.categories;

            if (!classification.categories) {
              return classification;
            }

            if (classification.categories?.length > 1) {
              modifiedCategories = classification.categories.filter(
                (singleClassification) =>
                  singleClassification.name !== 'Unknown'
              );
            } else {
              if (classification.categories[0].name === 'Unknown') {
                return {
                  ...classification,
                  categories: [],
                };
              }
            }

            return {
              ...classification,
              categories: modifiedCategories,
            };
          });
        jsonResponse;
        jsonResponse.forEach((classifiedCategories: ClassificationResult) => {
          if (classifiedCategories?.error) {
            inputValidationErrors.push(classifiedCategories.error);
          }
        });
        setInputValidationErrors(inputValidationErrors);

        jsonResponse = jsonResponse.filter(
          (classifiedCategories: ClassificationResult) =>
            classifiedCategories?.categories
        );

        setClassificationResult(jsonResponse);
      } catch (err) {
        setInputValidationErrors(['Error: Failed to classify websites']);
      }
    }
  }, [websites]);

  return (
    <Context.Provider
      value={{
        state: {
          validationErrors,
          websites,
          classificationResult,
        },
        actions: {
          setWebsites,
          handleClassification,
        },
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Provider;
