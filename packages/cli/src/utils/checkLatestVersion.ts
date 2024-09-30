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

/**
 * Internal dependencies.
 */
import packageJson from '../../package.json';

/**
 * Check latest version and show message.
 */
const checkLatestVersion = async () => {
  // The update-notifier package doesn't display an update message on the first run, which isn't what we want.
  // However, we wanted to leverage its other functionalities, so we check for updates manually.
  const notifier = updateNotifier({
    pkg: packageJson,
    updateCheckInterval: 1000 * 60 * 60 * 24 * 7 * 365 * 50, // Large number to prevent check.
    shouldNotifyInNpmScript: true,
  });

  // @todo Cache result somehow to prevent it running everytime.
  const info = await notifier.fetchInfo();

  const message =
    'Update available ' +
    chalk.dim(info.current) +
    chalk.reset(' → ') +
    chalk.green(info.latest) +
    ' \nRun ' +
    chalk.cyan('npm i -g @google-psat/cli') +
    ' to update';

  if (info.type !== 'latest') {
    console.log(
      boxen(message, {
        padding: 1,
        margin: 1,
        textAlignment: 'center',
        borderColor: 'yellow',
        borderStyle: 'round',
      })
    );
  }
};

export default checkLatestVersion;
