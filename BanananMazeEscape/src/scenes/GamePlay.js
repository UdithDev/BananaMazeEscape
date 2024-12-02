import { Scene } from "phaser";
var player;
var platforms;
var cursors;
var stars;
var score = 0;
var scoreText;
var bombs;
var gameOver = false;

export class GamePlay extends Scene {
  constructor() {
    super("GamePlay");
    this.gameInstance = null;
  }

  preload() {
    this.load.image("sky", "assets/sky.png");
    this.load.image("ground", "assets/platform.png");
    this.load.image("star", "assets/star.png");
    this.load.image("bomb", "assets/bomb.png");
    this.load.spritesheet("dude", "assets/dude.png", {
      frameWidth: 32,
      frameHeight: 48,
    });

    this.load.image("apiBackground", "assets/apiBackground.png");
    this.load.image("GameApi", "assets/GameApi.png");
  }

  async create() {
    this.add.image(960, 550, "sky").setDisplaySize(1920, 1080);
    this.add.image(960, 550, "star").setScale(1.5);

    platforms = this.physics.add.staticGroup();

    platforms.create(960, 1050, "ground").setScale(5).refreshBody();

    platforms.create(1520, 700, "ground").setScale(2); //1st platform
    platforms.create(1860, 300, "ground").setScale(2);
    platforms.create(150, 400, "ground").setScale(2);

    player = this.physics.add.sprite(100, 450, "dude");
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });
    player.body.setGravity(100);

    //Controlling the player with the keyboard
    cursors = this.input.keyboard.createCursorKeys();

    stars = this.physics.add.group({
      key: "star",
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 170 },
    });

    stars.children.iterate(function (child) {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    //Bomb Settings
    bombs = this.physics.add.group();

    //score settle
    scoreText = this.add.text(16, 36, "score: 0", {
      fontSize: "32px",
      fill: "#00000",
    });

    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(player, platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    this.physics.add.overlap(player, stars, this.collectStar, null, this);

    this.physics.add.collider(player, bombs, this.hitBombHit, null, this);

    try {
      await this.fetchQuestionData();
    } catch (error) {
      console.error("Error pre-fetching question:", error);
    }

    // Add test bomb near player - testing
    var bomb = bombs.create(100, 450, "bomb");
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(100, 0); // Move towards player
    bomb.allowGravity = false;
  }

  update() {
    if (gameOver) {
      return;
    }
    //JumpIt
    if (cursors.left.isDown) {
      player.setVelocityX(-160);
      player.anims.play("left", true);
    } else if (cursors.right.isDown) {
      player.setVelocityX(160);
      player.anims.play("right", true);
    } else {
      player.setVelocityX(0);
      player.anims.play("turn");
    }
    if (cursors.up.isDown && player.body.touching.down) {
      player.setVelocityY(-750);
    }
  }

  collectStar(player, star) {
    star.disableBody(true, true);

    score += 10;
    scoreText.setText("Score: " + score);

    if (stars.countActive(true) === 0) {
      stars.children.iterate(function (child) {
        child.enableBody(true, child.x, 0, true, true);
      });

      var x =
        player.x < 400
          ? Phaser.Math.Between(400, 800)
          : Phaser.Math.Between(0, 400);

      var bomb = bombs.create(x, 16, "bomb");
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
      bomb.allowGravity = false;
    }
  }

  async hitBombHit(player, bomb) {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play("turn");

    if (!this.gameInstance) {
      try {
        await this.fetchQuestionData();
      } catch (error) {
        console.error("Error fetching question:", error);
        this.createGameOverPopup();
        return;
      }
    }
    0;

    this.createAPIChallengePopup(bomb);
  }

  async fetchQuestionData() {
    try {
      const response = await fetch("/api/question");
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      const data = await response.json();

      // Rewrite the image URL to use our proxy
      this.gameInstance = {
        ...data,
        question: `/image-proxy${data.question.replace(
          "https://www.sanfoh.com",
          ""
        )}`,
      };
    } catch (error) {
      console.error("Error fetching question:", error);
      throw error;
    }
  }

  async updateScore() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await fetch("http://localhost:3000/leaderboard/score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ score }),
      });

      if (!response.ok) {
        throw new Error("Failed to update score");
      }
    } catch (error) {
      console.error("Error updating score:", error);
    }
  }

  createAPIChallengePopup(bomb) {
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

    const popupWidth = 800;
    const popupHeight = 600;
    const popup = this.add.container(
      this.scale.width / 2,
      this.scale.height / 2
    );
    popup.setDepth(1001);

    const popupBg = this.add.rectangle(0, 0, popupWidth, popupHeight, 0xffffff);
    popupBg.setStrokeStyle(4, 0x0000ff);
    popupBg.setOrigin(0.5);

    const challengeText = this.add.text(0, -250, "API CHALLENGE", {
      fontSize: "48px",
      color: "#0000FF",
      fontStyle: "bold",
      fontFamily: "Arial",
    });
    challengeText.setOrigin(0.5);

    // Add question image
    const questionImage = this.add.image(0, -100, this.gameInstance.question);
    questionImage.setDisplaySize(400, 200);

    // Load and display the dynamic question image
    this.load.image("questionImage", this.gameInstance.question);
    this.load.once("complete", () => {
      const dynImage = this.add.image(0, -100, "questionImage");
      dynImage.setDisplaySize(400, 200);
    });
    this.load.start();

    const questionText = this.add.text(0, 50, "Enter the missing digit:", {
      fontSize: "32px",
      color: "#000000",
      fontFamily: "Arial",
    });
    questionText.setOrigin(0.5);

    const inputContainer = this.add.dom(
      0,
      120,
      "input",
      "width: 200px; padding: 10px; font-size: 24px; text-align: center;"
    );

    const sendButton = this.add.rectangle(0, 200, 250, 80, 0x0000ff);
    sendButton.setInteractive({ useHandCursor: true });

    const sendText = this.add.text(0, 200, "SEND", {
      fontSize: "32px",
      color: "#FFFFFF",
      fontFamily: "Arial",
    });
    sendText.setOrigin(0.5);

    popup.add([
      popupBg,
      challengeText,
      questionImage,
      questionText,
      inputContainer,
      sendButton,
      sendText,
    ]);

    this.tweens.add({
      targets: popup,
      scaleX: 0,
      scaleY: 0,
      duration: 0,
      onComplete: () => {
        this.tweens.add({
          targets: popup,
          scaleX: 1,
          scaleY: 1,
          duration: 300,
          ease: "Back.easeOut",
        });
      },
    });

    sendButton.on("pointerdown", () => {
      const inputValue = inputContainer.node.value;

      if (inputValue === this.gameInstance.solution) {
        popup.destroy();
        overlay.destroy();
        this.physics.resume();
        bomb.destroy();
        player.clearTint();
      } else {
        popup.destroy();
        overlay.destroy();
        this.createGameOverPopup();
      }
    });

    return popup;
  }

  createAPIChallengePopup(bomb) {
    // First load the question image
    const loadImage = () => {
      return new Promise((resolve) => {
        this.load.image("questionImage", this.gameInstance.question);
        this.load.once("complete", resolve);
        this.load.start();
        console.log(this.gameInstance.solution);
      });
    };

    const createPopup = async () => {
      await loadImage();

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

      const popup = this.add.container(
        this.scale.width / 2,
        this.scale.height / 2
      );
      popup.setDepth(1001);

      const popupBg = this.add.rectangle(0, 0, 800, 600, 0xffffff);
      popupBg.setStrokeStyle(4, 0x0000ff);
      popupBg.setOrigin(0.5);

      const challengeText = this.add
        .text(0, -250, "API CHALLENGE", {
          fontSize: "48px",
          color: "#0000FF",
          fontStyle: "bold",
          fontFamily: "Arial",
        })
        .setOrigin(0.5);

      const questionImage = this.add.image(0, -100, "questionImage");
      questionImage.setDisplaySize(400, 200);

      const questionText = this.add
        .text(0, 50, "Enter the missing digit:", {
          fontSize: "32px",
          color: "#000000",
          fontFamily: "Arial",
        })
        .setOrigin(0.5);

      const inputContainer = this.add.dom(
        0,
        120,
        "input",
        "width: 200px; padding: 10px; font-size: 24px; text-align: center;"
      );

      const sendButton = this.add
        .rectangle(0, 200, 250, 80, 0x0000ff)
        .setInteractive({ useHandCursor: true });

      const sendText = this.add
        .text(0, 200, "SEND", {
          fontSize: "32px",
          color: "#FFFFFF",
          fontFamily: "Arial",
        })
        .setOrigin(0.5);

      popup.add([
        popupBg,
        challengeText,
        questionImage,
        questionText,
        inputContainer,
        sendButton,
        sendText,
      ]);

      this.tweens.add({
        targets: popup,
        scaleX: 0,
        scaleY: 0,
        duration: 0,
        onComplete: () => {
          this.tweens.add({
            targets: popup,
            scaleX: 1,
            scaleY: 1,
            duration: 300,
            ease: "Back.easeOut",
          });
        },
      });

      sendButton.on("pointerdown", () => {
        const inputValue = inputContainer.node.value;
        if (inputValue == this.gameInstance.solution) {
          popup.destroy();
          overlay.destroy();
          this.physics.resume();
          bomb.destroy();
          player.clearTint();
        } else {
          popup.destroy();
          overlay.destroy();
          this.createGameOverPopup();
        }
      });

      return popup;
    };

    return createPopup();
  }

  createGameOverPopup() {
    // Create a full-screen overlay
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

    // Create popup container
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

    // Animate popup entrance
    this.tweens.add({
      targets: popup,
      scaleX: 0,
      scaleY: 0,
      duration: 0,
      onComplete: () => {
        this.tweens.add({
          targets: popup,
          scaleX: 1,
          scaleY: 1,
          duration: 300,
          ease: "Back.easeOut",
        });
      },
    });

    // Add click event to try again button
    tryAgainButton.on("pointerdown", async () => {
      await this.updateScore();
      popup.destroy();
      overlay.destroy();
      this.scene.start("Leaderboard");
    });

    // Set game over flag
    gameOver = true;

    return popup;
  }
}
