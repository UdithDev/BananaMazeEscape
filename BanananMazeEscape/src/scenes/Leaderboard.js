import { Scene } from "phaser";

export class Leaderboard extends Scene {
  constructor() {
    super("Leaderboard");
  }

  preload() {
    this.load.image("Leaderboard", "assets/Leaderboard.png");
    this.load.image("LeaderboardTitle", "assets/LeaderboardTitle.png");
    this.load.image("PlayerScoreBg", "assets/PlayerScoreBg.png");
  }

  create() {
    // Set background
    const leaderboardBg = this.add.image(960, 540, "Leaderboard");
    leaderboardBg.setDisplaySize(1366, 768);

    // Leaderboard title
    this.add.image(960, 250, "LeaderboardTitle").setScale(0.6);

    // Player Scores

    this.players = [
      { name: "Player 01", score: 10 },
      { name: "Player 02", score: 8 },
      { name: "Player 03", score: 5 },
      { name: "Player 04", score: 12 },
      { name: "Player 05", score: 10 },
      { name: "Player 06", score: 8 },
      { name: "Player 07", score: 5 },
      { name: "Player 08", score: 12 },
      { name: "Player 01", score: 10 },
      { name: "Player 02", score: 8 },
      { name: "Player 03", score: 5 },
      { name: "Player 04", score: 12 },
      { name: "Player 05", score: 10 },
      { name: "Player 06", score: 8 },
      { name: "Player 07", score: 5 },
      { name: "Player 08", score: 12 },
    ];

    // Create a container to hold leaderboard entries
    this.leaderboardContainer = this.add.container(960, 250); //center of screen
    this.leaderboardContainer.setSize(600, 300); // adjust size as needed

    // Add each player entry as a text object within the container
    this.playerTexts = [];
    for (let i = 0; i < this.players.length; i++) {
      const player = this.players[i];
      const text = this.add.text(0, i * 60, `${player.name}: ${player.score}`, {
        font: "24px Arial",
        color: "#ffffff",
      });
      this.leaderboardContainer.add(text);
      this.playerTexts.push(text);
    }

    // Set a mask to create a scrolling effect
    const maskShape = this.make.graphics();
    maskShape.fillStyle(0xfeec37);
    maskShape.fillRect(960, 490, 400, 300); // Position and size for the mask area
    const mask = maskShape.createGeometryMask();
    this.leaderboardContainer.setMask(mask);

    // Set up input handling for scrolling
    this.scrollAmount = 0; // Initial scroll position
    this.input.on("wheel", (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
      this.scrollLeaderboard(deltaY);
    });

    scrollLeaderboard(deltaY);
    {
      // Calculate the new scroll position
      const maxScroll = this.players.length * 40 - 300; // Adjust based on container height
      this.scrollAmount = Phaser.Math.Clamp(
        this.scrollAmount + deltaY,
        -maxScroll,
        0
      );

      // Update the container's position to scroll
      this.leaderboardContainer.y = 540 + this.scrollAmount;
    }
  }
}
