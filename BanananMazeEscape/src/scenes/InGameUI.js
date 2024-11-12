import { Scene } from "phaser";

export class InGameUI extends Scene {
  constructor() {
    super("InGameUI");
  }

  preload() {
    this.load.image("InGameUiBackground", "assets/InGameUiBackground.png");
    this.load.image("ExitButton", "assets/ExitButton.png");
    this.load.image("PlayButton", "assets/PlayButton.png");
  }

  create() {
    const inGameUiBackground = this.add.image(960, 540, "InGameUiBackground");
    inGameUiBackground.setDisplaySize(1366, 768);

    const playButton = this.add
      .image(1450, 850, "PlayButton")
      .setInteractive({ useHandCursor: true });
    playButton.setScale(0.7);
    playButton.setOrigin(0.5, 0.5);
    playButton.on("pointerdown", () => {
      this.startGame();
    });

    const exitButton = this.add
      .image(575, 850, "ExitButton")
      .setInteractive({ useHandCursor: true });
      exitButton.setScale(0.7);
    exitButton.setOrigin(0.5, 0.5);
    exitButton.on("pointerdown", () => {
      this.exitGame();
    });
  }

  startGame() {
    console.log("Play button clicked");
    // Add code to start the game or go to the game scene
    this.scene.start("Leaderboard");
  }

  exitGame() {
    console.log("Exit button clicked");
   this.scene.start("MainMenu");
  }
}
