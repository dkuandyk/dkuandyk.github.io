import Warrior from './Warrior.js'
import Room from './Room.js'
import {nn_14_8_5_191,nn_14_8_5_20} from './nns.js'
import Button from './Button.js'

export default class Main extends Phaser.Scene
{
    
    constructor ()
    {
        super("Main");
    }

    init ()
    {
        this.warriors=[];
        this.walhalla=[];
        
        this.cols=1;
        this.rows=1;

        this.battleTime=10000;

        this.gameMode="presentation";
    }

    preload ()
    {
    }

    create ()
    {
        //little setup before run
        this.cameras.main.centerOn(0, 0);

        this.cameras.main.zoom=0.6;
        
        this.matter.add.mouseSpring();
        //this.graphics = this.add.graphics({ lineStyle: { width: 3, color: 0x37db52}, fillStyle: { color: 0x37db52 } });

        new Room(this,this.cols,this.rows);

        //this.evolution=new Evolution(this,{model:[14,8,5],populationSize:500,mutationRate:0.05,sliceRate:0.3,usePrevious:true});
        //this.networks=this.evolution.getNetworks();

        this.walhalla=[];
        this.warriors=[];
        
        this.createPresentation();

        let playButton=new Button(this,0,-320,()=>{
            if(this.gameMode==="presentation")
            {
                this.gameMode="game";
                this.clearWarriors();
                this.createGame();
                playButton.destroy();
                this.killsCounter.setVisible(true);
                this.killsRecord.setVisible(true);
                this.tweens.add({
                    targets:[this.killsCounter,this.killsRecord],
                    scale:1,
                    duration:500,
                    ease:"Back.Out"
                });
            }
        },'play');
        let restartButton=new Button(this,-160,-320,()=>{
            this.scene.restart();
        },'restart');
        let enlargeButton=new Button(this,160,-320,()=>{
            if (this.scale.isFullscreen) {
                this.scale.stopFullscreen();
            }
            else
            {
                this.scale.startFullscreen();
            }
        },'enlarge');

        this.killsCounter = this.add.text(-850, -400, "score : 0", {font: "100px customFont"})
            .setOrigin(0,0)
            .setDepth(100)
            .setTint(0x1e1e1e)
            .setVisible(false)
            .setScale(0.01);
        this.killsCounter.score=0;
        this.killsRecord = this.add.text(850, -400, "record : 0", {font: "100px customFont"})
            .setOrigin(1,0)
            .setDepth(100)
            .setTint(0x1e1e1e)
            .setVisible(false)
            .setScale(0.01);
        this.killsRecord.record=this.game.data.record||0;

        this.updateInfo();
    }

    clearWarriors()
    {
        this.killsCounter.score=0;
        this.updateInfo();
        for(let i of this.warriors)
        {
            i.clear();
        }
        this.warriors=[];
    }

    updateInfo()
    {
        this.killsCounter.setText("score : "+this.killsCounter.score);
        this.killsRecord.setText("record : "+this.killsRecord.record);
    }

    addWarrior(isPlayer)
    {
        let posX=-800;
        if(this.warriors.length>0)
        {
            if(this.warriors[0].physicBody.x<this.warriors[0].baseX)
            {
                posX=800;
            }
        }
        if(isPlayer)
        {
            let w=new Warrior(this,posX,300*Math.random(),{baseX:0,baseY:0,brain:null});
            w.destroyFunc=()=>{
                if(w.brain)
                {
                    if(this.gameMode==="game")
                    {
                        this.killsCounter.score+=1;
                        if(this.killsCounter.score>this.killsRecord.record)
                        {
                            this.killsRecord.record=this.killsCounter.score;
                            this.game.data.record=this.killsRecord.record;
                            this.game.saveUserData();
                        }
                    }
                    
                    this.addWarrior(false);
                }
                else
                {
                    this.killsCounter.score=0;
                    this.addWarrior(true);
                }
                this.updateInfo();
            }
            this.warriors.push(w);
        }
        else
        {
            let ebn=Math.floor(Math.random()*nn_14_8_5_20.length);
            let enemyBrain=new Network(nn_14_8_5_20[ebn].weights);
            let w=new Warrior(this,posX,300*Math.random(),{baseX:0,baseY:0,brain:enemyBrain});
            w.destroyFunc=()=>{
                if(w.brain)
                {
                    if(this.gameMode==="game")
                    {
                        this.killsCounter.score+=1;
                        if(this.killsCounter.score>this.killsRecord.record)
                        {
                            this.killsRecord.record=this.killsCounter.score;
                            this.game.data.record=this.killsRecord.record;
                            this.game.saveUserData();
                        }
                    }
                    
                    this.addWarrior(false);
                }
                else
                {
                    this.killsCounter.score=0;
                    this.addWarrior(true);
                }
                this.updateInfo();
            }
            if(Math.random()>0.5)
            {
                w.setFlipped();
            }
            this.warriors.push(w);
        }
        this.warriors[0].setEnemy(this.warriors[1]);
        this.warriors[1].setEnemy(this.warriors[0]);
    }

    removeItemOnce(arr, value) {
        var index = arr.indexOf(value);
        if (index > -1) {
          arr.splice(index, 1);
        }
        //return arr;
      }

    createBattle()
    {
        if(this.networks.length>0)
        {
            for(let i=-(this.cols-1)/2*2000;i<=(this.cols-1)/2*2000;i+=2000)
            {
                for(let j=-(this.rows-1)/2*1000;j<=(this.rows-1)/2*1000;j+=1000)
                {
                    let w1=new Warrior(this,i-500,j+300,{baseX:i,baseY:j,brain:this.networks.pop()});
                    let w2=new Warrior(this,i+500,j+300,{baseX:i,baseY:j,brain:this.networks.pop()});
                    w2.setFlipped();
                    w1.setEnemy(w2);
                    w2.setEnemy(w1);

                    this.warriors.push(w1);
                    this.warriors.push(w2);
                }
            }
            this.time.delayedCall(this.battleTime-500,this.endBattle,[],this);
            this.time.delayedCall(this.battleTime,this.createBattle,[],this);
        }
        else
        {
            this.evolution.networks=this.walhalla;
            
            this.evolution.evolve();
            this.game.data=this.evolution.currentBests;
            this.game.saveUserData();
            console.log(this.game.data);

            this.networks=this.evolution.getNetworks();
            this.walhalla=[];

            let sumFitness=0;
            for(let i of this.evolution.networks)
            {
                sumFitness+=i.fitness;
            }
            console.log(this.evolution,sumFitness);

            this.time.delayedCall(this.battleTime,this.createBattle,[],this);
        }
    }

    endBattle()
    {
        for(let i of this.warriors)
        {
            let brain=i.brain;

            if(!i.alive && i.enemy.alive)
            {
                brain.setFitness(-40);
            }
            else if(i.alive && i.enemy.alive)
            {
                brain.setFitness(-30);
            }
            else if(!i.alive && !i.enemy.alive)
            {
                brain.setFitness(-4);
            }
            else if(i.alive && !i.enemy.alive)
            {
                brain.setFitness(-2);
            }
        
            
            this.walhalla.push(brain);
        }
        for(let i of this.warriors)
        {
            i.destroy();
        }
        this.warriors=[];
    }

    createGame()
    {
        this.cameras.main.zoom=0.6;
        let wbn=Math.floor(Math.random()*nn_14_8_5_20.length);
        let brain=new Network(nn_14_8_5_20[wbn].weights);
        let w1=new Warrior(this,-500,300,{baseX:0,baseY:0,brain:null});
        w1.destroyFunc=()=>{
            if(w1.brain)
            {
                if(this.gameMode==="game")
                {
                    this.killsCounter.score+=1;
                    if(this.killsCounter.score>this.killsRecord.record)
                    {
                        this.killsRecord.record=this.killsCounter.score;
                        this.game.data.record=this.killsRecord.record;
                        this.game.saveUserData();
                    }
                }
                
                this.addWarrior(false);
            }
            else
            {
                this.killsCounter.score=0;
                this.addWarrior(true);
            }
            this.updateInfo();
        }
        let ebn=Math.floor(Math.random()*nn_14_8_5_20.length);
        let enemyBrain=new Network(nn_14_8_5_20[ebn].weights);
        let w2=new Warrior(this,500,300,{baseX:0,baseY:0,brain:enemyBrain});
        w2.destroyFunc=()=>{
            if(w2.brain)
            {
                if(this.gameMode==="game")
                {
                    this.killsCounter.score+=1;
                    if(this.killsCounter.score>this.killsRecord.record)
                    {
                        this.killsRecord.record=this.killsCounter.score;
                        this.game.data.record=this.killsRecord.record;
                        this.game.saveUserData();
                    }
                }
                
                this.addWarrior(false);
            }
            else
            {
                this.killsCounter.score=0;
                this.addWarrior(true);
            }
            this.updateInfo();
        }
        w2.setFlipped();
        w1.setEnemy(w2);
        w2.setEnemy(w1);
        this.warriors.push(w1);
        this.warriors.push(w2);
    }

    createPresentation()
    {
        this.cameras.main.zoom=0.6;
        let wbn=Math.floor(Math.random()*nn_14_8_5_20.length);
        let brain=new Network(nn_14_8_5_20[wbn].weights);
        let w1=new Warrior(this,-500,300,{baseX:0,baseY:0,brain:brain});
        w1.destroyFunc=()=>{
            if(w1.brain)
            {
                if(this.gameMode==="game")
                {
                    this.killsCounter.score+=1;
                    if(this.killsCounter.score>this.killsRecord.record)
                    {
                        this.killsRecord.record=this.killsCounter.score;
                        this.game.data.record=this.killsRecord.record;
                        this.game.saveUserData();
                    }
                }
                
                this.addWarrior(false);
            }
            else
            {
                this.killsCounter.score=0;
                this.addWarrior(true);
            }
            this.updateInfo();
        }
        let ebn=Math.floor(Math.random()*nn_14_8_5_20.length);
        let enemyBrain=new Network(nn_14_8_5_20[ebn].weights);
        let w2=new Warrior(this,500,300,{baseX:0,baseY:0,brain:enemyBrain});
        w2.destroyFunc=()=>{
            if(w2.brain)
            {
                if(this.gameMode==="game")
                {
                    this.killsCounter.score+=1;
                    if(this.killsCounter.score>this.killsRecord.record)
                    {
                        this.killsRecord.record=this.killsCounter.score;
                        this.game.data.record=this.killsRecord.record;
                        this.game.saveUserData();
                    }
                }
                
                this.addWarrior(false);
            }
            else
            {
                this.killsCounter.score=0;
                this.addWarrior(true);
            }
            this.updateInfo();
        }
        w2.setFlipped();
        w1.setEnemy(w2);
        w2.setEnemy(w1);
        this.warriors.push(w1);
        this.warriors.push(w2);
    }

    update ()
    {
        for(let i of this.warriors)
        {
            i.update();
        }
    }
}


