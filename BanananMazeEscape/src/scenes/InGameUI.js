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
    const inGameUiBackground = this.add.image(960, 550, "InGameUiBackground");
    inGameUiBackground.setDisplaySize(1920, 1050);

    // Add Play button
    const playButton = this.add
      .image(1650, 950, "PlayButton")
      .setInteractive({ useHandCursor: true });
    playButton.setScale(0.7);
    playButton.setOrigin(0.5, 0.5);
    playButton.on("pointerdown", () => {
      this.startGame();
    });

    // Add Exit button
    const exitButton = this.add
      .image(300, 950, "ExitButton")
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
        fill: "#000000",
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

          const questionImage = this.add.image(960, 400, "questionImage");
          questionImage.setOrigin(0.5);

          // Scale image to fit
          const texture = this.textures.get("questionImage");
          const width = texture.getSourceImage().width;
          const height = texture.getSourceImage().height;

          const maxWidth = 1000;
          const maxHeight = 900;
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

    //Enter the missing digit
    this.add.dom(700, 800).createFromHTML(
      `<p style=" color: #000000;
        font-size:50px;
        ">Enter the missing digit: </p>`
    );
    this.digitInput = this.add.dom(1000, 800).createFromHTML(
      `<input type="text" name="" placeholder="" 
         style="
           padding: 20px; 
           font-size: 20px; 
           width: 50px; 
           height:50px
           border-radius: 15px; 
           border: 2px solid #ccc; 
           background-color: #FFFF00;
           color: #000000;
         ">`
    );

    const sendButton = this.add.dom(1200, 800).createFromHTML(
      `<Button style=" cursor:pointer; padding:20px; font-size: 20px; width:100px; height:70px; background-color:#FFFF00;  border-radius: 15px; 
           border: 2px solid #ccc; color:#000000">Send</Button>`
    );

    console.log("Solution", this.gameInstance.solution);
    sendButton.node.addEventListener("click", () => {
      const inputValue = this.digitInput.node.querySelector("input").value;
      if (inputValue == this.gameInstance.solution) {
        console.log("Correct Solution!");
        this.scene.restart();
      } else {
        console.log("Wrong");
        // Show game over popup
        this.createGameOverPopup();
      }
      this.digitInput.node.querySelector("input").value = "";
    });
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

  // Thats code given by Claude AI
  createGameOverPopup() {
    //Create a full screen overlay
    const overlay = this.add.rectangle(
      0,
      0,
      this.scale.width,
      this.scale.height,
      0x000000,
      0.5
    );
    overlay.setOrigin(0);
    overlay.setDepth(1000);

    //create popup container
    const popupWidth = 600;
    const popupHeight = 400;

    const popup = this.add.container(
      this.scale.width / 2,
      this.scale.height / 2
    );
    popup.setDepth(1001);

    // Popup background
    const popupBg = this.add.rectangle(0, 0, popupWidth, popupHeight, 0xffffff);

    popupBg.setStrokeStyle(4, 0xff0000);
    popupBg.setOrigin(0.5);

    // Game Over Text
    const gameOverText = this.add.text(0, -100, "GAME OVER", {
      fontSize: "64px",
      color: "#FF0000",
      fontStyle: "bold",
      fontFamily: "Arial",
    });
    gameOverText.setOrigin(0.5);

    // Try Again Button
    const tryAgainButton = this.add.rectangle(0, 50, 250, 80, 0xff0000);
    tryAgainButton.setInteractive({ useHandCursor: true });

    const tryAgainText = this.add.text(0, 50, "Try Again", {
      fontSize: "32px",
      color: "#FFFFFF",
      fontFamily: "Arial",
    });
    tryAgainText.setOrigin(0.5);

    // Add elements to popup container
    popup.add([popupBg, gameOverText, tryAgainButton, tryAgainText]);

    //Animate popup entrance
    this.tweens.add({
      targets: popup,
      scaleX: 0,
      scaleY: 0,
      duration: 0,

      onCompolete: () => {
        this.tweens.add({
          targets: popup,
          scaleX: 1,
          scaleY: 1,
          duration: 400,
          ease: "Back.easeOut",
        });
      },
    });

    // Add click event to try again button
    tryAgainButton.on("pointerdown", () => {
      // Destroy popup and overlay
      popup.destroy();
      overlay.destroy();

      // Restart the scene
      this.scene.restart();
    });
    return popup;
  }
}
