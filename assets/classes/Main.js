import Warrior from './Warrior.js'
import Room from './Room.js'
import TrainingManager from './TrainingManager.js'
import TrainingManagerSeparate from './TrainingManagerSeparate.js'
import PresentationManager from './PresentationManager.js'
import MemoryManager from './MemoryManager.js'
import TournierManager from './TournierManager.js'
import EloManager from './EloManager.js'
import Button from './Button.js'
import GuessManager1 from './GuessManager1.js'
import GuessManager2 from './GuessManager2.js'
import GuessManager3 from './GuessManager3.js'

// ! 1 2 3 4 5 6 7 8 9 0 P p * & ( ) @

export default class Main extends Phaser.Scene
{
    
    constructor ()
    {
        super("Main");
    }

    init ()
    {
    }

    preload ()
    {
    }

    create ()
    {
        //little setup before run
        this.cameras.main.centerOn(0, 0);

        this.cameras.main.zoom=0.6;
        
        //this.matter.add.mouseSpring();
        
        this.presentationManager = new PresentationManager(this,{});

        //this.trainingManager = new TrainingManagerSeparate(this,{cols:5,rows:5,battleTime:10000,createFromStorage:false,populationSize:200,numberOfClusters:12});
    
        //this.trainingManager = new TrainingManager(this,{cols:5,rows:5,battleTime:10000,createFromStorage:false,populationSize:150});

        //this.tournierManager = new TournierManager(this,{cols:5,rows:5,battleTime:10000});
        
        //this.tournierManager = new EloManager(this,{cols:5,rows:5,battleTime:10000});

        //this.tournierManager=new MemoryManager(this,{cols:3,rows:5,battleTime:10000});
        
        //this.guessManager = new GuessManager1(this,{});
        
        //this.guessManager = new GuessManager2(this,{});
        
        //this.guessManager = new GuessManager3(this,{});
    }

    update (time,dt)
    {
        if(this.trainingManager)
        {
            this.trainingManager.update();
        }
        else if(this.presentationManager)
        {
            this.presentationManager.update();
        }
        else if(this.tournierManager)
        {
            this.tournierManager.update();
        }
        else if(this.guessManager)
        {
            this.guessManager.update(dt);
        }
    }
}


