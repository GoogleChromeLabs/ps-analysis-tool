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
import Timeline from './components/Timeline';
import ScenarioInfoPanel from './components/ScenarioInfoPanel';
import BrowserStep from './components/BrowserStep';
import SequenceDiagram from './components/SequenceDiagram';
import './App.css';

/**
 *
 */
export default function App() {
  return (
    <div>
      <header>
        <h1>FedCM Authentication Journey</h1>
        <p>An explorable explanation of Federated Credential Management</p>
      </header>
      <Timeline />
      <main>
        <ScenarioInfoPanel />
        <div id="visualization-container">
          <BrowserStep />
          <SequenceDiagram />
        </div>
      </main>
    </div>
  );
}
