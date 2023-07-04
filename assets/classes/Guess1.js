import MemoryManager from './MemoryManager.js'
import GuessManager1 from './GuessManager1.js'
import GuessManager2 from './GuessManager2.js'
import GuessManager3 from './GuessManager3.js'

export default class Guess1 extends Phaser.Scene
{
    
    constructor ()
    {
        super("Guess1");
    }

    init ()
    {
    }

    preload ()
    {
    }

    create ()
    {
        this.cameras.main.centerOn(0, 0);

        this.cameras.main.zoom=0.6;

        this.guessManager = new GuessManager1(this,{});
       
        this.input.keyboard
            .on('keydown-Y', ()=>{
                this.scene.start('Guess1')
            })
            .on('keydown-U', ()=>{
                this.scene.start('Guess2')
            })
            .on('keydown-I', ()=>{
                this.scene.start('Guess3')
            })
            .on('keydown-O', ()=>{
                this.scene.start('Memory5')
            })
            .on('keydown-F', ()=>{
                this.scale.toggleFullscreen();
            })
    }

    update (time,dt)
    {
        this.guessManager.update(dt);
    }
}


