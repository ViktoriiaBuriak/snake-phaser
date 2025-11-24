import { Scene } from "phaser";

export class Preloader extends Scene {
  constructor() {
    super("Preloader");
  }

  preload() {
    this.load.image("background", "assets/snake_bg.jpg");
    this.load.image("apple", "assets/snake_apple.png");
    this.load.image("head", "assets/snake_heads.png");
  }

  create() {
    this.scene.start("MainMenu");
  }
}
