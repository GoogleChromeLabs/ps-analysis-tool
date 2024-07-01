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
 * Internal dependencies.
 */
import fse, { MakeDirectoryOptions, Mode, PathLike } from 'fs';

/**
 * Internal dependencies.
 */
import {
  filePathValidator,
  localeValidator,
  numericValidator,
  outDirValidator,
  urlValidator,
} from '../validators';
import path from 'path';

describe('Argument Validators', () => {
  let mockExit: jest.SpyInstance;

  beforeAll(() => {
    mockExit = jest.spyOn(process, 'exit').mockImplementation(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (code?: string | number | null | undefined) => undefined as never
    );
  });

  describe('numericValidator', () => {
    it('should return the input if it is a number', () => {
      expect(numericValidator('123')).toBe(123);
    });

    it('should exit the process with 1 if it is not a number', () => {
      numericValidator('abc');
      expect(mockExit).toHaveBeenCalledWith(1);
    });
  });

  describe('localeValidator', () => {
    it('should return the parsed locale if supported', () => {
      expect(localeValidator('hi')).toBe('hi');
    });

    it('should exit the process with 1 locale isnt supported', () => {
      localeValidator('abc');
      expect(mockExit).toHaveBeenCalledWith(1);
    });
  });

  describe('filePathValidator', () => {
    it('should return filepath if file path exists', () => {
      jest.spyOn(fse, 'existsSync').mockImplementation(() => {
        return true;
      });

      expect(filePathValidator('./path/abc.xml')).toBe('./path/abc.xml');
    });

    it('should exit the process with 1 file path doesnt exist', () => {
      jest.spyOn(fse, 'existsSync').mockImplementation(() => {
        return true;
      });

      filePathValidator('abc');

      expect(mockExit).toHaveBeenCalledWith(1);
    });
  });

  describe('urlValidator', () => {
    it('should return url if url is valid', () => {
      expect(urlValidator('https://bbc.com')).toBe('https://bbc.com');
    });

    it('should exit the process with 1 url is invalid', () => {
      urlValidator('abc');

      expect(mockExit).toHaveBeenCalledWith(1);
    });
  });

  describe('outDirValidator', () => {
    it('should return outdir path directly if it exists', () => {
      jest.spyOn(fse, 'existsSync').mockImplementation(() => {
        return true;
      });

      expect(outDirValidator('./path')).toBe('./path');
    });

    it('should create directory and return the outpur dir path', () => {
      jest.spyOn(fse, 'existsSync').mockImplementation(() => {
        return false;
      });

      const mkdirSync = jest.spyOn(fse, 'mkdirSync').mockImplementation(
        (
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          _path: PathLike,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          _options?: Mode | MakeDirectoryOptions | null | undefined
        ) => {
          return '';
        }
      );

      const dir = outDirValidator('./path');

      expect(mkdirSync).toHaveBeenNthCalledWith(
        1,
        path.resolve(__dirname + '../../../../../../out')
      );
      expect(mkdirSync).toHaveBeenNthCalledWith(
        2,
        path.resolve(__dirname + '../../../../../../out/path')
      );
      expect(dir).toBe('./path');
    });
  });

  afterAll(() => {
    mockExit.mockRestore();
  });
});
