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
 * Internal dependencies
 */
import { decycle } from '../decycle';

describe('decycle', () => {
  it('should serialize a simple object to JSON', () => {
    const obj = { a: 1, b: 'test', c: true };
    const result = decycle(obj);
    expect(result).toBe(JSON.stringify(obj));
  });

  it('should handle circular references', () => {
    const obj: any = { a: 1 };
    obj.self = obj; // Circular reference
    const result = decycle(obj);
    expect(result).toBe(JSON.stringify({ a: 1 }));
  });

  it('should discard objects with a "location" property', () => {
    const obj = { a: 1, location: 'test' };
    const result = decycle(obj);
    expect(result).toBe(JSON.stringify({ a: 1 }));
  });

  it('should handle nested objects with circular references', () => {
    const obj: any = { a: 1, b: { c: 2 } };
    obj.b.d = obj; // Circular reference
    const result = decycle(obj);
    expect(result).toBe(JSON.stringify({ a: 1, b: { c: 2 } }));
  });

  it('should handle arrays within the object', () => {
    const obj = { a: [1, 2, 3], b: 'test' };
    const result = decycle(obj);
    expect(result).toBe(JSON.stringify(obj));
  });

  it('should handle null values', () => {
    const obj = { a: null, b: 'test' };
    const result = decycle(obj);
    expect(result).toBe(JSON.stringify(obj));
  });

  it('should handle objects with no circular references', () => {
    const obj = { a: 1, b: { c: 2 } };
    const result = decycle(obj);
    expect(result).toBe(JSON.stringify(obj));
  });

  it('should handle empty objects', () => {
    const obj = {};
    const result = decycle(obj);
    expect(result).toBe(JSON.stringify(obj));
  });
});
