var stage, w, h, loader;
var zero, tooltip, tooltipText;

window.addEventListener("load", initialize);

function initialize() {
  var socket = io();

  socket.on("avatar:message", (message) => {
    tooltipText.text = message;
  });
  init();
}

function init() {
  stage = new createjs.Stage("testCanvas");

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

  tooltip = new createjs.Container();
  var tooltipBg = new createjs.Shape();

  tooltipText = new createjs.Text("Hello world", "20px Arial");
  tooltipBg.graphics
    .beginFill("#FFFFFF")
    .drawRect(
      0,
      0,
      tooltipText.getBounds().width + 30,
      tooltipText.getBounds().height + 10
    );

  tooltip.addChild(tooltipBg, tooltipText);

  //   var boundsTooltip = tooltip.getBounds();
  //   tooltip.cache(
  //     boundsTooltip.x,
  //     boundsTooltip.y,
  //     boundsTooltip.width,
  //     boundsTooltip.height
  //   );

  stage.addChild(zero, tooltip);
  // stage.addEventListener("stagemousedown", handleJumpStart);

  createjs.Ticker.timingMode = createjs.Ticker.RAF;
  createjs.Ticker.addEventListener("tick", tick);

  //   stage.update();
}

var zeroD = 1;

function tick(event) {
  var deltaS = event.delta / 1000;
  // var position = grant.x + 150 * deltaS;
  var position = zero.x + zero.getBounds().width + 150 * deltaS;

  var zeroS = 0.5;

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
  //   console.log(tooltipText.getBounds().height);
  zero.x += zeroD * zeroS;
  tooltip.x = zero.x;
  tooltip.y = h - zero.getBounds().height - tooltipText.getBounds().height;

  //   tooltipText.text = "érfdregz";
  //   var boundsTooltip = tooltipText.getBounds();
  //   tooltipText.cache(
  //     boundsTooltip.x,
  //     boundsTooltip.y,
  //     boundsTooltip.width,
  //     boundsTooltip.height
  //   );

  //   tooltip.update();

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
