import { Scene } from "phaser";

export class SignIn extends Scene {
  constructor() {
    super("SignIn");
    this.baseUrl = "http://localhost:3000";
  }

  preload() {
    this.load.image("SignUpTitle", "assets/SignUpTitle.png");
    this.load.image("SignUpBG", "assets/SignUpBG.png");
    this.load.image("PasswordIcon", "assets/PasswordIcon.png");
    this.load.image("Username", "assets/Username.png");
    this.load.image("password", "assets/password.png");
    this.load.image("SignIn", "assets/SignIn.png");
    this.load.image("ExitButton", "assets/ExitButton.png");
  }

  async handleSignIn() {
    const username = this.usernameInput.getChildByName("username").value;
    const password = this.passwordInput.getChildByName("password").value;

    try {
      const response = await fetch(`${this.baseUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Registration successful, proceed to login screen
      this.scene.start("Login");
    } catch (error) {
      console.error("Registration error:", error);
      // Add user-facing error handling here
    }
  }

  create() {
    const signUpBg = this.add.image(960, 540, "SignUpBG");
    signUpBg.setDisplaySize(1366, 768);

    const signUpTitle = this.add.image(1075, 325, "SignUpTitle");
    signUpTitle.setScale(0.7);

    const signIn = this.add
      .image(960, 680, "SignIn")
      .setInteractive({ useHandCursor: true });
    signIn.setScale(0.7);
    signIn.on("pointerdown", () => this.handleSignIn());

    const exitButton = this.add
      .image(1460, 765, "ExitButton")
      .setInteractive({ useHandCursor: true });
    exitButton.setScale(0.7);
    exitButton.on("pointerdown", () => {
      this.scene.start("Login");
    });

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
            background-color: #FDE7BB;
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
           background-color: #FDE7BB;
           color: #000000;
         ">`);
  }
}
