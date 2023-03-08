import Preloader from './assets/classes/Preloader.js'
import Main from './assets/classes/Main.js'

let config = {
    type : Phaser.AUTO,
    width : 1200,
    height : 600,
    scale : {
        mode : Phaser.Scale.FIT,
        autoCenter : Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'matter',
        matter: {
            //debug: true,
            gravity: {
                y: 4,
            },
        }
    },
    backgroundColor : 0xffffff,
    scene : [Preloader, Main],
}


let storageData = localStorage.getItem('battle');
    
if(storageData) storageData = JSON.parse(storageData);
else storageData = {};

const Game = new Phaser.Game(config);
Game.data = storageData;
      
Game.saveUserData = function(){
localStorage.setItem(
    'battle',
    JSON.stringify(Game.data)
    );
};
