class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images
        this.load.path = 'assets/';
        this.load.image('platformTile', '01_tile.png');
        this.load.image('background', '01_background.png');
        this.load.image('particle', '01_particle.png');
        this.load.image('background2', '02_background.png');

        // load sprite sheets
        this.load.spritesheet('controls', '01_controls.png', { frameWidth: 96, frameHeight: 48, startFrame: 0, endFrame: 3 });
        this.load.spritesheet('virus1', '01_virus.png', { frameWidth: 48, frameHeight: 48, startFrame: 0, endFrame: 3 });
        this.load.spritesheet('virus2', '02_virus.png', { frameWidth: 48, frameHeight: 48, startFrame: 0, endFrame: 3 });
        this.load.spritesheet('email', '01_mail-e.png', { frameWidth: 80, frameHeight: 48, startFrame: 0, endFrame: 7 });
        this.load.spritesheet('emailDeath', '01_mail-e_Death.png', { frameWidth: 48, frameHeight: 48, startFrame: 0, endFrame: 7 });
        this.load.spritesheet('boosted', '01_mail-e_powerup.png', { frameWidth: 80, frameHeight: 48, startFrame: 0, endFrame: 7 });
        this.load.spritesheet('shield', '01_shield.png', { frameWidth: 48, frameHeight: 48, startFrame: 0, endFrame: 3 });
        this.load.spritesheet('virus3', '01_large_enemy.png', { frameWidth: 64, frameHeight: 50, startFrame: 0, endFrame: 5 });

        //load sounds
        this.load.audio('damage', 'damage.wav');
        this.load.audio('death', 'death.wav');
        this.load.audio('powerup', 'powerUp.wav');
        this.load.audio('play', 'playMusic.wav');
        this.load.audio('speedUp', 'speedUp.wav');
        this.load.audio('teleport', 'teleport.wav');
    }

    create() {
        // Variable Initialization
        this.tileSize = 20;
        this.spawnTime = 1000;
        this.scrollSpeed = 2;
        this.virusSpeed1 = -250;
        this.virusSpeed2 = -400;
        this.platformSpeed = 4;
        this.gameOver = false;
        this.tutorial = true;
        score = 0;

        // Initialize Background
        this.background = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'background').setOrigin(0, 0);
        this.background2 = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'background2').setOrigin(0, 0);

        // Initialize Platform Group
        this.platforms = this.add.group();

        // Initialize Top Platform
        for (let i = 0; i < game.config.width; i += this.tileSize) {
            let topTile = this.physics.add.sprite(i, game.config.height / 4 - this.tileSize, 'platformTile').setOrigin(0, 0);
            topTile.body.immovable = true;
            topTile.body.allowGravity = false;
            this.platforms.add(topTile);
        }

        // Initialize Middle Platform
        for (let i = 0; i < game.config.width; i += this.tileSize) {
            let midTile = this.physics.add.sprite(i, game.config.height / 2 - this.tileSize, 'platformTile').setOrigin(0, 0);
            midTile.body.immovable = true;
            midTile.body.allowGravity = false;
            this.platforms.add(midTile);
        }

        // Initialize Middle Platform
        for (let i = 0; i < game.config.width; i += this.tileSize) {
            let botTile = this.physics.add.sprite(i, ((game.config.height / 4) * 3) - this.tileSize, 'platformTile').setOrigin(0, 0);
            botTile.body.immovable = true;
            botTile.body.allowGravity = false;
            this.platforms.add(botTile);
        }

        // Initialize Control Icons
        this.control = this.add.sprite(game.config.width / 4 + 30, game.config.height / 2 - 70, "controls").setScale(2);
        this.control.play("controlsAni");
        
        // Create particles for teleport
        this.particleManager = this.add.particles('particle');
        this.particleSystem = this.particleManager.createEmitter({
            speed: {min: -100, max: 100},
            lifespan: {min: 10, max: 500, steps: 100},
            frequency: -1
        });

        // Create an animation for controls
        this.anims.create({
            key: "controlsAni",
            frames: this.anims.generateFrameNumbers("controls", { start: 0, end: 3, first: 0 }),
            frameRate: 15,
            repeat: -1
        });

        // Initialize Player
        this.teleport = this.sound.add('teleport');
        this.player1 = new Email(this, 100, game.config.height / 2 - 68, 'email', 0, this.particleSystem, this.teleport).setOrigin(0, 0);
        this.player1.setSize(48, 48);
        this.player1.setOffset(30, 0);

        // Create an animation for the player
        this.anims.create({
            key: 'emailAnimation',
            frames: this.anims.generateFrameNumbers('email', { start: 0, end: 7, first: 0 }),
            frameRate: 15,
            repeat: -1
        });
        this.anims.create({
            key: 'emailDeathAnimation',
            frames: this.anims.generateFrameNumbers('emailDeath', { start: 0, end: 7, first: 0 }),
            frameRate: 15,
            repeat: -1
        });
        this.anims.create({
            key: 'emailPowerup',
            frames: this.anims.generateFrameNumbers('boosted', { start: 0, end: 7, first: 0 }),
            frameRate: 15,
            repeat: -1
        });
        this.player1.play('emailAnimation');

        // Group for the enemy viruses
        this.viruses = this.physics.add.group();
        this.specialViruses = this.physics.add.group();

        // Create an animation for the viruses
        this.anims.create({
            key: 'virus1Animation',
            frames: this.anims.generateFrameNumbers('virus1', { start: 0, end: 3, first: 0 }),
            frameRate: 15,
            repeat: -1
        });
        this.anims.create({
            key: 'virus2Animation',
            frames: this.anims.generateFrameNumbers('virus2', { start: 0, end: 3, first: 0 }),
            frameRate: 15,
            repeat: -1
        });
        this.anims.create({
            key: 'virus3Animation',
            frames: this.anims.generateFrameNumbers('virus3', { start: 0, end: 5, first: 0 }),
            frameRate: 15,
            repeat: -1
        });

        // Create the three viruses following
        this.largeViruses = this.add.group({
            key: "virus3",
            frame: 0,
            repeat: 2,
            setXY: { x: 25, y: game.config.height / 4 - this.tileSize, stepY: game.config.height / 4 },
            setScale: { x: 2, y: 2 }
        });
        this.largeViruses.playAnimation('virus3Animation');
        this.largeViruses.setDepth(1);

        // Spawn enemies every second
        setTimeout(() => {
            this.spawnEnemy1 = setInterval(() => {
                let lane = (Math.floor(Math.random() * 3));
                this.addVirus(this.viruses, 'virus1', 'virus1Animation', (lane * differenceY) + 85, this.virusSpeed1);
            }, this.spawnTime);
            // Spawn a special type of enemy every 2.5 seconds
            this.spawnEnemy2 = setInterval(() => {
                this.addVirus(this.specialViruses, 'virus2', 'virus2Animation', this.player1.y, this.virusSpeed2);
            }, this.spawnTime * 2.5);
            this.tutorial = false;
            this.control.destroy();
        }, 3000);

        // Group for the powerups
        this.powerup = this.physics.add.sprite(game.config.width, 0, 'shield').setOrigin(0, 0);

        // Create animation for shield
        this.anims.create({
            key: 'shieldAnimation',
            frames: this.anims.generateFrameNumbers('shield', { start: 0, end: 3, first: 0 }),
            frameRate: 15,
            repeat: -1
        });

        // Spawn a powerup every interval of time
        this.spawnPowerup = setInterval(() => {
            let lane = Math.floor(Math.random() * 3);
            this.powerup.y = (lane * differenceY) + 85;
            this.powerup.x = game.config.width;
            this.powerup.setVelocityX(this.virusSpeed1);
            this.powerup.alpha = 1;
            this.powerup.play('shieldAnimation');
        }, 7300);

        // Collision
        this.physics.add.collider(this.player1, this.platforms);
        this.physics.add.collider(this.viruses, this.platforms);
        this.physics.add.collider(this.specialViruses, this.platforms);
        this.physics.add.collider(this.powerup, this.platforms);
        this.enemyHit = this.physics.add.overlap(this.player1, this.viruses, this.playerHit, null, this);
        this.specialEnemyHit = this.physics.add.overlap(this.player1, this.specialViruses, this.playerHit, null, this);
        this.powerUpHit = this.physics.add.overlap(this.player1, this.powerup, this.enablePowerup, null, this);

        // Add input keys
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

        // Initialize Background Music
        this.backgroundMusic = this.sound.add('play');
        this.backgroundMusic.loop = true;
        this.backgroundMusic.play();


        // Create the score display
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#000000',
            color: '#FFFFFF',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreDisplay = this.add.text(game.config.width - 100, 45, score, scoreConfig);

        // Increase the difficulty every 10 seconds
        setTimeout(() => {
            this.difficulty = setInterval(() => {
                if (this.spawnTime > 300) {
                    this.virusSpeed1 -= 100;
                    this.virusSpeed2 -= 100;
                    this.scrollSpeed += .1;
                    this.platformSpeed += .1;
                    this.spawnTime -= 100;
                    console.log(this.spawnTime);
                    this.sound.play('speedUp')
                }
            }, 10000);
        }, 3000);
    }

    // New Virus Initialization
    addVirus(virusGroup, virusType, virusAnimation, posY, speed) {
        let virus = this.physics.add.sprite(game.config.width, posY, virusType, 0).setOrigin(0, 0);
        virusGroup.add(virus);
        virus.play(virusAnimation);
        virus.setVelocityX(speed);
    }

    update() {
        // Start score incrementing
        if (!this.tutorial && !this.gameOver) {
            this.scoreDisplay.text = score++;
        }

        // Update Background
        this.background.tilePositionX += this.scrollSpeed;
        this.background2.tilePositionX += this.scrollSpeed * 1.5;
        this.platforms.getChildren().forEach((tile) => {
            tile.setX(tile.x - this.scrollSpeed);
            this.physics.world.wrap(tile, 0);
        }, this);

        // Update Player
        if (!this.gameOver) {
            this.player1.update();
        }

        // Update Viruses
        this.viruses.getChildren().forEach((virus) => {
            if (virus.x <= 0 - virus.width) {
                virus.destroy();
            }
        }, this);
    }

    // Player Hit Function
    playerHit(player, virus) {
        if (!this.player1.powerup) {
            this.gameOver = true;
            this.player1.play('emailDeathAnimation');
            this.player1.setImmovable(true);
            this.enemyHit.destroy();
            this.specialEnemyHit.destroy();
            //stop the enemies from spawning
            clearInterval(this.spawnEnemy1);
            clearInterval(this.spawnEnemy2);
            clearInterval(this.spawnPowerup);
            clearInterval(this.difficulty);
            //stop the enemies from moving
            this.viruses.setVelocityX(0);
            this.specialViruses.setVelocityX(0);
            this.powerup.setVelocityX(0);
            this.scrollSpeed = 0;
            this.sound.play('death');
            this.backgroundMusic.stop();
            setTimeout(() => {
                this.scene.stop("playScene");
                this.scene.start("gameOver");
                this.backgroundMusic.stop();
            }, 2000);
        } else {
            this.sound.play('damage');
            virus.destroy();
        }
    }

    // Power Up Function
    enablePowerup(player, powerup) {
        this.player1.powerup = true;
        this.powerup.alpha = 0;
        this.sound.play('powerup');
        this.powerUpHit.destroy();
        this.player1.play('emailPowerup');
        setTimeout(() => {
            if (!this.gameOver) {
                this.powerUpHit = this.physics.add.overlap(this.player1, this.powerup, this.enablePowerup, null, this);
            }
            this.player1.powerup = false;
            this.player1.play('emailAnimation');
        }, 2000);
    }

}