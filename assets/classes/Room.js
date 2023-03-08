
import {multiply} from './functions.js'

export default class Room
{
    
    constructor(scene, cols, rows)
    {
        this.scene=scene;
        this.objects=[];
        this.cols=cols;
        this.rows=rows;

        let width=2000;
        let height=1000;
        
        for(let i=0;i<cols+1;i++)
        {
            let object=this.scene.matter.add.image(-(width)*cols/2+width*i,0,'wall')
            .setScale(2,(rows)*height/100+2)
            .setStatic(true);
            object.type='wall';
            this.objects.push(object);
        }
        for(let i=0;i<rows+1;i++)
        {
            let object=this.scene.matter.add.image(0,-(height)*rows/2+height*i,'wall')
            .setScale((cols)*width/100+2,2)
            .setStatic(true);
            object.type='floor';
            this.objects.push(object);
        }

        return this.objects;
    }

   
}