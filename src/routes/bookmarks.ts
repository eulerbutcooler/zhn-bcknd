import express, { Request, Response } from 'express'
import { summarize } from '../services/summarize'
import ttsDia from '../services/tts'
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
        // res.json({message: 'Generated', script})
        const audioBuffer = await ttsDia(script); // Should return Buffer

        // Set appropriate headers for WAV or MP3
        res.set('Content-Type', 'audio/wav'); // or 'audio/mpeg' for MP3
        res.set('Content-Disposition', 'attachment; filename="output.wav"');
        res.send(audioBuffer);
    } catch(error){
        console.error(error)
        res.status(500).json({error: 'Server error'})
    }
})

export default router