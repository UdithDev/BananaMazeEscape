import { Scene } from "phaser";

export class MainMenu extends Scene {
  constructor() {
    super("MainMenu");
    this.player;
  }

  preload() {
    this.load.image("GameMainMenu01", "assets/GameMainMenu01.png");
    this.load.image("BananaFigures", "assets/BananaFigures.png");
    this.load.image("PlayButton", "assets/PlayButton.png");
    this.load.image("SettingButton", "assets/SettingButton.png");
    this.load.image("ExitButton", "assets/ExitButton.png");
    this.load.image("GameTitle01", "assets/GameTitle01.png");
    this.load.audio("backgroundMusic", "assets/backgroundMusic.mp3");
    this.load.image("play", "assets/play.png");
    this.load.image("pause", "assets/pause.png");
    this.load.image("Banana", "assets/Banana.png");
  }

  create() {
    // //background
    const background = this.add.image(960, 550, "GameMainMenu01");
    background.setDisplaySize(1920, 1050);

    // // Add the title image
    const gameTitle = this.add.image(750, 200, "GameTitle01");
    gameTitle.setScale(0.7); // Adjust scale as needed

    // // Add bounce animation
    this.tweens.add({
      targets: gameTitle,
      y: 220, // Move slightly downward
      duration: 800, // Duration of the tween in milliseconds
      ease: "Sine.easeInOut",
      yoyo: true, // Make it return to the original position
      repeat: -1, // Loop forever
    });

    //Add play Button
    const playButton = this.add
      .image(940, 750, "PlayButton")
      .setInteractive({ useHandCursor: true });
    playButton.setScale(1);
    playButton.setOrigin(0.5, 0.5);
    playButton.on("pointerdown", () => {
      this.startGame();
    });

    playButton.on("pointerover", () => {
      playButton.setScale(1.1); // Slightly increase the size of the button
    });

    playButton.on("pointerout", () => {
      playButton.setScale(1); // Restore the original size
    });

    // Play background music
    this.backgroundMusic = this.sound.add("backgroundMusic", {
      volume: 0.7, // Adjust volume (0.0 to 1.0)
      loop: true, // Loop the music
    });

    // Add Play/Pause button
    this.isPlaying = false; // To track music state (playing or paused)

    this.musicButton = this.add
      .image(150, 900, "play")
      .setInteractive({ useHandCursor: true });
    this.musicButton.setScale(0.2);

    // Add toggle functionality to the button
    this.musicButton.on("pointerdown", () => {
      this.toggleMusic();
    });

    this.player = this.physics.add
      .image(1650, 0, "Banana", {
        loop: true,
      })
      .setOrigin(0, 0)
      .setScale(0.3);

    // Get the size of the background for the border(That's the chatGPT code)
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

  toggleMusic() {
    if (this.isPlaying) {
      this.backgroundMusic.stop();
      this.musicButton.setTexture("play");
    } else {
      this.backgroundMusic.play();
      this.musicButton.setTexture("pause");
    }
    this.isPlaying = !this.isPlaying;
  }

  // Function to start the game
  startGame() {
    console.log("Play button clicked");
    // Add code to start the game or go to the game scene
    this.backgroundMusic.stop();

    const token = localStorage.getItem("token");

    if (token) {
      this.scene.start("GamePlay");
      return;
    }

    this.scene.start("Login");
  }
}
