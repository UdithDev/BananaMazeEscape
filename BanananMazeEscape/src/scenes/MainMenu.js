import { Scene } from "phaser";

export class MainMenu extends Scene {
  constructor() {
    super("MainMenu");
  }

  preload() {
    this.load.image("GameMainMenu", "assets/GameMainMenu.png");
    this.load.image("BananaFigures", "assets/BananaFigures.png");
    this.load.image("PlayButton", "assets/PlayButton.png");
    this.load.image("SettingButton", "assets/SettingButton.png");
    this.load.image("ExitButton", "assets/ExitButton.png");
  }

  create() {
    const background = this.add.image(960, 540, "GameMainMenu");
    background.setDisplaySize(1366, 768);

    // Add the title image
    const gameTitle = this.add.image(575, 325, "BananaFigures");
    gameTitle.setScale(0.7); // Adjust scale as needed

    //Add play Button
    const playButton = this.add
      .image(575, 450, "PlayButton")
      .setInteractive({ useHandCursor: true });
    playButton.setScale(0.7);
    playButton.setOrigin(0.5, 0.5);
    playButton.on("pointerdown", () => {
      this.startGame();
    });

    //Add Setting button
    const settingButton = this.add
      .image(575, 575, "SettingButton")
      .setInteractive({ useHandCursor: true });
    settingButton.setScale(0.7);
    settingButton.setOrigin(0.5, 0.5);
    settingButton.on("pointerdown", () => {
      this.openSettings();
    });

    //Add exit button
    const exitButton = this.add
      .image(575, 700, "ExitButton")
      .setInteractive({ useHandCursor: true });
    exitButton.setScale(0.7);
    exitButton.setOrigin(0.5, 0.5);
    exitButton.on("pointerdown", () => {
      this.exitGame();
    });

    // Get the size of the background for the border
    const bgWidth = background.displayWidth;
    const bgHeight = background.displayHeight;

    // Create a border using the Graphics object
    const borderThickness = 10;
    const borderColor = 0xfeec37; //(hex value)

    const border = this.add.graphics();
    border.lineStyle(borderThickness, borderColor, 1);

    border.strokeRect(
      background.x - bgWidth / 2,
      background.y - bgHeight / 2,
      bgWidth, // Width of the border
      bgHeight // Height of the border
    );
  }

  // Function to start the game
  startGame() {
    console.log("Play button clicked");
    // Add code to start the game or go to the game scene
    this.scene.start("InGameUI");
  }

  openSettings() {
    console.log("Settings button clicked");
    // Add code to open settings or go to the settings scene
  }

  exitGame() {
    console.log("Exit button clicked");
    this.scene.start("Login");
  }
}
