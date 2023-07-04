import Daggerman from './Daggerman.js'
import Room from './Room.js'
import {Q} from './nns.js'

export default class TrainingManagerSeparate
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
        this.numberOfClusters=config.numberOfClusters;

        //this.scene.cameras.main.zoom=0.203;
        this.scene.cameras.main.zoom=0.1;

        this.generationCounter=0;

        this.memory={};

        this.clusters=[];

        this.warriors1=[];
        this.walhalla1=[];

        this.warriors2=[];
        this.walhalla2=[];

        this.roomWidth=2000;

        new Room(this.scene,this.cols,this.rows,this.roomWidth);

        if(this.createFromStorage)
        {            
            //let previousClusters=readTextFile('generation_150.txt');
            let previousClusters=Q;
            previousClusters=shuffle(previousClusters);
            for(let i=0;i<previousClusters.length;i++)
            {
                //console.log(previousClusters[i])
                let evolution=new Evolution(this.scene,{model:[],populationSize:previousClusters[i].length,
                    mutationRate:0.02,sliceRate:0.3,usePrevious:previousClusters[i]});
                let networks=evolution.getNetworks();

                this.clusters.push({
                    evolution:evolution,
                    networks:networks,
                });
            }
        }
        else
        {
            for(let i=0;i<this.numberOfClusters;i++)
            {
                let evolution=new Evolution(this.scene,{model:[26,5,5],populationSize:this.populationSize,
                    mutationRate:0.02,sliceRate:0.3,usePrevious:false});
                
                if(i%3===0)
                {
                    evolution.typeOfCreature='hunter';
                }
                else if(i%3===1)
                {
                    evolution.typeOfCreature='prey';
                }
                else if(i%3===2)
                {
                    evolution.typeOfCreature='kamikaze';
                }

                let networks=evolution.getNetworks();
                
                this.clusters.push({
                    evolution:evolution,
                    networks:networks,
                });
            }
        }

        console.log(this.clusters);

        this.createBattle();
        
    }

    createBattle()
    {
        if(this.clusters[0].networks.length>0)
        {
            for(let i=-(this.cols-1)/2*2000;i<=(this.cols-1)/2*2000;i+=2000)
            {
                for(let j=-(this.rows-1)/2*1000;j<=(this.rows-1)/2*1000;j+=1000)
                {
                    let w1=new Daggerman(this.scene,i-500-100*Math.random(),j+300-100*Math.random(),{baseX:i,baseY:j,brain:this.clusters[0].networks.pop(),muted:true});
                    let w2=new Daggerman(this.scene,i+500+100*Math.random(),j+300-100*Math.random(),{baseX:i,baseY:j,brain:this.clusters[1].networks.pop(),muted:true});
                    w1.setEnemy(w2);
                    w2.setEnemy(w1);

                    this.warriors1.push(w1);
                    this.warriors2.push(w2);
                }
            }
            this.scene.time.delayedCall(this.battleTime-500,this.endBattle,[],this);
            this.scene.time.delayedCall(this.battleTime,this.createBattle,[],this);
        }
        else
        {
            this.clusters[0].evolution.networks=this.walhalla1;
            this.clusters[1].evolution.networks=this.walhalla2;
            
            this.clusters[0].evolution.evolve();
            this.clusters[1].evolution.evolve();
            
            this.clusters[0].networks=this.clusters[0].evolution.getNetworks();
            this.clusters[1].networks=this.clusters[1].evolution.getNetworks();

            this.generationCounter+=1;
            console.log(this.clusters);

            if(this.generationCounter%10===0)
            {
                let dataToSave=[];
                for(let i of this.clusters)
                {
                    let currentNetworks=[];
                    for(let j of i.networks)
                    {
                        currentNetworks.push(j);
                    }
                    dataToSave.push(currentNetworks);
                }
                //this.scene.game.data=dataToSave;
                
                //this.scene.game.saveUserData();
                console.log('-------datatosave-------');
                console.log(dataToSave);

                let memoryOfGeneration=[];

                for(let i of this.clusters)
                {
                    let currentNetworks=[];
                    for(let j of i.networks)
                    {
                        if(Math.random()<0.05)
                        {
                            currentNetworks.push(j);
                        }
                    }
                    memoryOfGeneration.push(currentNetworks);
                }

                let key=String(this.generationCounter);
                this.memory[key]=memoryOfGeneration;

                download('generation_'+this.generationCounter,JSON.stringify(dataToSave));
                if(this.generationCounter%50===0)
                {
                    download('memory',JSON.stringify(this.memory));
                }
            }

            this.walhalla1=[];
            this.walhalla2=[];
            
            this.clusters=shuffle(this.clusters);

            while(this.clusters[0].evolution.typeOfCreature===this.clusters[1].evolution.typeOfCreature
                 && this.clusters[0].evolution.typeOfCreature!=='hunter')
            {
                this.clusters=shuffle(this.clusters);
            }

            this.scene.time.delayedCall(500,this.createBattle,[],this);
        }
    }

    endBattle()
    {
        for(let i of this.warriors1)
        {
            let brain=i.brain;
            
            if(!i.alive && i.enemy.alive)
            {
                brain.setFitness(-8);
            }
            else if(!i.alive && !i.enemy.alive)
            {
                brain.setFitness(-6);
            }
            else if(i.alive && i.enemy.alive)
            {
                brain.setFitness(-4);
            }
            else if(i.alive && !i.enemy.alive)
            {
                brain.setFitness(-2);
            }
            
            this.walhalla1.push(brain);

        }        

        for(let i of this.warriors2)
        {
            let brain=i.brain;
            
            if(!i.alive && i.enemy.alive)
            {
                brain.setFitness(-8);
            }
            else if(!i.alive && !i.enemy.alive)
            {
                brain.setFitness(-6);
            }
            else if(i.alive && i.enemy.alive)
            {
                brain.setFitness(-4);
            }
            else if(i.alive && !i.enemy.alive)
            {
                brain.setFitness(-2);
            }          
            
            this.walhalla2.push(brain);

        }
        for(let i of this.warriors1)
        {
            i.destroy();
        }
        this.warriors1=[];
        for(let i of this.warriors2)
        {
            i.destroy();
        }
        this.warriors2=[];
    }
    
    update()
    {
        for(let i of this.warriors1)
        {
            i.update();
        }
        for(let i of this.warriors2)
        {
            i.update();
        }
    }
}


