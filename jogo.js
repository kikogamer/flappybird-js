console.log('(Kikogamer) Flappy Bird');

const hitSound = new Audio();
hitSound.src = './efeitos/hit.wav';

const sprites = new Image();
sprites.src = './sprites.png';

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

const clashedWithFloor = (flappyBird, floor) => {
  const flappyBirdY = flappyBird.y + flappyBird.height;
  
  if (flappyBirdY >= floor.y) {
    return true;
  };

  return false;
};

function buildFlappyBird() {
  const flappyBird = {
    sourceX: 0,
    sourceY: 0,
    width: 33,
    height: 24,
    x: 10,
    y: 50,
    gravity: 0.25,
    velocity: 0.0,
    jumpSize: 4.6,
  
    draw() {
      contexto.drawImage(
        sprites,
        flappyBird.sourceX, flappyBird.sourceY, //sprite x,y
        flappyBird.width, flappyBird.height, // size
        flappyBird.x, flappyBird.y, // canvas position
        flappyBird.width, flappyBird.height // draw canvas size
      );
    },
  
    jump() {
      flappyBird.velocity = - flappyBird.jumpSize;
    },
  
    update() {
      if (clashedWithFloor(flappyBird, floor)) {
        hitSound.play();

        setTimeout(() => changeScreen(screens.START), 500);        
        return;
      };
  
      flappyBird.velocity += flappyBird.gravity;
      flappyBird.y += flappyBird.velocity;
    }
  };

  return flappyBird;
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

const globais = {};
let activeScreen = {};

const changeScreen = (newScreen) => {
  activeScreen = newScreen;

  if (activeScreen.initialize) {
    activeScreen.initialize();
  };
};

const screens = {
  START: {
    click() {
      changeScreen(screens.GAME);
    },
    draw() {
      background.draw();
      globais.flappyBird.draw();
      floor.draw();
      messageGetReady.draw();
    },
    initialize() {
      globais.flappyBird = buildFlappyBird();
    },
    update() {

    }
  }
};

screens.GAME = {
  click() {
    globais.flappyBird.jump();
  },
  draw() {
    background.draw();
    globais.flappyBird.draw();
    floor.draw();
  },
  update() {
    globais.flappyBird.update();
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