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

const PAAPIBidsPage = () => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">PAAPI Bids</h1>
      <p className="text-gray-700">
        This page displays the PAAPI bids received during the auction.
      </p>
      {/* Additional content can be added here */}
    </div>
  );
};

export default PAAPIBidsPage;
