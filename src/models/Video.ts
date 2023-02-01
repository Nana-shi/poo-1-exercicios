export class Video {
    constructor(
        private id: string,
        private title: string,
        private duration: number,
        private uploadDate: string
    ){}
    public getId():string{
        return this.id
    }
    public setId(value:string):void{
        this.id = value
    }
    public getTitle():string{
        return this.title
    }
    public setTitle(value:string):void{
        this.title = value
    }
    public getDuration():number{
        return this.duration
    }
    public setDuration(value:number):void{
        this.duration = value
    }
    public getUploadDate():string{
        return this.uploadDate
    }
    public setUploadDate(value:string):void{
        this.uploadDate = value
    }
}