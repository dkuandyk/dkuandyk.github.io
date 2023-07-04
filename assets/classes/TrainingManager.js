import Daggerman from './Daggerman.js'
import Room from './Room.js'

export default class TrainingManager
{
    constructor(scene, config)
    {
        this.scene=scene;
        this.config=config;
        this.cols=config.cols;
        this.rows=config.rows;
        this.battleTime=config.battleTime;
        this.populationSize=config.populationSize||100;
        this.createFromStorage=config.createFromStorage;

        this.scene.cameras.main.zoom=0.1;

        this.warriors=[];
        this.walhalla=[];

        this.roomWidth=2000;

        new Room(this.scene,this.cols,this.rows,this.roomWidth);

        let previousNetworks=false;
        if(this.createFromStorage)
        {
            previousNetworks=this.scene.game.data;
        }

        this.iteration=0;

        this.evolution=new Evolution(this.scene,{model:[26,7,5],populationSize:this.populationSize,mutationRate:0.01,sliceRate:0.35,usePrevious:previousNetworks});
        this.networks=this.evolution.getNetworks();
        
        for(let i of this.networks)
        {
            i.fitness=1000;
        }

        this.pairs=[];

        for(let i=0;i<=this.networks.length-2;i+=2)
        {
            this.pairs.push([i,i+1]);
        }

        this.createBattle();
    }

    createBattle()
    {
        if(this.pairs.length>0)
        {
            for(let i=-(this.cols-1)/2*2000;i<=(this.cols-1)/2*2000;i+=2000)
            {
                for(let j=-(this.rows-1)/2*1000;j<=(this.rows-1)/2*1000;j+=1000)
                {
                    if(this.pairs.length>0)
                    {
                        let currentPair=this.pairs.pop();
                        let br1=this.networks[currentPair[0]];
                        let br2=this.networks[currentPair[1]];
                        let w1=new Daggerman(this.scene,i-500,j+300,{baseX:i,baseY:j,brain:br1,muted:true});
                        let w2=new Daggerman(this.scene,i+500,j+300,{baseX:i,baseY:j,brain:br2,muted:true});
                        w1.brainNumber=currentPair[0];
                        w2.brainNumber=currentPair[1];
                        w1.setEnemy(w2);
                        w2.setEnemy(w1);
                        
                        this.warriors.push(w1);
                        this.warriors.push(w2);
                    }
                }
            }
            this.scene.time.delayedCall(this.battleTime-500,this.endBattle,[],this);
            this.scene.time.delayedCall(this.battleTime,this.createBattle,[],this);
        }
        else
        {
            this.iteration+=1;

            if(this.iteration<=5)
            {
                //this.networks=shuffle(this.networks);
                this.networks=quickSort(this.networks);
                
                console.log(this.networks);
                
                for(let i of this.networks)
                {
                    i.fitness=1000;
                }
        
                this.pairs=[];
        
                for(let i=0;i<=this.networks.length-2;i+=2)
                {
                    this.pairs.push([i,i+1]);
                }

                this.pairs=[];
        
                for(let i=0;i<=this.networks.length-2;i+=2)
                {
                    this.pairs.push([i,i+1]);
                }

                this.createBattle();
            }
            else
            {
                this.iteration=0;

                this.evolution.networks=this.networks;
            
                this.evolution.evolve();
                this.scene.game.data=this.evolution.currentBests;
                this.scene.game.saveUserData();
                console.log(this.scene.game.data);

                this.networks=this.evolution.getNetworks();
                this.walhalla=[];

                this.scene.time.delayedCall(this.battleTime,this.createBattle,[],this);
            }            
        }
    }

    endBattle()
    {
        for(let i of this.warriors)
        {            
            let prize=0;

            if(!i.alive && i.enemy.alive)
            {
                prize=0;
            }
            else if(!i.alive && !i.enemy.alive)
            {
                prize=0.5;
            }
            else if(i.alive && i.enemy.alive)
            {
                prize=0.5;
            }
            else if(i.alive && !i.enemy.alive)
            {
                prize=1;
            }

            let currentFitness=this.networks[i.brainNumber].fitness;
            let currentEnemyFitness=this.networks[i.enemy.brainNumber].fitness;

            let expected=1/(1+10**((currentEnemyFitness-currentFitness)/400));

            let newFitness=currentFitness+10*(prize-expected);

            this.networks[i.brainNumber].setFitness(newFitness);
        }
        for(let i of this.warriors)
        {
            i.destroy();
        }
        this.warriors=[];
    }

    update()
    {
        for(let i of this.warriors)
        {
            i.update();
        }
    }
}