import { Scene } from "phaser";

export class InGameUI extends Scene {
  constructor() {
    super("InGameUI");
  }

  preload() {
    this.load.image("InGameUiBackground", "assets/InGameUiBackground.png");
  }

  create() {
    const inGameUiBackground = this.add.image(960, 540, "InGameUiBackground");
    inGameUiBackground.setDisplaySize(1366, 768);
  }


}
