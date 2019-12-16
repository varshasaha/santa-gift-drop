import Chimney from "./chimney.png";
import Santa from "./santa.png";
import Clouds from "./clouds.png";
import Gift from "./gift.jpeg";

class Main {
  constructor() {
    this.getCanvasContext();
    this.init();
    const coin = document.getElementById("coin");
    coin.style.transition = "transform 0.2s ease-out";
    coin.addEventListener("transitionend", () => {
      coin.style.transform = "scale(1)";
    });
    this.scoreEl = document.getElementById("score");
    this.score = 0;
  }

  init() {
    this.prevX = 300;
    this.santaDirection = 5;

    // chimney on canvas
    this.chimneyImg = new Image();
    this.chimneyImg.crossOrigin = "Anonymous";
    this.chimneyImg.src = Chimney;
    this.chimneyImg.onload = () => {
      this.chimneyImg.width = 50;
      this.chimneyImg.height = 50;
      this.drawChimney(this.prevX);
      this.moveChimney();
    };

    // santa image on canvas
    this.santaImg = new Image();
    this.santaImg.crossOrigin = "Anonymous";
    this.santaImg.src = Santa;
    this.santaImg.onload = () => {
      this.drawSanta();
      this.moveSanta();
    };

    // clouds on canvas
    this.prevCloud = 300;
    this.cloudImg = new Image();
    this.cloudImg.crossOrigin = "Anonymous";
    this.cloudImg.src = Clouds;
    this.cloudImg.onload = () => {
      this.cloudImg.width = 50;
      this.cloudImg.height = 50;
      this.drawClouds(this.prevCloud);
      this.moveClouds();
    };

    // load gift image
    this.giftImg = new Image();
    this.giftImg.crossOrigin = "Anonymous";
    this.giftImg.src = Gift;
    this.giftVertical = 30;
  }

  getCanvasContext() {
    this.canvas = document.getElementById("canvas");
    this.canvasContext = this.canvas.getContext("2d");

    this.santaCanvas = document.getElementById("santa");
    this.santaContext = this.santaCanvas.getContext("2d");
    this.santaCanvas.addEventListener("click", () => {
      this.giftVertical = 30;
      this.dropPresent();
    });
  }

  drawChimney(x) {
    // drawing chimney
    this.canvasContext.clearRect(this.prevX, 100, 50, 50);
    this.canvasContext.clearRect(this.prevX + 150, 100, 50, 50);
    this.canvasContext.clearRect(this.prevX + 300, 100, 50, 50);
    this.canvasContext.drawImage(this.chimneyImg, x, 100, 50, 50);
    this.canvasContext.drawImage(this.chimneyImg, x + 150, 100, 50, 50);
    this.canvasContext.drawImage(this.chimneyImg, x + 300, 100, 50, 50);
    this.prevX = x;
    this.moveChimney();
  }

  drawClouds(x) {
    // drawing chimney
    this.canvasContext.clearRect(this.prevCloud, 30, 50, 50);
    this.canvasContext.clearRect(this.prevCloud + 150, 30, 50, 50);
    this.canvasContext.clearRect(this.prevCloud + 300, 30, 50, 50);
    this.canvasContext.drawImage(this.cloudImg, x, 30, 50, 50);
    this.canvasContext.drawImage(this.cloudImg, x + 150, 30, 50, 50);
    this.canvasContext.drawImage(this.cloudImg, x + 300, 30, 50, 50);
    this.prevCloud = x;
    this.moveClouds();
  }

  drawSanta() {
    this.santaContext.clearRect(
      100,
      this.santaDirection,
      this.santaImg.width / 2,
      this.santaImg.height / 2
    );

    this.santaCanvas.width = this.santaImg.width;
    this.santaCanvas.height = this.santaImg.height;
    this.santaContext.drawImage(
      this.santaImg,
      100,
      this.santaDirection,
      this.santaImg.width / 2,
      this.santaImg.height / 2
    );
    if (this.santaDirection === 5) {
      this.santaDirection = 0;
    } else {
      this.santaDirection = 5;
    }
  }

  moveSanta() {
    setInterval(() => {
      this.drawSanta();
    }, 400);
  }

  moveChimney() {
    requestAnimationFrame(() => {
      if (this.prevX < -350) {
        this.prevX = 300;
      }
      this.drawChimney(this.prevX - 0.5);
    });
  }

  moveClouds() {
    requestAnimationFrame(() => {
      if (this.prevCloud < -350) {
        this.prevCloud = 300;
      }
      this.drawClouds(this.prevCloud - 0.2);
    });
  }

  drawAndMovePresent(y) {
    this.canvasContext.clearRect(10, this.giftVertical, 20, 20);
    this.canvasContext.drawImage(this.giftImg, 10, y, 20, 20);
    this.giftVertical = y;
    this.canvasContext.restore();
    this.dropPresent();
  }

  dropPresent() {
    requestAnimationFrame(() => {
      const isColliding = this.checkBoundaryCollision();
      if (this.giftVertical < 120 && !isColliding) {
        this.drawAndMovePresent(this.giftVertical + 0.8);
      } else {
        this.canvasContext.clearRect(10, 120, 20, 20);
      }
    });
  }

  checkBoundaryCollision() {
    const collisionBox1 = 30 >= this.prevX && 30 <= this.prevX + 50;
    const collisionBox2 = 30 >= this.prevX + 150 && 30 <= this.prevX + 200;
    const collisionBox3 = 30 >= this.prevX + 300 && 30 <= this.prevX + 350;
    if (
      this.giftVertical + 20 >= 120 &&
      (collisionBox1 || collisionBox2 || collisionBox3)
    ) {
      this.giftVertical = 30;
      coin.style.transform = "scale(2)";
      this.score++;
      this.scoreEl.innerText = this.score;
      return true;
    }
  }
}

new Main();
