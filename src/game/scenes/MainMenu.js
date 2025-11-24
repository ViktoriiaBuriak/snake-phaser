import { Scene } from "phaser";

export class MainMenu extends Scene {
  constructor() {
    super("MainMenu");
  }

  create() {
    this.cameras.main.setBackgroundColor(0x48bb4a);
    this.add.image(450, 300, "head");
    this.add.image(510, 300, "apple");

    this.add
      .text(this.scale.width / 2, this.scale.height / 2, "Start", {
        fontFamily: "Arial Black",
        fontSize: 64,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5)
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", () => this.startGame());
  }
  startGame() {
    this.scene.start("Game");
  }
}
