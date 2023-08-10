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
const sortRetentionPeriod = (values: string[]) => {
  return values.sort((timeString1: string, timeString2: string) => {
    const time1 = getTimeValue(timeString1);
    const time2 = getTimeValue(timeString2);

    if (time1 !== 0 && time2 === 0) {
      return -1; // Move time-related string to the beginning
    } else if (time1 === 0 && time2 !== 0) {
      return 1; // Move other string to the end
    } else {
      return time1 - time2; // Sort by time value
    }
  });
};

const getTimeValue = (timeString: string) => {
  if (timeString.includes('month')) {
    return Number(timeString.split(' ')[0]) * 30 * 24 * 60 * 60;
  } else if (timeString.includes('year')) {
    return Number(timeString.split(' ')[0]) * 365 * 24 * 60 * 60;
  } else if (timeString.includes('day')) {
    return Number(timeString.split(' ')[0]) * 24 * 60 * 60;
  } else if (timeString.includes('week')) {
    return Number(timeString.split(' ')[0]) * 7 * 24 * 60 * 60;
  } else if (timeString.includes('hour')) {
    return Number(timeString.split(' ')[0]) * 60 * 60;
  } else if (timeString.includes('minute')) {
    return Number(timeString.split(' ')[0]) * 60;
  } else if (timeString.includes('second')) {
    return Number(timeString.split(' ')[0]);
  } else {
    return 0;
  }
};

export default sortRetentionPeriod;
