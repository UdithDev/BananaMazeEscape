import { Scene } from "phaser";

export class SignIn extends Scene {
  constructor() {
    super("SignIn");
  }

  preload() {
    this.load.image("SignUpTitle", "assets/SignUpTitle.png");
    this.load.image("SignUpBG", "assets/SignUpBG.png");
    this.load.image("PasswordIcon", "assets/PasswordIcon.png");
    this.load.image("UsernameIcon", "assets/UsernameIcon.png");
  }

  create() {
    const signUpBg = this.add.image(960, 540, "SignUpBG");
    signUpBg.setDisplaySize(1366, 768);

    const signUpTitle = this.add.image(1075, 325, "SignUpTitle"); 
    signUpTitle.setScale(0.7);
  }
}
