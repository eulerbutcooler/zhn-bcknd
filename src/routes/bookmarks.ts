import express, { Request, Response } from 'express'
import { summarize } from '../services/summarize'
// import {generatePodcastAudio} from '../services/tts'

const router = express.Router()

router.post('/', async (req: Request, res: Response) => {
    try{
        const {bookmarks} = req.body
        if(!bookmarks){
            res.status(400).json({ error: 'Bookmarks are required' })
            return
        }

        const script = await summarize(bookmarks)
        if(!script){
            res.status(500).json({ error: 'Failed to generate script' })
            return
        }
        res.json({message: 'Generated', script})

        // const script = await summarize(bookmarks)
        // if(!script){
        //     return
        // }
        // const audioPath = await generatePodcastAudio(script)
        // res.json({message: 'Generated', script, audio:audioPath.toString('base64')})
    } catch(error){
        console.error(error)
        res.status(500).json({error: 'Server error'})
    }
})

export default router