import { Scene } from "phaser";

export class InGameUI extends Scene {
  gameInstance = undefined;

  constructor() {
    super("InGameUI");
  }

  init() {
    if (this.textures.exists("questionImage")) {
      this.textures.remove("questionImage");
    }
  }

  preload() {
    this.load.image("InGameUiBackground", "assets/InGameUiBackground.png");
    this.load.image("ExitButton", "assets/ExitButton.png");
    this.load.image("PlayButton", "assets/PlayButton.png");
    this.load.image("apiBackground", "assets/apiBackground.png");
    this.load.image("GameApi", "assets/GameApi.png");

    // Numbers
    this.load.image("Number1", "assets/Number01.png");
    this.load.image("Number2", "assets/Number2.png");
    this.load.image("Number3", "assets/Number3.png");
    this.load.image("Number4", "assets/Number4.png");
    this.load.image("Number5", "assets/Number5.png");
    this.load.image("Number6", "assets/Number6.png");
    this.load.image("Number7", "assets/Number7.png");
    this.load.image("Number8", "assets/Number8.png");
    this.load.image("Number9", "assets/Number9.png");
  }

  async create() {
    // this.scale.startFullscreen();

    // Set the background
    const inGameUiBackground = this.add.image(960, 540, "InGameUiBackground");
    inGameUiBackground.setDisplaySize(1920, 1070);

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

    // Add loading text
    const loadingText = this.add
      .text(960, 500, "Loading question...", {
        fontSize: "24px",
        fill: "#ffffff",
      })
      .setOrigin(0.5);

    try {
      await this.fetchQuestionData();

      if (this.gameInstance?.question) {
        // Convert the external URL to use our proxy
        const originalUrl = new URL(this.gameInstance.question);
        const proxyUrl = `/image-proxy${originalUrl.pathname}`;

        // Load the image through Phaser's loader
        this.load.image("questionImage", proxyUrl);

        this.load.once("complete", () => {
          loadingText.destroy();

          const questionImage = this.add.image(960, 500, "questionImage");
          questionImage.setOrigin(0.5);

          // Scale image to fit
          const texture = this.textures.get("questionImage");
          const width = texture.getSourceImage().width;
          const height = texture.getSourceImage().height;

          const maxWidth = 800;
          const maxHeight = 600;
          const scaleX = maxWidth / width;
          const scaleY = maxHeight / height;
          const scale = Math.min(scaleX, scaleY);

          questionImage.setScale(scale);
        });

        this.load.once("loaderror", (fileObj) => {
          console.error("Error loading image:", fileObj);
          loadingText.setText("Error loading question image");
        });

        this.load.start();
      } else {
        loadingText.setText("No question available");
      }
    } catch (error) {
      console.error("Error in create():", error);
      loadingText.setText("Error loading question");
    }
  }

  async fetchQuestionData() {
    try {
      const response = await fetch("/api/question");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.gameInstance = await response.json();
      console.log("Fetched question data:", this.gameInstance);
    } catch (error) {
      console.error("Error fetching question:", error);
      throw error;
    }
  }

  startGame() {
    console.log("Play button clicked");
    this.scene.start("Leaderboard");
  }

  exitGame() {
    console.log("Exit button clicked");
    this.scene.start("MainMenu");
  }
}
