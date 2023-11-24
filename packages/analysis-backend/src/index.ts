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
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import validate from 'validate.js';
import {
  analyzeCookiesUrls,
  analyzeTechnologiesUrlsInBatches,
} from '@ps-analysis-tool/analysis-utils';
import { ReportDisplayType } from '@ps-analysis-tool/common';
/**
 * Internal dependencies.
 */
import { fetchDictionary } from './utils';

dotenv.config({ path: `.env.backend` });

const PORT: number = parseInt(process.env.PORT || '80');
const DELAY_TIME = parseInt(process.env.DELAY_TIME || '15000');

fetchDictionary()
  .then((cookieDictionary) => {
    const app = express();
    app.use(express.json());
    app.use(cors());

    app.get('/', (req, res) => {
      return res.sendStatus(200);
    });

    app.get('/api', async (req, res) => {
      const url = (req.query.url as string) || '';

      let type = ReportDisplayType.SITE;

      const result = validate(
        { url },
        {
          url: {
            url: {
              message: 'should be matching the format https://<example.com>',
              schemes: ['https', 'http'],
            },
          },
        }
      );

      if (result) {
        return res.status(400).json({
          error: result.url[0],
        });
      }

      if (url && url.endsWith('.xml')) {
        type = ReportDisplayType.SITEMAP;
      }

      if (type === ReportDisplayType.SITE) {
        const [cookieData] = await analyzeCookiesUrls(
          [url],
          true,
          DELAY_TIME,
          cookieDictionary
        );

        const [technologyData] = await analyzeTechnologiesUrlsInBatches([url]);

        return res.json({
          pageUrl: url,
          cookieData: cookieData.cookieData,
          technologyData,
        });
      } else {
        return res.sendStatus(200);
      }
    });

    app.listen(PORT, () =>
      console.log(`Server is started.
    PORT : ${PORT}
    DELAY_TIME : ${DELAY_TIME}`)
    );
  })
  .catch((err: Error) => {
    console.log('Unable to start server');
    console.error(err);
    process.exit(1);
  });
