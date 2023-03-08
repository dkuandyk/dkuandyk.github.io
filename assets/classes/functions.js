
export function multiply(a,b)
{
    let c=[];
    for(let i=0;i<a.length;i++)
    {
        let sum=0;
        for(let j=0;j<a[i].length;j++)
        {
            sum+=a[i][j]*b[j];
        }
        c.push(sum);
    }
    return c;
}

export function createBrain(a)
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
                row.push(-1+2*Math.random());
            }
            rows.push(row);
        }
        brain.push(rows);
    }
    return brain;
}

export function crossover(a,b,randomness)
{
    let c=[];
    for(let i=0;i<a.length;i++)
    {
        let rows=[]
        for(let j=0;j<a[i].length;j++)
        {
            let cols=[];
            for(let k=0;k<a[i][j].length;k++)
            {
                if(Math.random()<randomness)
                {
                    cols.push(-1+2*Math.random());
                }
                else
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
                
            }
            rows.push(cols);
        }
        c.push(rows);
    }
    return c;
}


export function shuffle(array)
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