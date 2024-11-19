import { Scene } from "phaser";

export class Login extends Scene {
  constructor() {
    super("Login");
  }

  preload() {
    this.load.video(
      "LoginBgVideo",
      "assets/LoginBgVideo.mp4",
      "loadeddata",
      false,
      true
    );
    this.load.image("Login", "assets/Login.png");
    this.load.image("BananaFigures", "assets/BananaFigures.png");
    this.load.image("password", "assets/password.png");
    this.load.image("SignIn", "assets/SignIn.png");
    this.load.image("PasswordIcon", "assets/PasswordIcon.png");
    this.load.image("UsernameIcon", "assets/UsernameIcon.png");
    this.load.image("Username", "assets/Username.png");
    this.load.image("GameTitle", "assets/GameTitle.png");
    this.load.image("LoginBack", "assets/LoginBack.png");
  }

  create() {
    //Background
    // this.scale.startFullscreen();
    const loginBg = this.add.image(0, 0, "LoginBack");
    loginBg.setOrigin(0); 
    loginBg.setDisplaySize(this.scale.width, this.scale.height);

    // Title
    this.add.image(960, 250, "GameTitle").setScale(0.7);

    //Username
    this.add.image(675, 465, "UsernameIcon").setScale(0.8);
    this.usernameInput = this.add.dom(960, 465).createFromHTML(
      `<input type="text" name="username" placeholder="Username" 
         style="
           padding: 20px; 
           font-size: 20px; 
           width: 250px; 
           border-radius: 15px; 
           border: 1px solid #ccc; 
           background-color: #FFFF00;
           color: #000000;
         ">`
    );

    //Password
    this.add.image(675, 580, "PasswordIcon").setScale(0.8);
    this.passwordInput = this.add.dom(960, 580)
      .createFromHTML(`<input type="password" name="password" placeholder="Password" 
        style="
          padding: 20px; 
          font-size: 20px; 
          width: 250px; 
          border-radius: 15px; 
          border: 2px solid #ccc; 
          background-color: #FFFF00;
          color: #000000;
        ">`);

    // Login Button
    const loginButton = this.add
      .image(1085, 720, "Login")
      .setScale(0.7)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.handleLogin());

    //Sign In Button
    const signInButton = this.add
      .image(700, 720, "SignIn")
      .setScale(0.7)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.handleSignIn());

    // Feedback Text
    this.feedbackText = this.add
      .text(785, 720, "", { fontSize: "20px", color: "#FF0000" })
      .setOrigin(0.5);
  }

  async handleLogin() {
    const username = this.usernameInput.getChildByName("username").value;
    const password = this.passwordInput.getChildByName("password").value;

    //remove this
    // this.scene.start("MainMenu");

    if (!username) {
      alert("Username is empty!");
      return;
    }

    if (!password) {
      alert("Password is empty!");
      return;
    }

    // Call server-side API
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (data.token) {
        localStorage.setItem("jwtToken", data.token);
        this.scene.start("MainMenu");
      } else {
        this.feedbackText.setText("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      this.feedbackText.setText("An error occurred.");
    }
  }

  async handleSignIn() {
    this.scene.start("SignIn");
  }
}
