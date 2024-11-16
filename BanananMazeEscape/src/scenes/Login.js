import { Scene } from "phaser";

export class Login extends Scene {
  constructor() {
    super("Login");
  }

  preload() {
    this.load.image("LoginBg", "assets/LoginBg.png");
    this.load.image("Login", "assets/Login.png");
    this.load.image("BananaFigures", "assets/BananaFigures.png");
    this.load.image("password", "assets/password.png");
    this.load.image("SignIn", "assets/SignIn.png");
    this.load.image("PasswordIcon", "assets/PasswordIcon.png");
    this.load.image("UsernameIcon", "assets/UsernameIcon.png");
    this.load.image("Username", "assets/Username.png");
  }

  create() {
    const loginBg = this.add.image(960, 540, "LoginBg");
    loginBg.setDisplaySize(1366, 768);

    // Title
    this.add.image(960, 250, "BananaFigures").setScale(0.7);

    //Username
    this.add.image(575, 465, "Username").setScale(0.7);
    this.usernameInput = this.add.dom(960, 465).createFromHTML(
      `<input type="text" name="username" placeholder="Username" 
         style="
           padding: 20px; 
           font-size: 20px; 
           width: 250px; 
           border-radius: 15px; 
           border: 1px solid #ccc; 
           background-color: #ffffff;
           color: #000000;
         ">`
    );

    //Password
    this.add.image(575, 580, "password").setScale(0.7);
    this.passwordInput = this.add.dom(960, 580)
      .createFromHTML(`<input type="password" name="password" placeholder="Password" 
        style="
          padding: 20px; 
          font-size: 20px; 
          width: 250px; 
          border-radius: 15px; 
          border: 2px solid #ccc; 
          background-color: #ffffff;
          color: #000000;
        ">`);

    // Login Button
    const loginButton = this.add
      .image(885, 720, "Login")
      .setScale(0.7)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.handleLogin());

    //Sign In Button
    const signInButton = this.add
      .image(600, 720, "SignIn")
      .setScale(0.7)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.handleSignIn());

    // Feedback Text
    this.feedbackText = this.add
      .text(785, 720, "", { fontSize: "20px", color: "#FF0000" })
      .setOrigin(0.5);


       // Get the size of the background for the border
    const bgWidth1 = background.displayWidth;
    const bgHeight1 = background.displayHeight;

    // Create a border using the Graphics object
    const borderThickness = 10;
    const borderColor = 0xfeec37; //(hex value)

    const border = this.add.graphics();
    border.lineStyle(borderThickness, borderColor, 1);

    border.strokeRect(
      background.x - bgWidth1 / 2,
      background.y - bgHeight1 / 2,
      bgWidth1, // Width of the border
      bgHeight1 // Height of the border
    );
  }

  async handleLogin() {
    const username = this.usernameInput.getChildByName("username").value;
    const password = this.passwordInput.getChildByName("password").value;

    // Implement login logic here
    console.log("Username:", username, "Password:", password);

    // Call server-side API
    // try {
    //   const response = await fetch(" http://localhost:3000/login", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ username, password }),
    //   });
    //   const data = await response.json();

    //   if (data.token) {
    //     localStorage.setItem("jwtToken", data.token);
    //     this.scene.start("MainMenu");
    //   } else {
    //     this.feedbackText.setText("Login failed. Please try again.");
    //   }
    // } catch (error) {
    //   console.error("Error during login:", error);
    //   this.feedbackText.setText("An error occurred.");
    // }

    this.scene.start("MainMenu");
  }

  async handleSignIn() {
    this.scene.start("SignIn");
  }

  
}
