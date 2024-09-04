/*
 * Copyright 2024 Google LLC
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
import updateNotifier from 'update-notifier';
import boxen from 'boxen';
import chalk from 'chalk';
import { noop } from '@google-psat/common';

/**
 * Internal dependencies.
 */
import checkLatestVersion from '../checkLatestVersion';

jest.mock('update-notifier', () => jest.fn());
jest.mock('boxen', () => jest.fn());
jest.mock('chalk', () => ({
  dim: jest.fn((text) => text),
  reset: jest.fn((text) => text),
  green: jest.fn((text) => text),
  cyan: jest.fn((text) => text),
}));

describe('checkLatestVersion', () => {
  let fetchInfoMock;

  beforeEach(() => {
    fetchInfoMock = jest.fn();

    updateNotifier.mockReturnValue({
      fetchInfo: fetchInfoMock,
    });

    jest.spyOn(console, 'log').mockImplementation(noop);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not show a message if the current version is the latest', async () => {
    // Arrange
    fetchInfoMock.mockResolvedValue({
      current: '1.0.0',
      latest: '1.0.0',
      type: 'latest',
    });

    await checkLatestVersion();
    expect(boxen).not.toHaveBeenCalled();
    expect(console.log).not.toHaveBeenCalled();
  });

  it('should show a message if an update is available', async () => {
    fetchInfoMock.mockResolvedValue({
      current: '1.0.0',
      latest: '2.0.0',
      type: 'major',
    });

    const expectedMessage =
      'Update available ' +
      chalk.dim('1.0.0') +
      chalk.reset(' → ') +
      chalk.green('2.0.0') +
      ' \nRun ' +
      chalk.cyan('npm i -g @google-psat/cli') +
      ' to update';

    await checkLatestVersion();
    expect(boxen).toHaveBeenCalledWith(expectedMessage, {
      padding: 1,
      margin: 1,
      textAlignment: 'center',
      borderColor: 'yellow',
      borderStyle: 'round',
    });
    expect(console.log).toHaveBeenCalled();
  });
});
