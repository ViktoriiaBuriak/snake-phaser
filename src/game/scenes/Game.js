import { Scene } from "phaser";

export class Game extends Scene {
  constructor() {
    super("Game");
  }

  create() {
    const gridSize = 64;
    const gridCount = 15;
    const offset = gridSize / 2;

    this.gridCount = gridCount;
    this.gridSize = gridSize;
    this.offset = offset;

    this.bg = this.add.image(0, 0, "background").setOrigin(0);

    const snakeX = Phaser.Math.Between(0, gridCount - 1) * gridSize + offset;
    const snakeY = Phaser.Math.Between(0, gridCount - 1) * gridSize + offset;

    this.snake = this.add.image(snakeX, snakeY, "head").setOrigin(0.5);

    let appleX, appleY;
    do {
      appleX = Phaser.Math.Between(0, gridCount - 1) * gridSize + offset;
      appleY = Phaser.Math.Between(0, gridCount - 1) * gridSize + offset;
    } while (appleX === snakeX && appleY === snakeY);

    this.apple = this.add.image(appleX, appleY, "apple").setOrigin(0.5);

    this.direction = "down";
    this.nextDirection = "down";
    this.snakeBody = [];
    this.shouldGrow = false;
    this.cursors = this.input.keyboard.createCursorKeys();

    this.snake.setRotation(0);

    this.moveTimer = this.time.addEvent({
      delay: 400,
      callback: this.moveSnake,
      callbackScope: this,
      loop: true,
    });
  }

  moveSnake() {
    let growX, growY;
    if (this.shouldGrow) {
      if (this.snakeBody.length > 0) {
        const lastSegment = this.snakeBody[this.snakeBody.length - 1];
        growX = lastSegment.x;
        growY = lastSegment.y;
      } else {
        growX = this.snake.x;
        growY = this.snake.y;
      }
    }

    const prevX = this.snake.x;
    const prevY = this.snake.y;

    this.direction = this.nextDirection;

    let nextX = this.snake.x;
    let nextY = this.snake.y;

    switch (this.direction) {
      case "up":
        nextY -= this.gridSize;
        break;
      case "down":
        nextY += this.gridSize;
        break;
      case "left":
        nextX -= this.gridSize;
        break;
      case "right":
        nextX += this.gridSize;
        break;
    }

    const min = this.offset;
    const max = this.gridSize * (this.gridCount - 1) + this.offset;

    if (nextX < min || nextX > max || nextY < min || nextY > max) {
      this.moveTimer.paused = true;
      this.scene.start("GameOver");
      return;
    }

    this.snake.x = nextX;
    this.snake.y = nextY;

    for (let i = this.snakeBody.length - 1; i > 0; i--) {
      this.snakeBody[i].x = this.snakeBody[i - 1].x;
      this.snakeBody[i].y = this.snakeBody[i - 1].y;
    }

    if (this.snakeBody.length > 0) {
      this.snakeBody[0].x = prevX;
      this.snakeBody[0].y = prevY;
    }

    if (this.snake.x === this.apple.x && this.snake.y === this.apple.y) {
      this.shouldGrow = true;

      let appleX, appleY, isCollision;
      do {
        appleX =
          Phaser.Math.Between(0, this.gridCount - 1) * this.gridSize +
          this.offset;
        appleY =
          Phaser.Math.Between(0, this.gridCount - 1) * this.gridSize +
          this.offset;

        isCollision = this.snake.x === appleX && this.snake.y === appleY;

        for (const segment of this.snakeBody) {
          if (appleX === segment.x && appleY === segment.y) {
            isCollision = true;
            break;
          }
        }
      } while (isCollision);

      this.apple.setPosition(appleX, appleY);
    }

    if (this.shouldGrow) {
      const newSegment = this.add
        .image(growX, growY, "segment")
        .setOrigin(0.5)
        .setVisible(false);
      this.snakeBody.push(newSegment);
      newSegment.setVisible(true); //доопрацювання

      this.shouldGrow = false;
    }

    let targetAngle;

    switch (this.direction) {
      case "up":
        targetAngle = Math.PI;
        break;
      case "down":
        targetAngle = 0;
        break;
      case "left":
        targetAngle = Math.PI / 2;
        break;
      case "right":
        targetAngle = -Math.PI / 2;
        break;
    }

    this.snake.setRotation(targetAngle);

    // this.tweens.add({
    //   targets: this.snake,
    //   rotation: targetAngle,
    //   duration: 100,
    //   ease: "Power1",
    // });

    for (let i = 1; i < this.snakeBody.length; i++) {
      if (
        this.snakeBody[i].x === this.snake.x &&
        this.snakeBody[i].y === this.snake.y
      ) {
        this.moveTimer.paused = true;
        this.scene.start("GameOver");
        return;
      }
    }
  }

  update() {
    if (this.cursors.left.isDown && this.direction !== "right")
      this.nextDirection = "left";
    if (this.cursors.right.isDown && this.direction !== "left")
      this.nextDirection = "right";
    if (this.cursors.up.isDown && this.direction !== "down")
      this.nextDirection = "up";
    if (this.cursors.down.isDown && this.direction !== "up")
      this.nextDirection = "down";
  }
}
