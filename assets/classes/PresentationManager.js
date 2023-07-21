import Daggerman from './Daggerman.js'
import Swordsman from './Swordsman.js';
import Needleman from './Needleman.js';
import Button from './Button.js';
import Room from './Room.js'
import {Q} from './nns.js'
import {B} from './best_nns.js'

export default class PresentationManager
{
    constructor(scene, config)
    {
        this.scene=scene;
        this.config=config;

        this.scene.cameras.main.zoom=0.6;
        
        this.warriors=[];
        this.walhalla=[];

        new Room(this.scene,1,1);

        this.createGUI();

        /*
        this.slicedClusters=B;

        for(let i=this.slicedClusters.length-1;i>=0;i--)
        {
            if(i===2 || i===4 || i===6 || i===9 || i===13 || i===20 || i===23 || i===25 || i===28 || i===31
                || i===34 || i===44)
            {
                this.slicedClusters.splice(i,1);
                
            }
        }
        console.log(this.slicedClusters);
        */
        
        this.instructions = scene.add.image(-70, 0, 'instructions');

        let playButton=new Button(this.scene,0,70,()=>{
            
            this.createGame();
            playButton.destroy();
            this.killsCounter.setVisible(true);
            this.killsRecord.setVisible(true);
            this.scene.tweens.add({
                targets:[this.killsCounter,this.killsRecord],
                scale:1,
                duration:500,
                ease:"Back.Out"
            });

            this.scene.tweens.add({
                targets:this.instructions,
                scale:0,
                duration:500,
                ease:'Back.In',
                onComplete:()=>{
                    this.instructions.destroy();
            }});

        },'play');

        let enlargeButton=new Button(this.scene,-160,-320,()=>{
            if (this.scene.scale.isFullscreen)
            {
                enlargeButton.image.setTexture('enlarge');
            }
            else
            {
                enlargeButton.image.setTexture('enmin');
            }
            this.scene.scale.toggleFullscreen();
        },'enlarge');

        if (this.scene.scale.isFullscreen)
        {
            enlargeButton.image.setTexture('enmin');
        }
        else
        {
            enlargeButton.image.setTexture('enlarge');
        }

        let restartButton=new Button(this.scene,0,-320,()=>{
            //this.scene.stop("Main");
            //this.scene.start("Preloader");
            this.scene.scene.restart();
        },'restart');

        this.scene.sound.mute=false;
        let soundButton=new Button(this.scene,160,-320,()=>{
            if(this.scene.sound.mute)
            {
                this.scene.sound.mute=false;
                soundButton.image.setTexture("soundOn");
            }
            else
            {
                this.scene.sound.mute=true;
                soundButton.image.setTexture("soundOff");
            }
        },'soundOn');
    }

    clearWarriors()
    {
        this.killsCounter.score=0;
        for(let i of this.warriors)
        {
            i.clear();
        }
        this.warriors=[];
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
            let w=new Daggerman(this.scene,posX,300*Math.random(),{baseX:0,baseY:0,brain:null});
            w.destroyFunc=()=>{
                removeItemOnce(this.warriors,w);
                if(w.brain)
                {
                    this.killsCounter.score+=1;
                    if(this.killsCounter.score>this.killsRecord.record)
                    {
                        this.killsRecord.record=this.killsCounter.score;
                        this.scene.game.data.record=this.killsRecord.record;
                        this.scene.game.saveUserData();
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
            let clusterToUse=B;
            let wbn=Math.floor(Math.random()*clusterToUse.length);
            let enemyBrain=new Network(clusterToUse[wbn].weights);
            
            //console.log(clusterToUse[wbn].typeOfCreature);
            
            let w=new Daggerman(this.scene,posX,300*Math.random(),{baseX:0,baseY:0,brain:enemyBrain});
            w.destroyFunc=()=>{
                removeItemOnce(this.warriors,w);
                if(w.brain)
                {
                    
                    this.killsCounter.score+=1;
                    if(this.killsCounter.score>this.killsRecord.record)
                    {
                        this.killsRecord.record=this.killsCounter.score;
                        this.scene.game.data.record=this.killsRecord.record;
                        this.scene.game.saveUserData();
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
        this.warriors[0].setEnemy(this.warriors[1]);
        this.warriors[1].setEnemy(this.warriors[0]);
    }
    
    createGame()
    {
        this.scene.cameras.main.zoom=0.6;
        
        let clusterToUse=B;

        let wbn=Math.floor(Math.random()*clusterToUse.length);
        let brain=new Network(clusterToUse[wbn].weights);
        let w1=new Daggerman(this.scene,-500,300,{baseX:0,baseY:0,brain:null});
        
        let ebn=Math.floor(Math.random()*clusterToUse.length);
        let enemyBrain=new Network(clusterToUse[ebn].weights);
        let w2=new Daggerman(this.scene,500,300,{baseX:0,baseY:0,brain:enemyBrain});

        w1.destroyFunc=()=>{
            removeItemOnce(this.warriors,w1);
            if(w1.brain)
            {
                this.killsCounter.score+=1;
                if(this.killsCounter.score>this.killsRecord.record)
                {
                    this.killsRecord.record=this.killsCounter.score;
                    this.scene.game.data.record=this.killsRecord.record;
                    this.scene.game.saveUserData();
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
        w2.destroyFunc=()=>{
            removeItemOnce(this.warriors,w2);
            if(w2.brain)
            {
                this.killsCounter.score+=1;
                if(this.killsCounter.score>this.killsRecord.record)
                {
                    this.killsRecord.record=this.killsCounter.score;
                    this.scene.game.data.record=this.killsRecord.record;
                    this.scene.game.saveUserData();
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
        
        w1.setEnemy(w2);
        w2.setEnemy(w1);
        this.warriors.push(w1);
        this.warriors.push(w2);

        this.createGUI();
    }

    createGUI()
    {
        this.killsCounter = this.scene.add.text(-850, -400, "score : 0", {font: "90px customFont"})
            .setOrigin(0,0)
            .setDepth(100)
            .setTint(0x1e1e1e)
            .setVisible(false)
            .setScale(0.01);
        this.killsCounter.score=0;
        this.killsRecord = this.scene.add.text(850, -400, "record : 0", {font: "90px customFont"})
            .setOrigin(1,0)
            .setDepth(100)
            .setTint(0x1e1e1e)
            .setVisible(false)
            .setScale(0.01);
        this.killsRecord.record=this.scene.game.data.record||0;

        this.updateInfo();
    }
    
    updateInfo()
    {
        this.killsCounter.setText("score : "+this.killsCounter.score);
        this.killsRecord.setText("record : "+this.killsRecord.record);
    }
    
    update(time,dt)
    {
        let centerX=0;
        let centerY=0;
        for(let i of this.warriors)
        {
            i.update(time,dt);
            //centerX+=i.physicBody.x/this.warriors.length;
            //centerY+=i.physicBody.y/this.warriors.length;
        }
        //this.scene.cameras.main.centerOn(centerX,0);
    }
}