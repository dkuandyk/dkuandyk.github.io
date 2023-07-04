import Daggerman from './Daggerman.js'
import Room from './Room.js'
import {memory} from './memory.js'
import {B} from './best_nns.js'

export default class MemoryManager
{
    constructor(scene, config)
    {
        this.scene=scene;
        this.config=config;
        this.cols=config.cols;
        this.rows=config.rows;
        this.battleTime=config.battleTime;

        this.generation=0;

        this.networks=[];

        this.warriors=[];

        this.scene.cameras.main.centerOn(3000, -200);

        this.scene.cameras.main.zoom=0.09;

        this.generationCounter = this.scene.add.text(0, -3000, 'generation : '+this.generation, {font: "100px customFont"})
            .setOrigin(0.5)
            .setDepth(100)
            .setAlpha(0)
            .setTint(0x1e1e1e)
            .setScale(5);

        this.text = this.scene.add.text(6300, -100, ['Training','Neural Network','for game','',
            '(try yourself, link','in the description!)'], 
            {font: "100px customFont", align: 'center' })
            .setOrigin(0.5, 0.5)
            .setDepth(100)
            .setTint(0x0b1642)
            .setTint(0x1e1e1e)
            .setScale(5);


        this.scene.time.delayedCall(7000,()=>{
            this.updateText(['Creatures have','3 possible','movements']);
        },[],this);
        this.scene.time.delayedCall(14000,()=>{
            this.updateText(['Jump,','run','and dash']);
        },[],this);
        this.scene.time.delayedCall(21000,()=>{
            this.updateText(['Each creature','is controlled by a','Neural Network']);
        },[],this);
        this.scene.time.delayedCall(28000,()=>{
            this.updateText(['The input is','information about','the environment']);
        },[],this);
        this.scene.time.delayedCall(35000,()=>{
            this.updateText(['Position, speed,','ability to dash']);
        },[],this);
        this.scene.time.delayedCall(42000,()=>{
            this.updateText(['And the output','is action']);
        },[],this);
        this.scene.time.delayedCall(54000,()=>{
            this.updateText(['As a learning','method, I chose','the Genetic Algorithm']);
        },[],this);
        this.scene.time.delayedCall(63000,()=>{
            this.updateText(['On the left','you can see the','training process']);
        },[],this);
        this.scene.time.delayedCall(70000,()=>{
            this.updateText(['Each generation','splits into','pairs']);
        },[],this);        
        this.scene.time.delayedCall(77000,()=>{
            this.updateText(['Then they all','start a','BLOODBATH']);
        },[],this);
        this.scene.time.delayedCall(84000,()=>{
            this.updateText(['Those who lost','are thrown out']);
        },[],this);
        this.scene.time.delayedCall(91000,()=>{
            this.updateText(['The best Neural','Networks are passed','on to the next','generation']);
        },[],this);
        this.scene.time.delayedCall(98000,()=>{
            this.updateText(['With minor changes','(mutations)','and with','crossover']);
        },[],this);
        this.scene.time.delayedCall(105000,()=>{
            this.updateText(['As you can see,','early generations','were not that','smart']);
        },[],this);
        this.scene.time.delayedCall(112000,()=>{
            this.updateText(['They moved randomly','and rarely won']);
        },[],this);
        this.scene.time.delayedCall(119000,()=>{
            this.updateText(['But over time they','get better']);
        },[],this);
        this.scene.time.delayedCall(126000,()=>{
            this.updateText(['Creatures evolve']);
        },[],this);
        this.scene.time.delayedCall(133000,()=>{
            this.updateText(['Their movements','become more','precise']);
        },[],this);
        this.scene.time.delayedCall(140000,()=>{
            this.updateText(['They learn how','to attack']);
        },[],this);
        this.scene.time.delayedCall(147000,()=>{
            this.updateText(['And how to','dodge enemy','attacks']);
        },[],this);
        this.scene.time.delayedCall(154000,()=>{
            this.updateText(['Let me speed up the','process right away','to 1500 generation']);
        },[],this);
        this.scene.time.delayedCall(163000,()=>{
            this.updateText(['Ok, so these','are the real','killers']);
        },[],this);
        this.scene.time.delayedCall(170000,()=>{
            this.updateText(['They upgraded','their skills','so much']);
        },[],this);
        this.scene.time.delayedCall(177000,()=>{
            this.updateText(['So that they','can compete','with a human']);
        },[],this);
        this.scene.time.delayedCall(184000,()=>{
            this.updateText(['Moreover,','sometimes these','creatures act','too "human-like"']);
        },[],this);        
        this.scene.time.delayedCall(191000,()=>{
            this.updateText(['I will demonstrate.',"Let's play a game!"]);
        },[],this);
        this.scene.time.delayedCall(200000,()=>{
            this.updateText(['Cool, yeah?']);
        },[],this);
        this.scene.time.delayedCall(207000,()=>{
            this.updateText(['I think game devs can','use this approach','when creating AI','for their games']);
        },[],this);
        this.scene.time.delayedCall(214000,()=>{
            this.updateText(['And it is cool, because','it adds variety and','new experience to','the gameplay']);
        },[],this);
        this.scene.time.delayedCall(221000,()=>{
            this.updateText(['Even in such','simple projects','as this game']);
        },[],this);
        this.scene.time.delayedCall(228000,()=>{
            this.updateText(['I want to','make more games','with such AI']);
        },[],this);
        this.scene.time.delayedCall(235000,()=>{
            this.updateText(['Anyway, that is','all for today)']);
        },[],this);
        this.scene.time.delayedCall(242000,()=>{
            this.updateText(['Thanks for watching,','subscribe!','',
            '(and play yourself,','link in the','description!)']);
        },[],this);
        this.scene.time.delayedCall(270000,()=>{
            this.updateText(['']);
        },[],this);

        this.allMemories={};

        for(let i in memory)
        {
            this.allMemories[i]=[];
            for(let j of memory[i])
            {
                for(let k of j)
                {
                    if(k.typeOfCreature==='hunter')
                    {
                        this.allMemories[i].push(k);
                    }
                }
            }
        }

        for(let i=0;i<=70;i+=10)
        {
            if(this.allMemories[i])
            {
                console.log(this.allMemories[i]);
            }
            this.allMemories[i]=[];

            for(let q=0;q<30;q++)
            {
                let a=[26,5,5];
                let brain=[];
                for(let k=0;k<a.length-1;k++)
                {
                    let rows=[];
                    for(let i=0;i<a[k+1];i++)
                    {
                        let row=[];
                        for(let j=0;j<a[k]+1;j++)
                        {
                            if(Math.random()<0.95)
                                {
                                    row.push(-1+2*Math.random());
                                }
                                else
                                {
                                    row.push(-10+20*Math.random());
                                    //row.push(-9999999999);
                                }
                        }
                        rows.push(row);
                    }
                    brain.push(rows);
                }
                let network=new Network(brain);
                this.allMemories[i].push(network);
            }
        }

        this.allMemories[1500]=B;

        console.log(this.allMemories);

        this.roomWidth=2000;

        new Room(this.scene,this.cols,this.rows,this.roomWidth);
        
        this.createBattle();
    }

    updateText(textToUse)
    {
        console.log(this.text);
        this.scene.tweens.add({
            targets:this.text,
            alpha:0,
            duration:250,
            ease:'Linear',
            onComplete:()=>{
                this.text.setText(textToUse);
                this.scene.tweens.add({
                    targets:this.text,
                    alpha:1,
                    duration:250,
                    ease:'Linear',
                });
            }
        });
    }

    createBattle()
    {
        this.scene.tweens.add({
            targets:this.generationCounter,
            alpha:0,
            duration:250,
            ease:'Linear',
            onComplete:()=>{
                this.generationCounter.setText('generation : '+this.generation);
                this.scene.tweens.add({
                    targets:this.generationCounter,
                    alpha:1,
                    duration:250,
                    ease:'Linear',
                });
            }
        });

        console.log(this.generation);

        for(let i=-(this.cols-1)/2*2000;i<=(this.cols-1)/2*2000;i+=2000)
        {
            for(let j=-(this.rows-1)/2*1000;j<=(this.rows-1)/2*1000;j+=1000)
            {
                let currentMemory=this.allMemories[this.generation];

                let br1=currentMemory[Math.floor(Math.random()*currentMemory.length)];
                let br2=currentMemory[Math.floor(Math.random()*currentMemory.length)];

                let network1=new Network(br1.weights);
                let network2=new Network(br2.weights);

                let w1=new Daggerman(this.scene,i-500,j+300,{baseX:i,baseY:j,brain:network1,muted:true});
                let w2=new Daggerman(this.scene,i+500,j+300,{baseX:i,baseY:j,brain:network2,muted:true});

                w1.setEnemy(w2);
                w2.setEnemy(w1);

                this.warriors.push(w1);
                this.warriors.push(w2);
            }
        }
        

        this.scene.time.delayedCall(this.battleTime-100,this.endBattle,[],this);
        this.scene.time.delayedCall(this.battleTime,this.createBattle,[],this);
    }

    endBattle()
    {
        if(this.generation<10)
        {
            this.generation+=10;
        }
        else if(this.generation<150)
        {
            this.generation+=10;
        }
        else if(this.generation>=150)
        {
            this.generation=1500;
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