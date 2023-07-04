import Daggerman from './Daggerman.js'
import Swordsman from './Swordsman.js';
import Needleman from './Needleman.js';
import Button from './Button.js';
import Room from './Room.js'
import {Q} from './nns.js'
import {B} from './best_nns.js'

export default class GuessManager3
{
    constructor(scene, config)
    {
        this.scene=scene;
        this.config=config;

        this.scene.cameras.main.zoom=0.6;
        
        this.warriors=[];
        this.walhalla=[];

        new Room(this.scene,1,1);

        this.answerTimer=46;
        
        this.scene.time.delayedCall(this.answerTimer*1000+11000,()=>{
            this.scene.scene.start('Memory5')
        },[],this);

        this.mark1=this.scene.add.image(0,-999,'mark2')
            .setOrigin(0.5,2.0)
            .setDepth(100)
            .setTint(0x0c8d96);
        this.mark2=this.scene.add.image(0,-999,'mark2')
            .setOrigin(0.5,2.0)
            .setDepth(100)
            .setTint(0x4f0a19);

        this.text = this.scene.add.text(0, -200,
            ["Ok, one more time. Find me!","Answer in "+Math.max(Math.floor(this.answerTimer))],
             {font: "70px customFont", align : 'center'})
            .setOrigin(0.5)
            .setDepth(-200)
            .setTint(0x1e1e1e);

        this.createGame();
    }

    clearWarriors()
    {
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
            let allClusters=Q;
            let clusterToUse=allClusters[Math.floor(allClusters.length*Math.random())];
            clusterToUse=B;
            let wbn=Math.floor(Math.random()*clusterToUse.length);
            let brain=new Network(clusterToUse[wbn].weights);

            let w=new Daggerman(this.scene,posX,300*Math.random(),{baseX:0,baseY:0,brain:brain});
            
            w.color=0x0c8d96;
            w.body.setTint(w.color);
            w.ears.setTint(w.color);
            w.sword.setTint(w.color);

            w.destroyFunc=()=>{
                removeItemOnce(this.warriors,w);
                if(w.color===0x0c8d96)
                {
                    this.addWarrior(true);
                }
                else
                {
                    this.addWarrior(false);
                }
            }
            this.warriors.push(w);
        }
        else
        {
            let allClusters=Q;
            let clusterToUse=allClusters[Math.floor(allClusters.length*Math.random())];
            clusterToUse=B;
            let wbn=Math.floor(Math.random()*clusterToUse.length);
            let enemyBrain=new Network(clusterToUse[wbn].weights);
            
            //console.log(clusterToUse[wbn].typeOfCreature);
            
            let w=new Daggerman(this.scene,posX,300*Math.random(),{baseX:0,baseY:0,brain:enemyBrain});

            w.color=0x4f0a19;
            w.body.setTint(w.color);
            w.ears.setTint(w.color);
            w.sword.setTint(w.color);
    
            w.destroyFunc=()=>{
                removeItemOnce(this.warriors,w);
                if(w.color===0x0c8d96)
                {
                    this.addWarrior(true);
                }
                else
                {
                    this.addWarrior(false);
                }
            }
            this.warriors.push(w);
        }
        this.warriors[0].setEnemy(this.warriors[1]);
        this.warriors[1].setEnemy(this.warriors[0]);
    }
    
    createGame()
    {
        this.scene.cameras.main.zoom=0.6;
        let allClusters=Q;
        //console.log(allClusters)
        let clusterToUse=allClusters[Math.floor(allClusters.length*Math.random())];
        clusterToUse=B;

        let wbn=Math.floor(Math.random()*clusterToUse.length);
        let brain=new Network(clusterToUse[wbn].weights);
        let w1=new Daggerman(this.scene,-500,300,{baseX:0,baseY:0,brain:brain});
        
        let ebn=Math.floor(Math.random()*clusterToUse.length);
        let enemyBrain=new Network(clusterToUse[ebn].weights);
        let w2=new Daggerman(this.scene,500,300,{baseX:0,baseY:0,brain:enemyBrain});

        w1.color=0x0c8d96;
        w1.body.setTint(w1.color);
        w1.ears.setTint(w1.color);
        w1.sword.setTint(w1.color);

        w2.color=0x4f0a19;
        w2.body.setTint(w2.color);
        w2.ears.setTint(w2.color);
        w2.sword.setTint(w2.color);

        w1.destroyFunc=()=>{
            removeItemOnce(this.warriors,w1);
            if(w1.color===0x0c8d96)
            {
                this.addWarrior(true);
            }
            else
            {
                this.addWarrior(false);
            }
        }
        w2.destroyFunc=()=>{
            removeItemOnce(this.warriors,w2);
            if(w2.color===0x0c8d96)
            {
                this.addWarrior(true);
            }
            else
            {
                this.addWarrior(false);
            }
        }
        
        w1.setEnemy(w2);
        w2.setEnemy(w1);
        this.warriors.push(w1);
        this.warriors.push(w2);
    }
    
    update(dt)
    {
        this.answerTimer-=dt/1000;

        if(this.answerTimer>0)
        {
            this.text.setText(["Ok, one more time. Find me!","Answer in "+Math.max(Math.floor(this.answerTimer))+' sec']);
        }
        else
        {
            this.text.setText(["Those are both AI (classic)"])
                .setAlign('center');
            for(let i of this.warriors)
            {
                if(i.color===0x0c8d96)
                {
                    this.mark1.setPosition(i.physicBody.x,i.physicBody.y);
                }
                else
                {
                    this.mark2.setPosition(i.physicBody.x,i.physicBody.y);
                }
            }
        }

        let centerX=0;
        let centerY=0;
        for(let i of this.warriors)
        {
            i.update();
            //centerX+=i.physicBody.x/this.warriors.length;
            //centerY+=i.physicBody.y/this.warriors.length;
        }
        //this.scene.cameras.main.centerOn(centerX,0);
    }
}