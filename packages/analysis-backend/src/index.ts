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
import { MongoClient } from 'mongodb';
import { ReportDisplayType } from '@ps-analysis-tool/common';
/**
 * Internal dependencies.
 */
import { fetchDictionary } from './utils';
import analyzeSingleUrl from './procedures/analyizeSingleSite';

dotenv.config({ path: `.env.backend` });

const PORT: number = parseInt(process.env.PORT || '80');
const DELAY_TIME = parseInt(process.env.DELAY_TIME || '15000');
const CONNECTION_STRING = process.env.DB_URI;
const DB_NAME = process.env.DB_NAME;
const COOKIE_COLLECTION_NAME = process.env.COOKIE_COLLECTION_NAME;
const TECHNOLOGY_COLLECTION_NAME = process.env.TECHNOLOGY_COLLECTION_NAME;
const URL_COLLECTION_NAME = process.env.URL_COLLECTION_NAME;

if (
  !CONNECTION_STRING ||
  !DB_NAME ||
  !COOKIE_COLLECTION_NAME ||
  !TECHNOLOGY_COLLECTION_NAME ||
  !URL_COLLECTION_NAME
) {
  console.error('Improper DB metadata, Check .env.backend');
  process.exit(1);
}

const connectToDb = async () => {
  const client = new MongoClient(CONNECTION_STRING);

  const conn = await client.connect();
  const db = conn.db(DB_NAME);
  const cookieAnalysisCollection = db.collection(COOKIE_COLLECTION_NAME);
  const technologyAnalysisCollection = db.collection(
    TECHNOLOGY_COLLECTION_NAME
  );
  const urlCollection = db.collection(URL_COLLECTION_NAME);

  return {
    cookieAnalysisCollection,
    technologyAnalysisCollection,
    urlCollection,
  };
};

fetchDictionary()
  .then(async (cookieDictionary) => {
    const {
      cookieAnalysisCollection,
      technologyAnalysisCollection,
      urlCollection,
    } = await connectToDb();

    console.log(`Connection to DB successfull
    DB_NAME : ${DB_NAME}
    COOKIE_COLLECTION_NAME : ${COOKIE_COLLECTION_NAME}
    TECHNOLOGY_COLLECTION_NAME : ${TECHNOLOGY_COLLECTION_NAME}
    URL_COLLECTION_NAME : ${URL_COLLECTION_NAME}
    `);

    const app = express();
    app.use(express.json());
    app.use(cors());

    app.get('/', (req, res) => {
      return res.sendStatus(200);
    });

    app.get('/api', async (req, res) => {
      const url = (req.query.url as string) || '';
      const shouldReanalyizeCookies = req.query.reanalyizeCookies === 'yes';
      const shouldReanalyizeTechnologies =
        req.query.reanalyizeTechnologies === 'yes';

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
        const analysis = await analyzeSingleUrl(
          urlCollection,
          cookieAnalysisCollection,
          technologyAnalysisCollection,
          url,
          cookieDictionary,
          DELAY_TIME,
          shouldReanalyizeCookies,
          shouldReanalyizeTechnologies
        );

        return res.json(analysis);
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
