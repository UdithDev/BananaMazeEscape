import { Scene } from "phaser";

export class InGameUI extends Scene {
  gameInstance = undefined;

  constructor() {
    super("InGameUI");
  }

  preload() {
    this.load.image("InGameUiBackground", "assets/InGameUiBackground.png");
    this.load.image("ExitButton", "assets/ExitButton.png");
    this.load.image("PlayButton", "assets/PlayButton.png");
    this.load.image("apiBackground", "assets/apiBackground.png");
    this.load.image("GameApi", "assets/GameApi.png");
    this.load.image("Number01", "assets/Number01.png");
    this.load.image("Number01", "assets/Number2.png");
    this.load.image("Number01", "assets/Number3.png");
    this.load.image("Number01", "assets/Number4.png");
    this.load.image("Number01", "assets/Number5.png");
    this.load.image("Number01", "assets/Number6.png");
    this.load.image("Number01", "assets/Number7.png");
    this.load.image("Number01", "assets/Number8.png");
    this.load.image("Number01", "assets/Number9.png");
    
  }

  async create() {
    this.scale.startFullscreen();

    // Set the background
    const inGameUiBackground = this.add.image(0, 0, "InGameUiBackground");
    inGameUiBackground.setOrigin(0); 
    inGameUiBackground.setDisplaySize(this.scale.width, this.scale.height);

    // Add Play button
    const playButton = this.add
      .image(1450, 850, "PlayButton")
      .setInteractive({ useHandCursor: true });
    playButton.setScale(0.7);
    playButton.setOrigin(0.5, 0.5);
    playButton.on("pointerdown", () => {
      this.startGame();
    });

    // Add Exit button
    const exitButton = this.add
      .image(575, 850, "ExitButton")
      .setInteractive({ useHandCursor: true });
    exitButton.setScale(0.7);
    exitButton.setOrigin(0.5, 0.5);
    exitButton.on("pointerdown", () => {
      this.exitGame();
    });

    // Fetch and display the question (image from the API)
    await this.fetchImage();
    if (this.gameInstance && this.gameInstance.question) {
      const questionImageUrl = this.gameInstance.question;
      this.load.once("complete", () => {
        // Create the image and adjust its size
        const questionImage = this.add.image(960, 500, "questionImage");
        questionImage.setOrigin(0.5);

        // Get the actual dimensions of the loaded image
        const texture = this.textures.get("questionImage");
        const width = texture.getSourceImage().width;
        const height = texture.getSourceImage().height;

        console.log("Loaded image dimensions:", { width, height });

        // Dynamically scale the image to fit a reasonable size
        const maxWidth = 800; 
        const maxHeight = 600; 
        const scaleX = maxWidth / width;
        const scaleY = maxHeight / height;
        const scale = Math.min(scaleX, scaleY); 

        questionImage.setScale(scale);
      });

      this.load.image("questionImage", questionImageUrl);
      this.load.start();
    }
  }

  async fetchImage() {
    try {
      const response = await fetch("https://marcconrad.com/uob/banana/api.php");
      if (response.ok) {
        this.gameInstance = await response.json();
        console.log("Fetched question image URL:", this.gameInstance.question);
      } else {
        console.error("Failed to fetch the image:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching the image:", error);
    }
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
