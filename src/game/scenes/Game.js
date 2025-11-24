import { Scene } from "phaser";

export class Game extends Scene {
  constructor() {
    super("Game");
  }

  create() {
    this.bg = this.add.image(0, 0, "background").setOrigin(0);
    this.snake = this.add.image(100, 100, "head")
    this.apple =  this.add.image(166, 166, "apple")
  }
}
