import { Boot } from "./scenes/Boot";
import { Game } from "./scenes/Game";
import { GameOver } from "./scenes/GameOver";
import { InGameUI } from "./scenes/InGameUI";
import { Leaderboard } from "./scenes/Leaderboard";
import { Login } from "./scenes/Login";
import { MainMenu } from "./scenes/MainMenu";
import { Preloader } from "./scenes/Preloader";
import { SignIn } from "./scenes/SignIn";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1080,

  parent: "game-container",
  backgroundColor: "",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [
    Boot,
    Preloader,
    MainMenu,
    Game,
    GameOver,
    InGameUI,
    Leaderboard,
    Login,
    SignIn,
  ],

  dom: {
    createContainer: true,
  },
};

export default new Phaser.Game(config);
