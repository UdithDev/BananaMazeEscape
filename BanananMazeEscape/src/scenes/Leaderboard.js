import { Scene } from "phaser";

export class Leaderboard extends Scene {
  constructor() {
    super("Leaderboard");
    this.baseUrl = "http://localhost:3000";
  }

  preload() {
    this.load.image("Leaderboard", "assets/Leaderboard.png");
    this.load.image("LeaderboardTitle", "assets/LeaderboardTitle.png");
    this.load.image("PlayerScoreBg", "assets/PlayerScoreBg.png");
    this.load.image("RetryButton", "assets/RetryButton.png");
  }

  async create() {
    const leaderboardBg = this.add.image(960, 540, "Leaderboard");
    leaderboardBg.setDisplaySize(1920, 1080);

    const title = this.add.image(960, 200, "LeaderboardTitle").setScale(0.8);

    try {
      const response = await fetch(`${this.baseUrl}/leaderboard`);
      if (!response.ok) throw new Error("Failed to fetch leaderboard");
      this.players = (await response.json())
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      this.players = [];
    }

    const contentWidth = 800;
    const contentHeight = 500;
    const contentX = 960 - contentWidth / 2;
    const contentY = 300;

    // Create background panel
    const panel = this.add.graphics();
    panel.fillStyle(0x000000, 0.7);
    panel.fillRoundedRect(contentX, contentY, contentWidth, contentHeight, 20);

    // Create scrollable container for entries
    const scrollContent = this.add.container(contentX, contentY);

    // Headers
    const headers = ["RANK", "PLAYER", "SCORE"];
    const headerX = [100, 300, 600];

    headers.forEach((header, i) => {
      this.add
        .text(contentX + headerX[i], contentY + 30, header, {
          fontSize: "28px",
          fontFamily: "Arial",
          color: "#FFD700",
        })
        .setOrigin(0.5);
    });

    // Player entries
    this.players.forEach((player, index) => {
      const yPos = contentY + 100 + index * 60;

      // Entry background
      const entryBg = this.add.graphics();
      entryBg.fillStyle(index < 3 ? 0xffd700 : 0x4a4a4a, 0.2);
      entryBg.fillRoundedRect(
        contentX + 20,
        yPos - 20,
        contentWidth - 40,
        40,
        10
      );

      // Entry data
      this.add
        .text(contentX + headerX[0], yPos, `#${index + 1}`, {
          fontSize: "24px",
          color: index < 3 ? "#FFD700" : "#FFFFFF",
        })
        .setOrigin(0.5);

      this.add
        .text(contentX + headerX[1], yPos, player.username, {
          fontSize: "24px",
          color: "#FFFFFF",
        })
        .setOrigin(0.5);

      this.add
        .text(contentX + headerX[2], yPos, player.score.toString(), {
          fontSize: "24px",
          color: "#FFD700",
        })
        .setOrigin(0.5);

      scrollContent.add(entryBg);
    });

    // Retry button
    const retryButton = this.add
      .image(960, 820, "RetryButton")
      .setScale(0.8)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.scene.start("GamePlay"))
      .on("pointerover", () => retryButton.setScale(0.85))
      .on("pointerout", () => retryButton.setScale(0.8));

    // Simple mouse wheel scrolling
    this.input.on("wheel", (pointer, gameObjects, deltaX, deltaY) => {
      if (deltaY > 0 && scrollContent.y > contentY - this.players.length * 60) {
        scrollContent.y -= 20;
      } else if (deltaY < 0 && scrollContent.y < contentY) {
        scrollContent.y += 20;
      }
    });
  }
}
