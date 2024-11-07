import { Scene } from "phaser";

export class MainMenu extends Scene {
  constructor() {
    super("MainMenu");
  }

  preload() {
    this.load.image("GameMainMenu", "assets/GameMainMenu.png");
    this.load.image("BananaFigures", "assets/BananaFigures.png");
  }

  create() {
    const background = this.add.image(960, 540, "GameMainMenu");
    background.setDisplaySize(1366, 768);

    // Add the title image on top of the background
    const title = this.add.image(630,275, "BananaFigures"); // Position it near the top
    title.setOrigin(0.5, 0.5); // Center the image


    // Optional: Scale title if necessary
    title.setScale(1); // Adjust scale as needed

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
