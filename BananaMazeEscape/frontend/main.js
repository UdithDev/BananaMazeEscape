import './style.css'
import Phaser from 'phaser';


const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'gameContainer',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

let player, cursors, keys, maze, traps = [], keysGroup;

function preload() {
  // Load images or sprites
  this.load.image('player', 'path-to-player-sprite.png');
  this.load.image('wall', 'path-to-wall-sprite.png');
  this.load.image('key', 'path-to-key-sprite.png');
  this.load.image('trap', 'path-to-trap-sprite.png');
}

function create() {
  // Create Maze
  maze = this.add.group();
  
  const mazeLayout = [
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 1, 1],
    [1, 1, 1, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1]
  ];

  mazeLayout.forEach((row, y) => {
    row.forEach((tile, x) => {
      if (tile === 1) {
        let wall = this.physics.add.staticSprite(x * 100, y * 100, 'wall');
        maze.add(wall);
      }
    });
  });

  // Add Player
  player = this.physics.add.sprite(50, 50, 'player').setCollideWorldBounds(true);

  // Create Keys
  keysGroup = this.physics.add.group();
  keysGroup.create(150, 150, 'key');
  keysGroup.create(550, 150, 'key');

  // Create Traps
  traps.push(this.physics.add.sprite(400, 300, 'trap'));

  // Add collision
  this.physics.add.collider(player, maze);
  this.physics.add.overlap(player, keysGroup, collectKey, null, this);
  this.physics.add.overlap(player, traps, hitTrap, null, this);

  // Player controls
  cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  player.setVelocity(0);

  if (cursors.left.isDown) {
    player.setVelocityX(-160);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);
  }

  if (cursors.up.isDown) {
    player.setVelocityY(-160);
  } else if (cursors.down.isDown) {
    player.setVelocityY(160);
  }
}

function collectKey(player, key) {
  key.destroy();
}

function hitTrap(player, trap) {
  console.log('Hit a trap!');
}
function checkForNextLevel() {
  if (keysGroup.countActive(true) === 0) {
    console.log('All keys collected! Next level.');
    // Load the next level or scene
    this.scene.restart(); // Reset current scene for testing
  }
}
