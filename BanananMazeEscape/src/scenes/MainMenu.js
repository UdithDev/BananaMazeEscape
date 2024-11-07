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
    const PlayButton = this.add.image(575, 450, "PlayButton").setInteractive();
    PlayButton.setScale(0.7);
    PlayButton.setOrigin(0.5, 0.5);
    const settinButton = this.add.image(575, 575, "SettingButton");
    const exitButton = this.add.image(575, 700, "ExitButton");

    // Optional: Scale title if necessary

    settinButton.setScale(0.7);
    exitButton.setScale(0.7);

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
}
