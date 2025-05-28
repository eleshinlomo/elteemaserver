import express from 'express'
import { Feeds } from '../models/feedData.js'
import bodyParser  from 'body-parser'
import { createFeed } from '../controllers/feeds.js';

const router = express.Router()
router.use(bodyParser.json());
const HOME_URL = process.env.HOME_URL



// Create feed
router.post('/createfeed', (req, res)=>{
    const {userId, text, imageUrl} = req.body
    const payload = {userId, text, imageUrl}
    const response = createFeed(payload)
    console.log(response)
    if(response.ok){
    return res.status(200).json(response)
    }
    return res.status(401).json({'ok': false, 'error': response.error})
 })

// Get feeds
router.get('/getfeeds', (req, res)=>{
    return res.status(200).json({feeds: Feeds, "ok": true})
 })





export default router
