
class Evolution
{
    constructor(scene,config)
    {
        this.scene=scene;
        this.model=config.model;
        this.populationSize=config.populationSize||500;
        this.mutationRate=config.mutationRate||0.1;
        this.sliceRate=config.sliceRate||0.3;
        this.usePrevious=config.usePrevious;
        this.generation=1;
        
        this.networks=[];
        this.currentBests=[];

        this.typeOfCreature=['hunter','prey','kamikaze'][Math.floor(3*Math.random())];
        this.typeOfCreature='hunter';

        if(this.usePrevious)
        {
            this.createFromStorage();
        }
        else
        {
            for(let i=0;i<this.populationSize;i++)
            {
                let brain=this.createBrain(this.model);
                let network=new Network(brain);
                this.networks.push(network);
            }
        }
    }

    createFromStorage()
    {
        let temporaryNetworkStorage=this.usePrevious;

        this.networks=[];

        //loop:
        //while(true)
        //console.log(temporaryNetworkStorage)
        for(let i=0;i<temporaryNetworkStorage.length;i++)
        {
            let brain=temporaryNetworkStorage[i].weights;
            
            let network=new Network(brain);

            this.networks.push(network);

            //if(this.networks.length>=this.populationSize)
            {
                //break loop;
            }
        }
            
        

        this.generation+=1;
    }

    evolve()
    {
        let temporaryNetworkStorage=[];

        /*
        let species=this.getSpecies();

        for(let i of species)
        {
            let networksToAdd=this.getBests(i,i.length*0.3);

            for(let j of networksToAdd)
            {
                temporaryNetworkStorage.push(j);
            }
        }
        
        temporaryNetworkStorage=this.getBests(temporaryNetworkStorage,this.populationSize*0.3);
        */

        //temporaryNetworkStorage=this.getBests(this.networks,this.populationSize*this.sliceRate);
        
        //temporaryNetworkStorage=this.getBests(this.networks,this.sliceRate);

        temporaryNetworkStorage=this.getTopTier(this.networks);

        this.currentBests=temporaryNetworkStorage;

        this.networks=[];

        loop:
        while(true)
        {
            temporaryNetworkStorage=shuffle(temporaryNetworkStorage);
            for(let i=0;i<temporaryNetworkStorage.length-2;i+=2)
            {
                let parent1=temporaryNetworkStorage[i];
                let parent2=temporaryNetworkStorage[i+1];

                let brain=this.crossover(parent1.weights,parent2.weights);

                if(Math.random()<0.9)
                {
                    //brain=this.mutate(brain,Math.min(this.mutationRate,Math.abs(averageFitness)*0.01));
                    //brain=this.mutate(brain,Math.max(this.mutationRate-(this.generation/500),0.01));
                    brain=this.mutate(brain,Math.max(this.mutationRate,0.01));
                }

                let network=new Network(brain);
                network.typeOfCreature=this.typeOfCreature;
                this.networks.push(network);

                if(this.networks.length>=this.populationSize)
                {
                    break loop;
                }
            }
            
        }

        this.generation+=1;
    }

    getEvolvedNetworks()
    {
        return this.networks;
    }

    getBest()
    {
        return this.getBests(this.networks,1)[0];
    }

    getTopTier(networks)
    {
        let networksToAdd=[];
        let topTier=[];
        let secondTier=[];
        let thirdTier=[];
        let fourthTier=[];
        let maxFitness=-Infinity;
        let secondMaxFitness=-Infinity;
        let thirdMaxFitness=-Infinity;
        let fourthMaxFitness=-Infinity;

        for(let j of networks)
        {
            if(j.fitness>=maxFitness)
            {
                maxFitness=j.fitness;
            }
            else if(j.fitness>=secondMaxFitness)
            {
                secondMaxFitness=j.fitness;
            }
            else if(j.fitness>=thirdMaxFitness)
            {
                thirdMaxFitness=j.fitness;
            }
            else if(j.fitness>=fourthMaxFitness)
            {
                fourthMaxFitness=j.fitness;
            }
        }
        for(let j of networks)
        {
            if(j.fitness===maxFitness)
            {
                topTier.push(j);
            }
            else if(j.fitness===secondMaxFitness)
            {
                secondTier.push(j);
            }
            else if(j.fitness===thirdMaxFitness)
            {
                thirdTier.push(j);
            }
            else if(j.fitness===fourthMaxFitness)
            {
                fourthTier.push(j);
            }
        }
        
        if(this.typeOfCreature==='hunter')
        {
            for(let j of topTier)
            {
                networksToAdd.push(j);
            }
    
            for(let j=0;j<Math.min(topTier.length*0.5,secondTier.length);j++)
            {
                networksToAdd.push(secondTier[j]);
            }
            
            for(let j=0;j<Math.min(topTier.length*0.3,thirdTier.length);j++)
            {
                networksToAdd.push(thirdTier[j]);
            }
            
            for(let j=0;j<Math.min(topTier.length*0.1,fourthTier.length);j++)
            {
                networksToAdd.push(fourthTier[j]);
            }
        }
        else if(this.typeOfCreature==='prey')
        {
            for(let j of secondTier)
            {
                networksToAdd.push(j);
            }
    
            for(let j=0;j<Math.min(secondTier.length*0.5,topTier.length);j++)
            {
                networksToAdd.push(topTier[j]);
            }
            
            for(let j=0;j<Math.min(secondTier.length*0.3,thirdTier.length);j++)
            {
                networksToAdd.push(thirdTier[j]);
            }
            
            for(let j=0;j<Math.min(secondTier.length*0.1,fourthTier.length);j++)
            {
                networksToAdd.push(fourthTier[j]);
            }
        }
        else if(this.typeOfCreature==='kamikaze')
        {
            for(let j of thirdTier)
            {
                networksToAdd.push(j);
            }
    
            for(let j=0;j<Math.min(thirdTier.length*0.5,topTier.length);j++)
            {
                networksToAdd.push(topTier[j]);
            }
            
            for(let j=0;j<Math.min(thirdTier.length*0.3,secondTier.length);j++)
            {
                networksToAdd.push(secondTier[j]);
            }
            
            for(let j=0;j<Math.min(thirdTier.length*0.1,fourthTier.length);j++)
            {
                networksToAdd.push(fourthTier[j]);
            }
        }
        
        return networksToAdd;
    }

    getBests(networks,numberOfNecessary)
    {
        let networksToAdd=[];
        
        networks=quickSort(networks);

        for(let i=0;i<networks.length*numberOfNecessary;i++)
        {
            networksToAdd.push(networks.pop());
        }

        return networksToAdd;
    }

    getSpecies()
    {
        let species=[];
        for(let i of this.networks)
        {
            if(species.length===0)
            {
                species.push([i]);
            }
            else
            {
                for(let j of species)
                {
                    if(this.areBrainsTopologySimilar(i.weights,j[0].weights))
                    {
                        j.push(i);
                        break;
                    }
                    else
                    {
                        species.push([i]);
                        break;
                    }
                }
            }
        }
        
        return species;
    }

    areBrainsTopologySimilar(a,b)
    {
        let differences=0;
        let networksLength=0;
        for(let k=0;k<a.length-1;k++)
        {
            for(let i=0;i<a[k+1];i++)
            {
                for(let j=0;j<a[k]+1;j++)
                {
                    if((a[i][j][k]===0 && b[i][j][k]!==0) || (a[i][j][k]!==0 && b[i][j][k]===0))
                    {
                        differences+=1;
                    }
                    networksLength+=1;
                }
            }
        }
        if(differences/networksLength<0.3)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    getNetworks()
    {
        return this.networks;
    }

    createBrain(a)
    {
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
        return brain;
    }

    crossover(a,b)
    {
        let c=[];
        for(let i=0;i<a.length;i++)
        {
            let rows=[];
            for(let j=0;j<a[i].length;j++)
            {
                let cols=[];
                for(let k=0;k<a[i][j].length;k++)
                {
                    if(Math.random()>0.5)
                    {
                        cols.push(a[i][j][k]);
                    }
                    else
                    {
                        cols.push(b[i][j][k]);
                    }
                }
                rows.push(cols);
            }
            c.push(rows);
        }
        return c;
    }

    mutate(a, randomness)
    {
        let c=[];
        for(let i=0;i<a.length;i++)
        {
            let rows=[];
            for(let j=0;j<a[i].length;j++)
            {
                let cols=[];
                for(let k=0;k<a[i][j].length;k++)
                {
                    if(Math.random()<randomness)
                    {
                        if(Math.random()<0.95)
                        {
                            cols.push(a[i][j][k]-1+2*Math.random());
                        }
                        else
                        {
                            cols.push(-10+20*Math.random());
                            //cols.push(-9999999999);
                        }
                    }
                    else
                    {
                        cols.push(a[i][j][k]);
                    }
                }
                rows.push(cols);
            }
            c.push(rows);
        }
        return c;
        
        /*
        if(Math.random()<randomness)
        {
            if(Math.random()<0.1)
            {
                //add connection
                for(let i=0;i<100;i++)
                {
                    let depth1=Math.floor(a.length*Math.random());
                    let depth2=Math.floor(a[depth1].length*Math.random());
                    let depth3=Math.floor(a[depth1][depth2].length*Math.random());
                    if(a[depth1][depth2][depth3]===0)
                    {
                        a[depth1][depth2][depth3]=-1+2*Math.random();
                        break;
                    }
                }
            }
            else
            {
                //change existing connection
                for(let i=0;i<100;i++)
                {
                    let depth1=Math.floor(a.length*Math.random());
                    let depth2=Math.floor(a[depth1].length*Math.random());
                    let depth3=Math.floor(a[depth1][depth2].length*Math.random());
                    if(a[depth1][depth2][depth3]===0)
                    {
                        a[depth1][depth2][depth3]=-1+2*Math.random();
                        break;
                    }
                }
            }
        }
        return a;
        */
    }
}

class Network
{
    constructor(brain)
    {
        this.weights=brain;
        this.fitness=-Infinity;
    }

    getOutput(input)
    {
        let output=input;
        for(let i=0;i<this.weights.length;i++)
        {
            output.push(1);
            output=this.multiply(this.weights[i],output);
            if(i<this.weights.length-1)
            {
                for(let j=0;j<output.length;j++)
                {
                    //output[j]=1/(1+Math.exp(-0.5*output[j]));
                    output[j]=Math.max(0,output[j]);
                }
            }
        }
        return output;
    }

    setFitness(fitness)
    {
        this.fitness=fitness;
    }

    addFitness(fitness)
    {
        if(this.fitness===-Infinity)
        {            
            this.fitness=fitness;
        }
        else
        {
            this.fitness+=fitness;
        }
    }

    setWeights(weights)
    {
        this.weights=weights;
    }

    getWeights()
    {
        return this.weights;
    }

    multiply(a,b)
    {
        let c=[];
        for(let i=0;i<a.length;i++)
        {
            let sum=0;
            let ifOutBoundsK=1;
            for(let j=0;j<a[i].length;j++)
            {
                sum+=a[i][j]*b[j];
                /*
                if(Math.abs(a[i][j])>9999999 || Math.abs(b[j])>9999999)
                {
                    ifOutBoundsK=0;
                }
            */
            }
            //sum*=ifOutBoundsK;
            c.push(sum);
        }
        return c;
    }

}


async function readTextFile(filename)
{
    let arrayToReturn=[];
    fetch("./"+filename)
    .then((response) => {
        let text=response.text();
        return text;
    })
    .then((text) => {
        let array=JSON.parse(text);
        return array;
    }).then((array) => {
        for(let i of array)
        {
            arrayToReturn.push(i);
        }
        //return arrayToReturn;
    });
    return arrayToReturn
}

async function readTextFile1(filename) {
    let url = "./"+filename;
    try {
        let res = await fetch(url);
        let text=await res.text();
        let array=await JSON.parse(text);
        return array;

    } catch (error) {
        console.log(error);
    }
}

function removeItemOnce(arr, value)
{
    var index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    //return arr;
}

function quickSort(arr) {
    if (arr.length < 2) return arr;
    let pivot = arr[0];
    const left = [];
    const right = [];
      
    for (let i = 1; i < arr.length; i++) {
      if (pivot.fitness > arr[i].fitness) {
        left.push(arr[i]);
      } else {
        right.push(arr[i]);
      }
    }
    return quickSort(left).concat(pivot, quickSort(right));
  }

function shuffle(array)
{
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
}

function antiLerp(start,end,value)
{
    let t=(value-start)/(end-start);
    return t;
}

   
function download(filename, text)
{
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
}