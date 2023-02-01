import express, { Request, Response } from 'express';
import cors from "cors"
import { db } from './database/knex';
import { TVideosDB } from './types';
import { Video } from './models/Video'

const app = express()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
    console.log(`Servidor rodando na porta ${3003}`)
})

app.get("/ping", (req: Request, res: Response) => {
    try {
        res.status(200).send({ message: "Pong" })
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.get("/videos", async (req: Request, res: Response) => {
    try {
        const results: TVideosDB[] = await db("videos")
        const videos: Video[] = results.map((result) =>
            new Video(
                result.id,
                result.title,
                result.duration,
                result.upload_date
            ))
        res.status(200).send(videos)
    } catch (error) {
        console.log(error)
        if (req.statusCode === 200) {
            res.status(500)
        }
        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.post("/videos", async (req: Request, res: Response) => {
    try {
        const { id, title, duration } = req.body
        if (typeof id !== "string") {
            res.status(400)
            throw new Error("'id' deve ser string")
        }
        if (typeof title !== "string") {
            res.status(400)
            throw new Error("'title' deve ser string")
        }
        if (typeof duration !== "number") {
            res.status(400)
            throw new Error("'duration' deve ser number")
        }
        const [videoDBExist]: TVideosDB[] | undefined[] = await db("videos").where({ id })
        if (videoDBExist) {
            res.status(400)
            throw new Error("'id' já existe")
        }
        const newVideo = new Video(
            id,
            title,
            duration,
            new Date().toLocaleString()
        )
        const newVideoDB: TVideosDB = {
            id: newVideo.getId(),
            title: newVideo.getTitle(),
            duration: newVideo.getDuration(),
            upload_date: newVideo.getUploadDate()
        }
        await db("videos").insert(newVideoDB)
        const [videoDB]: TVideosDB[] = await db("videos").where({ id })
        res.status(201).send(newVideo)
    } catch (error) {
        console.log(error)
        if (req.statusCode === 200) {
            res.status(500)
        }
        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.put("/videos/:id", async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const newId = req.body.id
        const newTitle = req.body.title
        const newDuration = req.body.duration
        if (newId !== undefined) {
            if (typeof newId !== "string") {
                res.status(400)
                throw new Error("'id' precisa ser string")
            }
        }
        if (newTitle !== undefined) {
            if (typeof newTitle !== "string") {
                res.status(400)
                throw new Error("'title' precisa ser string")
            }
        }
        if (newDuration !== undefined) {
            if (typeof newTitle !== "number") {
                res.status(400)
                throw new Error("'duration' precisa ser number")
            }
        }
        const [videosDB]: TVideosDB[] | undefined[] = await db("videos").where({ id })
        if (!videosDB) {
            res.status(404)
            throw new Error("'id' não encontrado")
        }
        const videoToEdit = new Video(
            newId,
            newTitle,
            newDuration,
            new Date().toLocaleString()
        )
        const updateVideoDB:TVideosDB={
            id: videoToEdit.getId() || videosDB.id,
            title: videoToEdit.getTitle() || videosDB.title,
            duration: videoToEdit.getDuration() || videosDB.duration,
            upload_date: videoToEdit.getUploadDate() || videosDB.upload_date
        }
        await db("videos").update(updateVideoDB).where({id})
        res.status(200).send("Video atualizado com sucesso!")
    } catch (error) {
        console.log(error)
        if (req.statusCode === 200) {
            res.status(500)
        }
        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.delete("/videos/:id", async (req: Request, res: Response)=>{
    try {
        const idToDelete = req.params.id
        const [videoToDelete]: TVideosDB[] | undefined[] = await db("videos").where({id: idToDelete})
        if(!videoToDelete){
            res.status(404)
            throw new Error("Video nâo encontrado!")
        } else{
            new Video (
                videoToDelete.id,
                videoToDelete.title,
                videoToDelete.duration,
                videoToDelete.upload_date
            )
            await db("videos").del().where({id: idToDelete})
            res.status(200).send("Video deletado com sucesso!")
        }
    } catch (error) {
        console.log(error)
        if (req.statusCode === 200) {
            res.status(500)
        }
        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }        
    }
})