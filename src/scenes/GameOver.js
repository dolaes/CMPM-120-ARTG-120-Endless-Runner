class GameOver extends Phaser.Scene {
   constructor() {
      super("gameOver");
   }

   preload() {
      this.load.image('endscreen', './assets/01_end_screen.png')
   }

   create() {
      //add in the background music and play it on a loop
      this.background = this.sound.add('main');
      this.background.setLoop(true);
      this.background.play();
      //add in the background sprite
      this.add.tileSprite(0, 0, game.config.width, game.config.height, 'endscreen').setOrigin(0,0);
      //initialize space key for input
      keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      //handle the input and restart the game
      keySPACE.on('down', (key, event) => {
         this.background.stop();
         this.sound.play('select');
         this.scene.start("playScene");
      });
      //display the players score and instructions to restart
      let gameOverConfig = {
         fontFamily: 'Courier',
         fontSize: '20px',
         fontStyle: 'bold',
         color: '#FFFFFF',
         align: 'left'
     }
      this.add.text(25, game.config.height - 200, "Score: " + score + "\nPress 'Space' to restart", gameOverConfig);
   }
}