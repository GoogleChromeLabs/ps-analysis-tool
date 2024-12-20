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

const main = {
  stepsQueue: [],
  groupStepsQueue: [[]],
  instantQueue: [],
  reDrawAll: () => {
    if (main.pause) {
      return;
    }

    clear();
    background(220);
    main.stepsQueue = [];
    main.groupStepsQueue = [[]];
    main.instantQueue = [];
    main.storage.forEach((object) => {
      if (object instanceof Box) {
        object.color = map(
          noise(object.x * 0.01, object.y * 0.01, frameCount * 0.01),
          0,
          1,
          0,
          255
        );
      }

      main.instantQueue.push(object);
    });
  },
  delay: 50,
  pause: false,
  storage: [],
  groupsStorage: [],
};

/**
 *
 */
function setup() {
  createCanvas(1600, 1600);
  background(220);
}

/**
 *
 */
function draw() {
  if (main.pause) {
    return;
  }

  if (frameCount % main.delay === 0) {
    const firstObject = main.stepsQueue.shift();
    if (firstObject === undefined) {
      return;
    }

    console.log(firstObject);

    firstObject.draw();
    if (!firstObject.throw) {
      main.storage.push(firstObject);
    }

    const group = main.groupStepsQueue.shift();
    if (group !== undefined) {
      if (group instanceof Group) {
        group.draw();
        main.groupsStorage.push(group);
      } else {
        group.forEach((object) => {
          object.draw();
          main.storage.push(object);
        });
      }
    }
  }

  // can be replaced with requestAnimationFrame, just update the redrawAll function to pass callback which renderes UI, and also create instantRender function which will render the instantQueue when called.
  if (main.instantQueue.length > 0) {
    main.instantQueue.forEach((object) => {
      object.draw();
    });
    main.instantQueue = [];
  }
}

/**
 *
 */
function mouseClicked() {
  // navigate through the timeline and change color of clicked circle object to black
  // and then push to instantQueue

  const clickedObject = main.storage.find((object) => {
    if (object instanceof Circle) {
      return (
        mouseX > object.x - object.radius &&
        mouseX < object.x + object.radius &&
        mouseY > object.y - object.radius &&
        mouseY < object.y + object.radius
      );
    } else if (object instanceof Box) {
      return (
        mouseX > object.x &&
        mouseX < object.x + object.width &&
        mouseY > object.y &&
        mouseY < object.y + object.height
      );
    }
  });

  if (clickedObject instanceof Circle) {
    console.log(clickedObject);
    if (clickedObject.gid) {
      const group = main.groupsStorage.find(
        (group) => group.groupId === clickedObject.gid
      );
      console.log(group);
      group.onMouseClick();
      return;
    }

    clickedObject.color = 'black';
    main.instantQueue.push(clickedObject);
  } else if (clickedObject instanceof Box) {
    clickedObject.sideEffectCallback?.();
  }
}

/**
 *
 */
function mouseMoved() {
  // highlight the object
  main.storage.forEach((object) => {
    if (object instanceof Circle) {
      if (
        mouseX > object.x - object.radius &&
        mouseX < object.x + object.radius &&
        mouseY > object.y - object.radius &&
        mouseY < object.y + object.radius
      ) {
        object.color = 'gray';
        main.instantQueue.push(object);
      } else if (object.color === 'gray') {
        object.color = 'black';
        main.instantQueue.push(object);
      }
    }
  });
}

class Box {
  constructor(
    x = 0,
    y = 0,
    width = 50,
    height = 50,
    color = 'black',
    sideEffectCallback = null
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.throw = false;
    this.sideEffectCallback = sideEffectCallback;
  }

  draw() {
    fill(this.color);
    rect(this.x, this.y, this.width, this.height);
  }
}

class Circle {
  constructor(x = 0, y = 0, radius = 50, color = 'black') {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }

  draw() {
    fill(this.color);
    circle(this.x, this.y, this.radius);
  }
}

class Line {
  constructor(x1 = 0, y1 = 0, x2 = 0, y2 = 0, color = 'black') {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.color = color;
  }

  draw() {
    stroke(this.color);
    line(this.x1, this.y1, this.x2, this.y2);
  }
}

class RippleEffect {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
    this.throw = false;
    this.times = 0;
    this.ripples = [];

    for (let i = 0; i < 10; i++) {
      this.ripples.push({
        radius: 0,
        baseSpeed: 1 + i * 0.5,
      });
    }
  }

  draw() {
    this.create(this.x, this.y);
    this.throw = true;
    this.times++;

    if (this.times <= 10) {
      console.log('times', this.times);
      main.stepsQueue.push(this);
    } else {
      main.reDrawAll();
    }
  }

  create(rippleX, rippleY) {
    // Calculate the area to clear
    const { ripples, numRipples, speed, maxRadius } = {
      ripples: this.ripples,
      numRipples: 3,
      speed: 1,
      maxRadius: 200,
    };
    const clearWidth = maxRadius * 2 + (numRipples - 1) * 40;
    const clearHeight = maxRadius * 1.5;

    push();
    // Clear only the area used by the ripples
    fill(220);
    noStroke();
    rect(
      rippleX - 1,
      rippleY - clearHeight / 2 - 200,
      clearWidth,
      clearHeight + 400
    );
    let allComplete = true;
    translate(rippleX, rippleY);

    for (let i = 0; i < ripples.length; i++) {
      const ripple = ripples[i];
      if (ripple.radius < maxRadius) {
        ripple.radius += ripple.baseSpeed * speed;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        allComplete = false;
      } else {
        ripple.radius = maxRadius; // Ensure the radius doesn't exceed maxRadius
      }

      // Black color with fading opacity
      const opacity = map(ripple.radius, 0, maxRadius, 255, 0);
      stroke(0, opacity);
      noFill();

      // Increased spacing between ripples
      const spacing = 40;
      arc(
        0,
        0,
        (ripple.radius + i * spacing) * 2,
        (ripple.radius + i * spacing) * 2,
        -HALF_PI,
        HALF_PI
      );
    }

    pop(); // Restore the original transformation state
  }
}

class Group {
  constructor(objects, id) {
    this.objects = objects;
    this.groupId = id;
  }

  draw() {
    this.objects.forEach((object) => {
      object.gid = this.groupId;
      object.draw();
      // main.storage.push(object);
    });
  }

  onMouseClick() {
    this.objects.forEach((object) => {
      object.color = 'black';
      main.instantQueue.push(object);
    });
  }
}

// We will create a timeline, where circle signify the circular nodes, connected with lines.
// the timeline should be horizontal and line should not overlap with the circle.

const timeline = [
  new Circle(100, 100, 50, 'red'),
  new Line(125, 100, 175, 100, 'black'),
  new Circle(200, 100, 50, 'blue'),
  new Line(225, 100, 275, 100, 'black'),
  new Circle(300, 100, 50, 'green'),
  new Line(325, 100, 375, 100, 'black'),
  new Circle(400, 100, 50, 'yellow'),
  new Line(425, 100, 475, 100, 'black'),
  new Circle(500, 100, 50, 'purple'),
];

timeline.forEach((object, index) => {
  main.stepsQueue.push(object);
});

const button = new Box(100, 200, 100, 50, 'black');
button.sideEffectCallback = () => {
  main.reDrawAll();
};
main.stepsQueue.push(button);

const pauseButton = new Box(300, 200, 100, 50, 'red');
pauseButton.sideEffectCallback = () => {
  main.pause = !main.pause;
  // remove fourth element from the timeline and redraw
  // main.storage.splice(3, 1);
  // main.reDrawAll();
};
main.stepsQueue.push(pauseButton);

main.stepsQueue.push(new RippleEffect(600, 600));

const group1 = [
  new Circle(100, 300, 50, 'red'),
  new Line(125, 300, 175, 300, 'black'),
  new Circle(200, 300, 50, 'blue'),
  new Line(225, 300, 275, 300, 'black'),
  new Circle(300, 300, 50, 'green'),
  new Line(325, 300, 375, 300, 'black'),
  new Circle(400, 300, 50, 'yellow'),
];

const group2 = [
  new Circle(100, 400, 50, 'red'),
  new Line(125, 400, 175, 400, 'black'),
  new Circle(200, 400, 50, 'blue'),
  new Line(225, 400, 275, 400, 'black'),
  new Circle(300, 400, 50, 'green'),
  new Line(325, 400, 375, 400, 'black'),
  new Circle(400, 400, 50, 'yellow'),
];

main.groupStepsQueue.push(group1);
main.groupStepsQueue.push(new Group(group2, 2));
