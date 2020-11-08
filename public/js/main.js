var stage, w, h, loader;
var zero;

window.addEventListener("load", init);

function init() {
  stage = new createjs.StageGL("testCanvas", {
    transparent: true,
  });

  // grab canvas width and height for later calculations:
  w = stage.canvas.width;
  h = stage.canvas.height;

  manifest = [{ src: "zero_walk.png", id: "zero" }];

  loader = new createjs.LoadQueue(false);
  loader.addEventListener("complete", handleComplete);
  loader.loadManifest(manifest, true, "/img/sprites/");
}

function handleComplete() {
  var spriteSheet = new createjs.SpriteSheet({
    framerate: 30,
    images: [loader.getResult("zero")],
    frames: { regX: 0, height: 58, count: 15, regY: 0, width: 58 },
    animations: {
      walkRight: [0, 3, "walkRight", 0.1],
      walkLeft: [10, 13, "walkLeft", 0.1],
      //   jump: [26, 63, "run"],
    },
  });
  zero = new createjs.Sprite(spriteSheet, "walkRight");
  zero.y = h - zero.getBounds().height;

  console.log("w", w);

  stage.addChild(zero);
  // stage.addEventListener("stagemousedown", handleJumpStart);

  createjs.Ticker.timingMode = createjs.Ticker.RAF;
  createjs.Ticker.addEventListener("tick", tick);
}

var zeroD = 1;

function tick(event) {
  var deltaS = event.delta / 1000;
  // var position = grant.x + 150 * deltaS;
  var position = zero.x + zero.getBounds().width + 150 * deltaS;

  var zeroS = 2;

  if (zeroD === 1) {
    if (position >= w) {
      //   console.log("zeroD to minus 1");
      zeroD = -1;
      zero.gotoAndPlay("walkLeft");
    }
  } else {
    if (position <= 0) {
      zeroD = 1;
      zero.gotoAndPlay("walkRight");
    }
  }

  //   console.log("zeroD", zeroD);
  //   console.log("position", position);
  //   console.log("zeroS", zeroS);
  zero.x += zeroD * zeroS;

  //   var zeroW = zero.getBounds().width * zero.scaleX;

  //   zero.x = position >= w + zeroW ? 0 : position;

  // var grantW = grant.getBounds().width * grant.scaleX;
  //   grant.x = (position >= w + grantW) ? -grantW : position;

  // ground.x = (ground.x - deltaS * 150) % ground.tileW;
  // hill.x = (hill.x - deltaS * 30);
  // if (hill.x + hill.image.width * hill.scaleX <= 0) {
  // 	hill.x = w;
  // }
  // hill2.x = (hill2.x - deltaS * 45);
  // if (hill2.x + hill2.image.width * hill2.scaleX <= 0) {
  // 	hill2.x = w;
  // }

  stage.update(event);
}
