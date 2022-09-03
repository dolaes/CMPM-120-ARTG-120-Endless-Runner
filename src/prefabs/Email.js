class Email extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, particles, sound) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setPushable(false);
        this.powerup = false;
        this.particles = particles;
        this.sound = sound;
    }

    update() {
        // If the player is below the top lane, they can move up
        if(Phaser.Input.Keyboard.JustDown(keyUP) && this.y > game.config.height/4) {
            //move the player up
            this.y -= differenceY;
            //play the particle explosion at the player location
            this.particles.explode(1000, this.x + 60, this.y + 20);
            this.alpha = 0;
            //delay displaying the player sprite
            setTimeout(() => {
                this.alpha = 1;
            }, 300);
            this.sound.play();
        }
        // If the player is above the bottom lane, they can move down
        if(Phaser.Input.Keyboard.JustDown(keyDOWN) && this.y < game.config.height/2) {
            //move the player down
            this.y += differenceY;
            //play the particle explosion
            this.particles.explode(1000, this.x + 60, this.y + 20);
            this.alpha = 0;
            setTimeout(() => {
                this.alpha = 1;
            }, 300);
            this.sound.play();
        }
    }
}