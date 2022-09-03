// Collaborator Names: Nicolas Guevara, Jocque Jefferson, Daniel Olaes
// Game Title: You've Got Mail
// Date completed: 5/1/2022

// Creative Tilt:
//    Something technically interesting that we did was use the particle explosion effect as an animation for the player teleporting.
// This required passing a particle manager into our player class and then causing an explosion at the player location. The explosion
// occurs in the email class when the player input calls for it to either move up or down, but the particle manager is maintained in
// the play scene. While we had explored the particle emitter in class, we had not really talked about the explosion function and the 
// possibilities that it offered.

//    Regarding the aesthetics of the game, one aspect that we are very proud of was the background music for the main menu, gameplay,
// and ending scene. Prior to this project, our group had no experience composing audio assets, often defaulting to utilizing free 
// background music found online. However, during this project, we decided that this would be our opportunity to try our hand at 
// creating simple chiptune music. Using the website, beepbox.co, and “playtesting” the songs with several of our peers, we were able 
// to compose a short looping song that fit perfectly with the retro, pixel aesthetic we were going for.

//    In addition, we were also very proud of our visual asset animations. Like the audio assets, we did not have much experience
// animating sprites prior to this project. Therefore, creating all of the assets for the game seemed very daunting. However, after 
// researching several videos and resources for pixel art animation, we were able to create dynamically noticeable animation for our 
// game, making the sprite feel alive. One specific animation that we were very proud of was Mail-E’s death animation, where he stops 
// and spins as he falls off the screen. This animation was very reminiscent of old Mario death animations, further cementing our desire 
// to communicate a retro game aesthetic through our art. 


let config = {
   parent: 'phaser-game',
   type: Phaser.AUTO,
   width: 1000,
   height: 600,
   physics: {
      default: 'arcade',
      arcade: {
         gravity: {y: 200},
         debug: false
      }
   },
   scene:  [Menu, Play, GameOver]
}

let game = new Phaser.Game(config);

//the y distance between lanes
let differenceY = game.config.height/4;
//global variable to keep score to display in multiple scenes
let score = 0;
let keyUP, keyDOWN, keySPACE;