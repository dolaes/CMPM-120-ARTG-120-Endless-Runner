class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        this.load.image('menu', './assets/01_menu.png');
        this.load.audio('main', './assets/mainSong.wav');
        this.load.audio('select', './assets/select.wav');
    }

    create() {
        //add in the background image
        this.add.tileSprite(0, 0, game.config.width, game.config.height, 'menu').setOrigin(0, 0);
        //add in background music and play on loop
        this.background = this.sound.add('main');
        this.background.setLoop(true);
        this.background.play();
        //assign key to handle input
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        //handle the player input
        keySPACE.on('down', (key, event) => {
            this.background.stop();
            this.sound.play('select');
            this.scene.stop("menuScene");
            this.scene.start('playScene');
        });

    }
}