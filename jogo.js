console.log('(Kikogamer) Flappy Bird');

let frames = 0;
const hitSound = new Audio();
hitSound.src = './efeitos/hit.wav';

const fallSound = new Audio();
fallSound.src = './efeitos/caiu.wav';

const jumpSound = new Audio();
jumpSound.src = './efeitos/pulo.wav';

const gameAudio = new Audio();
gameAudio.src = './efeitos/game-music.mp3';

const pointSound = new Audio();
pointSound.src = './efeitos/ponto.wav';

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

const scoreElement = document.getElementById('score');

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

function buildFloor() {
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
    },
    update() {
      const floorMovement = 1;
      const repeatIn = floor.width / 2;
      const movement = floor.x - floorMovement;

      floor.x = movement % repeatIn;
    }
  };

  return floor;
}

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
    gravity: 0.2,
    velocity: 0.0,
    jumpSize: 4.0,
    activeFrame: 0,

    movements: [
      { sourceX: 0, sourceY: 0 },
      { sourceX: 0, sourceY: 26 },
      { sourceX: 0, sourceY: 52 }
    ],

    draw() {
      flappyBird.updateActiveFrame();
      
      const { sourceX, sourceY } = flappyBird.movements[flappyBird.activeFrame];

      contexto.drawImage(
        sprites,
        sourceX, sourceY, //sprite x,y
        flappyBird.width, flappyBird.height, // size
        flappyBird.x, flappyBird.y, // canvas position
        flappyBird.width, flappyBird.height // draw canvas size
      );
    },
  
    jump() {
      jumpSound.play();
      flappyBird.velocity = - flappyBird.jumpSize;
    },
  
    update() {
      if (clashedWithFloor(flappyBird, globais.floor)) {
        fallSound.play();

        setTimeout(() => changeScreen(screens.START), 500);        
        return;
      };
  
      flappyBird.velocity += flappyBird.gravity;
      flappyBird.y += flappyBird.velocity;
    },

    updateActiveFrame() {
      const frameInterval = 10;

      if (frames % frameInterval === 0) {
        const incrementBase = 1;
        const increment = incrementBase + flappyBird.activeFrame;
        const repeatBase = flappyBird.movements.length;
        flappyBird.activeFrame = increment % repeatBase;
      }
    }
  };

  return flappyBird;
};

function buildTubes() {
  const tubes = {
    floor: {
      sourceX: 0,
      sourceY: 169
    },
    height: 400,
    pairs: [],
    sky: {
      sourceX: 52,
      sourceY: 169
    },
    space: 80,
    width: 52,
    
    clashedWithFlappyBird(pair) {
      const flappyBirdHead = globais.flappyBird.y;
      const flappyBirdFoot = globais.flappyBird.y + globais.flappyBird.height;

      if (globais.flappyBird.x >= pair.x) {
        
        if (flappyBirdHead <= pair.skyTube.y) {
          return true;
        }

        if (flappyBirdFoot >= pair.floorTube.y) {
          return true;
        }
      }
      
      return false;
    },

    draw() {
      
      tubes.pairs.forEach(function (pair) {
        const yRandom = pair.y;
        const spacingBetweenTubes = 90;
  
        const skyTubeX = pair.x;
        const skyTubeY = yRandom;
        
        contexto.drawImage(
          sprites,
          tubes.sky.sourceX, tubes.sky.sourceY,
          tubes.width, tubes.height,
          skyTubeX, skyTubeY,
          tubes.width, tubes.height
        );
  
        const floorTubeX = pair.x;
        const floorTubeY = tubes.height + spacingBetweenTubes + yRandom;
  
        contexto.drawImage(
          sprites,
          tubes.floor.sourceX, tubes.floor.sourceY,
          tubes.width, tubes.height,
          floorTubeX, floorTubeY,
          tubes.width, tubes.height
        );

        pair.skyTube = {
          x: skyTubeX,
          y: tubes.height + skyTubeY
        },

        pair.floorTube = {
          x: floorTubeX,
          y: floorTubeY
        }
      });

    },

    update() {
      const cemFramesPassed = frames % 100 === 0;

      if (cemFramesPassed) {
        tubes.pairs.push({
          x: canvas.width,
          y: -150 * (Math.random() + 1)      
        });
      };

      tubes.pairs.forEach(function (pair) {
        pair.x += -2;

        if (tubes.clashedWithFlappyBird(pair)) {
          hitSound.play();
          changeScreen(screens.START);
        };

        if (pair.x + tubes.width <= 0) {
          globais.score.value += 10;
          pointSound.play();
          tubes.pairs.shift();
        }
      });
    }
  }

  return tubes;
};

function buildScore() {

  const score = {
    value: 0,
  
    draw() {
      contexto.fillStyle="#FFF";
      contexto.font="35px Ubuntu";
      contexto.textAlign="right";
      contexto.textBaseline="top";
      contexto.fillText(score.value.toString().padStart(6, '0'), 320, 0); 
    }
  }

  return score;
}

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
  if (activeScreen.finalize) {
    activeScreen.finalize();
  }; 

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
      globais.tubes.draw();
      globais.floor.draw();
      messageGetReady.draw();
    },
    initialize() {
      globais.flappyBird = buildFlappyBird();
      globais.floor = buildFloor();
      globais.tubes = buildTubes();
      globais.score = buildScore();
    },
    update() {
      globais.floor.update();
    }
  }
};

screens.GAME = {
  click() {
    globais.flappyBird.jump();
  },
  finalize() {
    gameAudio.pause();
    gameAudio.currentTime = 0;
  },
  initialize() {
    gameAudio.loop = true;
    gameAudio.play();
  },
  draw() {
    background.draw();
    globais.tubes.draw();
    globais.floor.draw();
    globais.flappyBird.draw();
    globais.score.draw();
  },
  update() {
    globais.tubes.update();
    globais.floor.update();
    globais.flappyBird.update();
  }
}

function loop() {
  
  activeScreen.draw();
  activeScreen.update();

  frames += 1;
  
  requestAnimationFrame(loop);
};

window.addEventListener('click', function() {
  if (activeScreen.click) {
    activeScreen.click();
  }
});

changeScreen(screens.START);
loop();