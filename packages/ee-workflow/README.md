# Explorable Explaination Workflow

## Getting Started

**EE Workflow** is a modular toolkit for building interactive, animated diagrams and flows using [p5.js](https://p5js.org/). This guide walks you through the essential steps to set up and use EE Workflow in your project, with practical examples and code references.


## 1. Define Your Data

Before rendering, define the data representing your workflow such as nodes, names, positions, and metadata.

**Demo reference(s):** `packages/ee-workflow/demo/data.ts`

```ts
export const nodes = [
  { website: 'Site A' /* ... */ },
  { website: 'Site B' /* ... */ },
  // ...
];
```

This data will be used to create visual elements (figures) on the canvas.

- What kind of data is required to be defined?

  - Nodes: Each node represents an entity in your workflow (e.g., a website, a user, a process).
  - Metadata: Additional information about each node (e.g., type, status, relationships).
  - Positions: Coordinates for placing nodes on the canvas (optional; can be auto-calculated).
  - Steps/Actions: Define the sequence of actions or steps for each node.

- Where to define this data?
  - Create a separate file (e.g., `data.ts` or `data.js`) to keep your data organized.
  - Import this data into your main workflow script where you initialize the canvas and figures.



## 2. Define HTML Structure for Canvas and Controls

You need an HTML container for the canvas and, optionally, controls for interacting with the workflow.

**Demo reference(s):** `packages/ee-workflow/index.html L31-146`

**Example (HTML):**

```html
<div id="canvas-container" style="height: 1000px; width: 2000px"></div>
<button id="play">Play</button>
<button id="next">Next</button>
<!-- Add other controls as needed -->
```

**Example (React):**

```tsx
const componentContainerRef = useRef<HTMLDivElement>(null);
const messageContainerRef = useRef<HTMLDivElement>(null);
// Pass these refs to the canvas initializer
```

- Why a container?

  - The container provides a dedicated space for the p5.js canvas to render your workflow.
  - It allows you to control the size and position of the canvas within your application layout.

- What controls are needed?
  - Play/Pause Button: To start or stop the animation.
  - Next Button: To move to the next checkpoint or step in the workflow.
  - Additional Controls: Depending on your needs, you might add buttons for previous steps, reset, speed control, etc.


## 3. Define State for Syncing UI and Canvas

Maintain state variables to keep your UI and canvas in sync (animation state, checkpoints, interactive mode).

**Demo reference(s):** `packages/ee-workflow/demo/index.ts L93-138`

**Example (JS/TS):**

```ts
let isInteractive = false;
let checkpoints: string[] = [];
let expanded = { animator: null, image: null, wasExpanded: false };
```

**Example (React):**

```tsx
const [coordinates, _setCoordinates] = useState<{
  [id: string]: { x: number; y: number };
} | null>(null);
```

- Why maintain state?

  - State variables help track the current status of the workflow (e.g., whether it's playing, paused, or at a specific checkpoint).
  - They enable interaction between the UI controls and the canvas, ensuring that user actions are reflected in the animation.

- How do these states interact with the canvas?
  - When a user clicks a control (e.g., Play button), the corresponding state variable is updated, triggering the canvas to start or stop the animation. Alongside, the canvas can update the state (e.g., current checkpoint) to inform the UI of its status.


## 4. Initialize the Canvas (Main Class)

Create an instance of the `Main` class to set up the p5.js canvas.

**Demo reference(s):** `packages/ee-workflow/demo/index.ts L140-182`

**Example (Vanilla JS/TS):**

```ts
const container = document.getElementById('canvas-container')!;
const mainCanvas = new Main(
  undefined, // animation mode
  container, // HTML element for canvas
  undefined, // canvas size
  { x: 0, y: 100 } // canvas position
);
```

**Example (React):**

```tsx
useEffect(() => {
  if (
    messageContainerRef.current &&
  ) {
    const canvas = initializeCanvas(
      messageContainerRef.current,
      setCoordinates,
      idToLoad
    );
    setCanvas(canvas);
  }
}, [setCanvas, setCoordinates]);
```

What is the `Main` class?

- The `Main` class is the core of the EE Workflow library, responsible for managing the p5.js canvas, queues, snapshots, overall animation state, rendering logic, etc.


## 5. Initialize the Figure Factory

Use `FigureFactory` to create figures (shapes, text, images) for your workflow.

**Demo reference(s):** `packages/ee-workflow/demo/index.ts L156, L170`

```ts
const figureFactory = new FigureFactory(mainCanvas, container);
```

- What is `FigureFactory`?

  - `FigureFactory` is a utility class that provides methods to create various types of figures (circles, boxes, lines, text, images) with customizable properties.

- Why use `FigureFactory`?
  - It simplifies the process of creating and managing figures on the canvas.
  - It ensures consistency in figure creation and provides built-in support for positioning and animation.


## 6. Use FigureFactory to Create Figures

Use the `figureFactory` instance to create and position figures.

- **Positioning:** Use `nextTipHelper` to position new figures relative to previous ones.
- **Customization:** Each figure type (circle, box, line, text, image) has specific parameters.
- **Animation:** Define a `traveller` callback for progressive rendering.

**Demo reference(s):** `packages/ee-workflow/demo/index.ts L400-405, L411-447, L495-503, etc.`

**Example:**

```ts
const circle = figureFactory.circle({
  x: 100,
  y: 100,
  diameter: 75,
  fill: '#d3d3d3',
  stroke: '#000',
  nextTipHelper: (nextCoordinates) => ({
    x: nextCoordinates.middle.x + 20,
    y: nextCoordinates.middle.y,
  }),
  shouldTravel: true,
  travelInit: () => {
    /* custom animation logic */
  },
});
```

- Do I need to create all figures upfront?

  - No, you can create figures as needed throughout your workflow. However, figures that are part of the background or persistent elements should be created before defining checkpoints.

- How to position figures?
  - Use the `nextTipHelper` callback to define how new figures should be positioned relative to last drawn figure. This allows for dynamic and context-aware placement.


## 7. Define Background Figures and Groups

Background figures/groups remain visible throughout the workflow.
Any figure/group added before defining a checkpoint is treated as background, also use the second argument of `addFigure`/`addGroup` to be as true for instant draw.

**Demo reference(s):** `packages/ee-workflow/demo/index.ts L385-468`

```ts
mainCanvas.addFigure(
  figureFactory.line({ x: 0, y: 150, endX: 1600, endY: 150 }),
  true // always rendered as background
);

const group = new Group(mainCanvas, [circle, label]);
mainCanvas.addGroup(group, true); // true for background
```

- What are background figures/groups?

  - Background figures/groups are visual elements that remain visible throughout the entire workflow, regardless of the current checkpoint or animation state.
  - They are typically used for static elements like borders, grids, or persistent labels.

- When to use background figures/groups?

  - Use background figures/groups for elements that should always be visible, such as a title, legend, or static shapes.
  - Add them before defining any checkpoints to ensure they are rendered consistently.

- Why define before checkpoints?
  - Defining background figures/groups before checkpoints ensures they are drawn first and remain unaffected by the animation steps that follow.
  - This helps maintain a clear and consistent visual context for the workflow.

---

## 8. Define Animators and Checkpoints

Create animators with figures/groups for each step. Assign checkpoint IDs for navigation.

**Demo reference(s):** `packages/ee-workflow/demo/index.ts L493-593, L685-1014`

```ts
const checkpointFigure = figureFactory.line({
  x: 100,
  y: 100,
  endX: 200,
  endY: 200,
  id: 'custom-checkpoint-id',
});
const animator = new Animator(
  [checkpointFigure /* ...other figures/groups... */],
  figureFactory
);
mainCanvas.addAnimator(animator, false, true); // true marks as checkpoint
```

- What is an animator?

  - An animator is a collection of figures and groups that represent a specific step or action in the workflow. It manages the rendering and animation of these elements.

- How to define checkpoints and their significance?
  - Checkpoints are specific points in the workflow where the animation can pause or stop. They allow users to navigate through different stages of the workflow.
  - To define a checkpoint, add an animator with the third argument of `addAnimator` set to `true`. The first figure in the animator's list will be used as the checkpoint.
  - You can assign a custom ID to the checkpoint figure for easier reference and navigation.



## 9. Hook Controls with Callbacks

Connect your HTML controls to workflow methods.

**Demo reference(s):** `packages/ee-workflow/demo/index.ts L226-344`

```ts
playButton.addEventListener('click', () => mainCanvas.togglePause());
nextButton.addEventListener('click', () => mainCanvas.nextCheckpoint());
```

- What controls to hook?

  - Play/Pause Button: Toggles the animation state.
  - Next Button: Advances to the next checkpoint.
  - Previous Button: (if implemented) Moves to the previous checkpoint.
  - Reset Button: (if implemented) Resets the workflow to the initial state.
  - And any other custom controls you have defined.

- How to connect controls to canvas methods?

  - Use event listeners (e.g., `addEventListener` in vanilla JS or `onClick` in React) to bind your HTML controls to the corresponding methods on the `mainCanvas` instance.
  - Ensure that the methods you call (like `togglePause`, `nextCheckpoint`) are available on the `Main` class instance.

- How do I keep the UI and canvas in sync?
  - Update state variables in your event handlers to reflect the current status of the canvas (e.g., whether it's playing or paused).
  - Use callbacks provided by the `Main` class (like `onCheckpointChange`) to update your UI when the canvas state changes.


## 10. Register Click Events on Figures

Add event handlers for figures to enable interactivity.

**Demo reference(s):** `packages/ee-workflow/demo/index.ts L428-446`

```ts
const circle = figureFactory.circle({
  x: 100,
  y: 100,
  diameter: 75,
  mouseClicked: () => {
    if (isInteractive) {
      mainCanvas.loadCheckpointToHelper(checkpointId);
    }
  },
});
```

Interactive mode allows users to pause animation and interact directly with nodes or figures.

- How to add click events?
  - When creating a figure using `FigureFactory`, you can define event handlers (like `mouseClicked`, `mouseOver`, etc.) as part of the figure's properties.
  - These handlers will be called when the corresponding event occurs on the figure.


# Advanced Usage & Practices

> These features are for advanced users who want to build complex, interactive, and highly customized visual workflows with EE Workflow. The following patterns are demonstrated in the demo and production code.


## 1. Image Preloading and Usage

You can preload images (such as icons or arrows) and use them as part of your figures.
This is useful for custom visuals or branding.

**Demo reference(s):** `packages/ee-workflow/demo/index.ts L67-91, L195-200`

```ts
const preloader = (p: p5) => {
  arrowImage = p.loadImage('arrow.png');
};
const mainCanvas = new Main(
  undefined,
  container,
  undefined,
  undefined,
  undefined,
  preloader
);
const figureFactory = new FigureFactory(mainCanvas, container);

const arrowFigure = figureFactory.image({
  x: 100,
  y: 100,
  imageLoader: () => arrowImage,
});
mainCanvas.addFigure(arrowFigure, true);
```

- Why preload images?

  - Preloading ensures that images are fully loaded before they are used in the canvas, preventing rendering issues or delays.
  - It allows you to use custom graphics, icons, or branding elements in your workflow.

- How to use preloaded images?
  - Use the `imageLoader` property in the `figureFactory.image` method to specify a function that returns the preloaded image.
  - Add the image figure to the canvas using `addFigure`.


## 2. Multiple Canvases and Synchronization

You can create and synchronize multiple canvas instances (e.g., for components and flows).
This allows for layered or parallel visualizations that stay in sync.

**Demo reference(s):** `packages/ee-workflow/demo/index.ts L140-182, L134-145, L622-658, L1043-1081

```ts
const componentCanvas = new Main(false, componentContainer);
const flowCanvas = new Main(false, flowContainer);

const componentFigureFactory = new FigureFactory(
  componentCanvas,
  componentContainer
);
const flowFigureFactory = new FigureFactory(flowCanvas, flowContainer);

// Use shared state or callbacks to keep canvases in sync
```

- Why multiple canvases?

  - Multiple canvases allow you to separate different aspects of your workflow (e.g., a main flow and a detailed component view).
  - They can be layered or positioned side-by-side for better visualization.
  - Each canvas can have its own set of figures, animations, and controls.

- How to synchronize canvases?
  - Use shared state variables or callbacks to coordinate actions between canvases (e.g., when one canvas updates, the other responds accordingly).
  - You can also use events or direct method calls to trigger updates across canvases.


## 3. Side Effects and Custom Draw Logic

Groups and figures can have side effects or custom logic that runs when they are drawn.
This is useful for triggering additional rendering, state changes, or analytics.

**Demo reference(s):** `packages/ee-workflow/demo/index.ts L645-654`

```ts
group.setSideEffectOnDraw(() => {
  // Custom logic here, e.g., highlight, log, or trigger UI updates
});
```

- What are side effects?

  - Side effects are additional actions or logic that occur when a figure, group or animator has drawn on the canvas.
  - They can be used to trigger animations, update UI elements, log events, or perform calculations.

- When to use side effects?
  - Use side effects when you need to perform actions that are dependent on the drawing of specific figures or groups.
  - They are useful for creating dynamic and responsive visualizations that react to user interactions or animation states.


## 4. Event-Driven Architecture

EE Workflow is highly event-driven.
You can listen for and dispatch custom events (like `ee:dispatchId`) to trigger UI updates, animation steps, or other logic.

**Demo reference(s):** `packages/ee-workflow/demo/index.ts L1084-1156`

```ts
document.addEventListener('ee:dispatchId', (event: Event) => {
  const { dispatchId } = (event as CustomEvent).detail;
  // Use dispatchId to update UI or trigger logic
});
```

- What events are available?

  - EE Workflow emits various events during its lifecycle, such as `ee:dispatchId`, `ee:animatorDraw`, 'ee:stepNext', etc.

- How to listen for events?
  - Use `addEventListener` to listen for specific events on the `document`.
  - Handle the event in a callback function to perform actions based on the event data.


## 5. Checkpoint Management

When adding an animator, set the third argument to `true` to mark it as a checkpoint.
The **first figure** in the animator’s list will be used as the checkpoint.
You can assign a custom ID to this figure for custom checkpoint handling and navigation.

**Demo reference(s):** `packages/ee-workflow/demo/index.ts L106-116, L444`

```ts
const checkpointFigure = figureFactory.line({
  x: 100,
  y: 100,
  endX: 200,
  endY: 200,
  id: 'custom-checkpoint-id',
});
const animator = new Animator(
  [checkpointFigure /* ...other figures/groups... */],
  figureFactory
);
mainCanvas.addAnimator(animator, false, true); // true marks as checkpoint
```

- Use the custom ID to Demo reference(s) this checkpoint in your workflow logic or UI.
- The checkpoint can be used for navigation, state restoration, or triggering specific actions.

- Why define checkpoints?

  - Checkpoints allow users to navigate through different stages of the workflow, pausing or resuming the animation at specific points.
  - They provide a way to structure the workflow into manageable segments, making it easier to understand and interact with.

- How to use checkpoints?
  - Use the `loadNextCheckpoint` and `loadPreviousCheckpoint` methods on the `Main` class to navigate between checkpoints.
  - You can also load a specific checkpoint using its ID with the `loadCheckpointToHelper` method to jump directly to that point in the workflow. But we need to ensure that it is in interactive mode.


## 6. Advanced FigureFactory Usage

- **nextTipHelper:**
  Use this callback to position new figures relative to previous ones (up, down, left, right, middle).
- **shouldTravel:**
  Enable progressive rendering (e.g., lines being drawn step-by-step, circles expanding).
- **Custom callbacks:**
  Attach mouse events or animation logic to figures.

**Demo reference(s):** `packages/ee-workflow/demo/index.ts L698-703, L709-714, L719-724, etc.`

```ts
const line = figureFactory.line({
  x: 100,
  y: 100,
  endX: 200,
  shouldTravel: true,
  nextTipHelper: (coords) => ({ x: coords.right.x + 10, y: coords.right.y }),
});
```

- What is `nextTipHelper`?

  - `nextTipHelper` is a callback function that helps position new figures relative to the last drawn figure. It receives the coordinates of the last figure and returns new coordinates for the next figure.

- Why use `nextTipHelper`?

  - It allows for dynamic and context-aware placement of figures, making it easier to create structured and organized layouts.
  - It helps maintain consistent spacing and alignment between figures.

- What is `shouldTravel`?
  - `shouldTravel` is a boolean property that enables progressive rendering of a figure. When set to `true`, the figure will be drawn in a step-by-step manner, creating an animation effect. But you need to define `travelInit` callback to define how the figure should animate.


## 7. Interactive Mode and Stepping

Enable interactive mode to let users pause animation and interact directly with nodes or figures.
Stepping mode allows frame-by-frame navigation.

**Demo reference(s):** `packages/ee-workflow/demo/listeners.ts L48-64, L172-188, L260-272, packages/ee-workflow/demo/index.ts L94-98, L322-331, L431`

```ts
let isInteractive = false;
figure.mouseClicked = () => {
  if (isInteractive) {
    mainCanvas.loadCheckpointToHelper(checkpointId);
  }
};
```

- What is interactive mode?

  - Interactive mode allows users to pause the animation and click on the nodes to play related animator for that node.
  - It enables direct interaction with the figures on the canvas, allowing users to explore the workflow at their own pace.

- How to enable interactive mode?

  - Set a state variable (e.g., `isInteractive`) to `true` when
    you want to enable interactive mode.
  - Add event handlers (like `mouseClicked`) to figures to respond to user interactions.
  - In the event handler, check if `isInteractive` is `true` before performing actions like loading a checkpoint.

- What is stepping?
  - Stepping allows users to navigate through the workflow one step at a time, either forward or backward.
  - It provides fine-grained control over the animation, making it easier to analyze specific parts of the workflow.



## 8. State Persistence

Use browser storage (like `localStorage`) to persist workflow state, such as the last checkpoint, across reloads.

**Demo reference(s):** `packages/ee-workflow/demo/index.ts L142-155, L1097, packages/ee-workflow/demo/listeners.ts L22-28`

```ts
const idToStart = localStorage.getItem('ee-workflow') || '';
const mainCanvas = new Main(
  undefined,
  container,
  undefined,
  undefined,
  idToStart
);
```

- Why persist state?

  - Persisting state allows users to resume their workflow from where they left off, even after refreshing the page or closing the browser.
  - It enhances the user experience by maintaining continuity and reducing the need to restart the workflow.

- How to implement state persistence?
  - Use browser storage mechanisms like `localStorage` or `sessionStorage` to save relevant state information (e.g., last checkpoint ID or eventListener `ee:figureDraw`).
  - On page load, retrieve the saved state and initialize the canvas with this information to restore the previous state.



## 9. Scenario-Driven Animation

You can drive your workflow from scenario data (e.g., a list of steps or actions), dynamically creating animators and groups based on the scenario.

**Demo reference(s):** `packages/ee-workflow/demo/index.ts L1084-1156`

```ts
Object.entries(scenarios).forEach(([key, { steps }]) => {
  // For each scenario, create animators and add to canvas
});
```

- What is scenario-driven animation?

  - Scenario-driven animation involves using predefined data (scenarios) to dynamically create and control the workflow's animation and structure.
  - Each scenario can represent a different sequence of actions or steps, allowing for flexible and reusable workflows.

- How to implement scenario-driven animation?
  - Define your scenarios as data structures (e.g., objects or arrays) that outline the steps and actions for each scenario.
  - Iterate over the scenarios to create animators and groups based on the defined steps, using the `FigureFactory` to create the necessary figures.
  - Add the created animators to the `Main` canvas instance, allowing users to switch between scenarios or view different workflows.

---

\*\*These advanced features allow you to build rich, interactive, and highly customized visual explanations and flows.
Explore the demo code
