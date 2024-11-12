import { Scenes } from "phaser";

class Login extends Scenes {
  constructor() {
    super("Login");
  }

  preload() {
    this.load.image("LoginBg", "assets/LoginBg.png");
    this.load.image("Login", "assets/Login.png");
    this.Login.image("BananaFigures", "assets/BananaFigures.png");
  }

  create() {}
}
