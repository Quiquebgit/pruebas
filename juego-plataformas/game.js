// define variables
var game;
var player;
var platforms;
var badges;
var items;
var cursors;
var jumpButton;
var text;
var winningMessage;
var won = false;
var currentScore = 0;
var winningScore = 100;
var cBadge = false;
var botaAlada = false;
var tieneLlave = false;
var saltoDoble = false;
var cAbierto = false;

// add collectable items to the game
function addItems() {
  items = game.add.physicsGroup();
  createItem(760, 130, 'coin');
  createItem(680, 380, 'coin');
  createItem(500, 220, 'coin');
  createItem(480, 160, 'coin');
  createItem(375, 300, 'coin');
  createItem(300, 120, 'coin');
  createItem(300, 430, 'coin');
  createItem(200, 60, 'coin');
  createItem(375, 520, 'poison');
  createItem(500, 350, 'poison');
  createItem(125, 50, 'star');
  createItem(820, 590, 'llave');
}

// add platforms to the game
function addPlatforms() {
  platforms = game.add.physicsGroup();
  platforms.create(400, 600, 'platform2');
  platforms.create(160, 520, 'platform2');
  platforms.create(680, 500, 'platform');
  platforms.create(-110, 480, 'platform');
  platforms.create(480, 400, 'platform');
  platforms.create(-110, 380, 'platform');
  platforms.create(160, 390, 'platform');
  platforms.create(630, 330, 'platform2');
  platforms.create(200, 230, 'platform');
  platforms.create(550, 200, 'platform');
  platforms.create(50, 100, 'platform2');
  platforms.setAll('body.immovable', true);
}

// add chest to the game
function addChests() {
  chests = game.add.physicsGroup();
  var chest = chests.create(0, 591, 'cofreCerrado');
  chests.setAll('body.immovable', true);
}

// create a single animated item and add to screen
function createItem(left, top, image) {
  var item = items.create(left, top, image);
  item.animations.add('spin');
  item.animations.play('spin', 10, true);
}

// create the winning badge and add to screen
function createBadge() {
  badges = game.add.physicsGroup();
  var badge = badges.create(15, 420, 'badge');
  badge.animations.add('spin');
  badge.animations.play('spin', 10, true);
}

// when the player collects an item on the screen
function itemHandler(player, item) {

  item.kill();
  if (item.key == "poison") {
    currentScore = currentScore - 10;
  } else if (item.key == "star") {
    currentScore = currentScore + 30;
  } else if (item.key == "jetpack") {
    player.loadTexture(playerjp.texture);
    player.body.gravity.y = 315;
  } else if (item.key == "llave") {
    tieneLlave = true;
  } else {
    currentScore = currentScore + 10;
  }
  if (currentScore >= winningScore && !cBadge) {
      createBadge();
      cBadge=true;
  }
}

// when the player collects the chest
function chestHandler(player, chest) {
  if(!cAbierto && tieneLlave){
    console.log(chest);
    var chest2 = chests.create(-50, -50, 'cofreAbierto');
    chest.loadTexture(chest2.texture);
    createItem(10, 540, 'jetpack');
    cAbierto = true;
  }
}

// when the player collects the badge at the end of the game
function badgeHandler(player, badge) {
  console.log(badge);
  badge.kill();
  won = true;
}

// setup game when the web page loads
window.onload = function () {
  game = new Phaser.Game(900, 650, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });
  
  // before the game begins
  function preload() {
    game.stage.backgroundColor = '#7AF';
    
    //Load images
    game.load.image('platform', 'platform_1.png');
    game.load.image('platform2', 'platform_2.png');
    game.load.image('cofreAbierto', 'cofre-abierto.png');
    game.load.image('cofreCerrado', 'cofre-cerrado.png');

    
    //Load spritesheets
    game.load.spritesheet('player', 'zombie.png', 46, 68);
    game.load.spritesheet('playerjp', 'zombie-jetpack.png', 46, 68);
    game.load.spritesheet('coin', 'coin.png', 36, 44);
    game.load.spritesheet('badge', 'badge.png', 42, 54);
    game.load.spritesheet('poison', 'poison.png', 32, 32);
    game.load.spritesheet('star', 'star.png', 32, 32);
    game.load.spritesheet('llave', 'llave.png', 50, 30);
    game.load.spritesheet('jetpack', 'jetpack.png', 38, 44);
  }

  // initial game set up
  function create() {
    player = game.add.sprite(120, 600, 'player');
    playerjp = game.add.sprite(-50, -50, 'playerjp');
    player.animations.add('walk');
    player.anchor.setTo(0.5, 0.5);
    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;
    player.body.gravity.y = 500;

    addItems();
    addPlatforms();
    addChests();

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    text = game.add.text(16, 16, "SCORE: " + currentScore, { font: "bold 24px Arial", fill: "white" });
    winningMessage = game.add.text(game.world.centerX, 275, "", { font: "bold 48px Arial", fill: "white" });
    winningMessage.anchor.setTo(0.5, 1);
  }

  // while the game is running
  function update() {
    text.text = "SCORE: " + currentScore;
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(player, chests, chestHandler);
    game.physics.arcade.overlap(player, items, itemHandler);
    game.physics.arcade.overlap(player, badges, badgeHandler);
    player.body.velocity.x = 0;

    // is the left cursor key presssed?
    if (cursors.left.isDown) {
      player.animations.play('walk', 10, true);
      player.body.velocity.x = -300;
      player.scale.x = - 1;
    }
    // is the right cursor key pressed?
    else if (cursors.right.isDown) {
      player.animations.play('walk', 10, true);
      player.body.velocity.x = 300;
      player.scale.x = 1;
    }
    // player doesn't move
    else {
      player.animations.stop();
    }
    
    if (jumpButton.isDown && (player.body.onFloor() || player.body.touching.down || saltoDoble)) {
      player.body.velocity.y = -400;
      saltoDoble = false;
    }
    if (botaAlada && (player.body.onFloor() || player.body.touching.down)){
        saltoDoble = true;
    }
    // when the player winw the game
    if (won) {
      winningMessage.text = "YOU WIN!!!";
    }
  }

  function render() {

  }

};
