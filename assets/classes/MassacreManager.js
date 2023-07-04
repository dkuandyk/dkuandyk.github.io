import Daggerman from './Daggerman.js'
import Room from './Room.js'
import {Q} from './nns.js'

export default class MassacreManager
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
        this.walhalla=[];

        this.scene.cameras.main.zoom=0.1;

        let clusters=Q;

        this.prizeScale=1;

        for(let i of clusters)
        {
            for(let j of i)
            {
                let brain=j.weights;
            
                let network=new Network(brain);
                network.score=0;
                this.networks.push(network);
            }
        }

        this.roomWidth=2000;

        new Room(this.scene,this.cols,this.rows,this.roomWidth);

        this.networks=shuffle(this.networks);

        this.networks=quickSort(this.networks);

        console.log(this.networks);

        this.pairs=[];
        
        while(this.networks.length>=2)
        {
            let pair=[this.networks.pop(),this.networks.pop()];
            this.pairs.push(pair);
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
                        let w1=new Daggerman(this.scene,i-500,j+300,{baseX:i,baseY:j,brain:currentPair[0],muted:true});
                        let w2=new Daggerman(this.scene,i+500,j+300,{baseX:i,baseY:j,brain:currentPair[1],muted:true});
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
            if(this.walhalla.length>100)
            {
                this.networks=this.walhalla;
                
                this.networks=quickSort(this.networks);
                
                let numberToDiscount=this.networks.length*0.35;
                
                for(let i=0;i<numberToDiscount;i++)
                {
                    this.networks.pop();
                }

                console.log(this.networks);
        
                this.prizeScale+=0.3;

                this.pairs=[];
        
                this.networks=shuffle(this.networks);

                while(this.networks.length>=2)
                {
                    let pair=[this.networks.pop(),this.networks.pop()];
                    this.pairs.push(pair);
                }
                this.walhalla=[];
                
                this.scene.time.delayedCall(500,this.createBattle,[],this);
            }
            else
            {
                this.networks=this.walhalla;

                console.log('-------datatosave-------');
                console.log(this.networks);

                download('bests_100',JSON.stringify(this.networks));
            }
        }
    }

    endBattle()
    {
        for(let i of this.warriors)
        {
            let brain=i.brain;
            
            let prize=0;

            if(!i.alive && i.enemy.alive)
            {
                prize=1;
                this.walhalla.push(brain);
            }
            else if(!i.alive && !i.enemy.alive)
            {
                prize=5;
                this.walhalla.push(brain);
            }
            else if(i.alive && i.enemy.alive)
            {
                prize=7;
                this.walhalla.push(brain);
            }
            else if(i.alive && !i.enemy.alive)
            {
                prize=30;
                this.walhalla.push(brain);
            }

            prize*=this.prizeScale;

            brain.score=prize;

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