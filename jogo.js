console.log('(Kikogamer) Flappy Bird');

const sprites = new Image();
sprites.src = './sprites.png'

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

const background = {
  sourceX: 390,
  sourceY: 0,
  width: 275,
  height: 204,
  x: 0,
  y: canvas.height - 204,

  draw() {
    contexto.fillStyle = '#70c5ce';
    contexto.fillRect(0, 0, canvas.width, canvas.height);

    contexto.drawImage(
      sprites,
      background.sourceX, background.sourceY,
      background.width, background.height,
      background.x, background.y,
      background.width, background.height
    );

    contexto.drawImage(
      sprites,
      background.sourceX, background.sourceY,
      background.width, background.height,
      (background.x + background.width), background.y,
      background.width, background.height
    );
  }
};

const floor = {
  sourceX: 0,
  sourceY: 610,
  width: 224,
  height: 112,
  x: 0,
  y: canvas.height - 112,

  draw() {
    contexto.drawImage(
      sprites,
      floor.sourceX, floor.sourceY,
      floor.width, floor.height,
      floor.x, floor.y,
      floor.width, floor.height
    );

    contexto.drawImage(
      sprites,
      floor.sourceX, floor.sourceY,
      floor.width, floor.height,
      (floor.x + floor.width), floor.y,
      floor.width, floor.height
    );
  }
};

const flappyBird = {
  sourceX: 0,
  sourceY: 0,
  width: 33,
  height: 24,
  x: 10,
  y: 50,
  gravity: 0.25,
  velocity: 0,

  draw() {
    contexto.drawImage(
      sprites,
      flappyBird.sourceX, flappyBird.sourceY, //sprite x,y
      flappyBird.width, flappyBird.height, // size
      flappyBird.x, flappyBird.y, // canvas position
      flappyBird.width, flappyBird.height // draw canvas size
    );
  },

  update() {
    flappyBird.velocity += flappyBird.gravity;
    flappyBird.y += flappyBird.velocity;
  }
};

const messageGetReady = {
  sourceX: 134,
  sourceY: 0,
  width: 174,
  height: 152,
  x: (canvas.width / 2) - 174 / 2,
  y: 50,

  draw() {
    contexto.drawImage(
      sprites,
      messageGetReady.sourceX, messageGetReady.sourceY, 
      messageGetReady.width, messageGetReady.height, 
      messageGetReady.x, messageGetReady.y, 
      messageGetReady.width, messageGetReady.height 
    );
  }
};

let activeScreen = {};

const changeScreen = (newScreen) => activeScreen = newScreen;

const screens = {
  START: {
    click() {
      changeScreen(screens.GAME);
    },
    draw() {
      background.draw();
      flappyBird.draw();
      floor.draw();
      messageGetReady.draw();
    },
    update() {

    }
  }
};

screens.GAME = {
  draw() {
    background.draw();
    flappyBird.draw();
    floor.draw();
  },
  update() {
    flappyBird.update();
  }
}

function loop() {
  
  activeScreen.draw();
  activeScreen.update();
  
  requestAnimationFrame(loop);
};

window.addEventListener('click', function() {
  if (activeScreen.click) {
    activeScreen.click();
  }
});

changeScreen(screens.START);
loop();