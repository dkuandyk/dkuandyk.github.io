import Daggerman from './Daggerman.js'
import Room from './Room.js'
import {Q} from './nns.js'

export default class TournierManager
{
    constructor(scene, config)
    {
        this.scene=scene;
        this.config=config;
        this.cols=config.cols;
        this.rows=config.rows;
        this.battleTime=config.battleTime;

        this.networks=[];

        this.warriors=[];

        this.scene.cameras.main.zoom=0.1;

        let clusters=Q;

        for(let i of clusters)
        {
            for(let j of i)
            {
                //if(j.typeOfCreature==='prey')
                //if(j.typeOfCreature==='kamikaze')
                //if(j.typeOfCreature==='hunter')
                {
                    let brain=j.weights;
                
                    let network=new Network(brain);
                    
                    this.networks.push(network);
                }
            }
        }

        this.roomWidth=2000;

        new Room(this.scene,this.cols,this.rows,this.roomWidth);

        this.networks=shuffle(this.networks);

        console.log(this.networks);

        this.pairs=[];

        for(let i=0;i<this.networks.length;i+=10)
        {
            for(let j=i;j<i+10;j++)
            {
                for(let k=j+1;k<i+10;k++)
                {
                    this.pairs.push([j,k]);
                }
            }
        }
        
        console.log(this.pairs);
        
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
            let dataToSave=[];

            this.networks=quickSort(this.networks);
            
            console.log('-------datatosave-------');

            for(let i=0;i<50;i++)
            {
                dataToSave.push(this.networks.pop());
            }

            console.log(dataToSave);

            download('tournier_100',JSON.stringify(dataToSave));
        }
    }

    endBattle()
    {
        for(let i of this.warriors)
        {            
            let prize=0;

            if(!i.alive && i.enemy.alive)
            {
                prize=1;
            }
            else if(!i.alive && !i.enemy.alive)
            {
                prize=5;
            }
            else if(i.alive && i.enemy.alive)
            {
                prize=10;
            }
            else if(i.alive && !i.enemy.alive)
            {
                prize=100;
            }

            this.networks[i.brainNumber].addFitness(prize);
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