import Preloader from './assets/classes/Preloader.js'
import Main from './assets/classes/Main.js'
import Guess1 from './assets/classes/Guess1.js'
import Guess2 from './assets/classes/Guess2.js'
import Guess3 from './assets/classes/Guess3.js'
import Memory5 from './assets/classes/Memory5.js'

var isIOS = /iP[ao]d|iPhone/i.test(navigator.userAgent);

let config = {
    type : Phaser.AUTO,
    renderer : isIOS ? Phaser.CANVAS : Phaser.AUTO,
    //pixelArt:true,
    width : 1200,
    height : 675,
    scale : {
        mode : Phaser.Scale.FIT,
        autoCenter : Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: 'matter',
        matter: {
            //debug: true,
            gravity: {
                y: 3,
            },
        }
    },
    //backgroundColor : 0xf5f5f5,
    backgroundColor : 0xffffff,
    //backgroundColor : 0xdee3ff,
    scene : [Preloader, Main, Guess1, Guess2, Guess3, Memory5],
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

var GlobalResize=()=>{
    console.log('resized');
}

window.addEventListener('resize', () => {
    GlobalResize();
}, false);

