import express from 'express'
import dotenv from 'dotenv'
import bookmarks from './routes/bookmarks'

dotenv.config()

const app = express()
app.use(express.json())

app.use('/api/bookmarks', bookmarks)

const PORT = 3000
app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`)
})

