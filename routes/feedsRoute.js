import express from 'express'
import { Feeds } from '../models/feedData.js'
import bodyParser  from 'body-parser'
import { createFeed, deleteFeed, updateFeed } from '../controllers/feeds.js';
import { uploadSingleImage } from '../middleware/singleMulterConfig.js';
import { verifyUser } from '../middleware/verifyUser.js';

const router = express.Router()
router.use(bodyParser.json());
const BASE_URL = process.env.BASE_URL



// Create feed
router.post('/createfeed', verifyUser, uploadSingleImage, async (req, res)=>{

    const {userId, text} = req.body
    console.log('REQ', req.body)

    const imageUrl = req.file
  ? `${BASE_URL}/uploads/feed/${req.file.filename}`
  : null;

    

    const payload = {userId, text, imageUrl}
     console.log('PAYLOAD', payload)
    const response = await createFeed(payload)
  
    if(response.ok){
    return res.status(200).json(response)
    }
    return res.status(401).json(response)
 })




 // Update feed
router.put('/updatefeed', uploadSingleImage, async (req, res)=>{

    const {text, feedId, userId} = req.body
    console.log('REQ', req.body)

    const imageUrl = req.file
  ? `${BASE_URL}/uploads/feed/${req.file.filename}`
  : null;

    

    const payload = {text, feedId, userId}
     console.log('PAYLOAD', payload)
    const response = updateFeed(payload)
  
    if(response.ok){
    return res.status(200).json(response)
    }
    return res.status(401).json(response)
 })




 //  Delete product
 router.delete('/deletefeed', async (req, res)=>{
     const {feedId} = req.body
  
     if(!feedId){
         return res.status(403).json({ok: false, error: 'FeedId not found'})
     }
 
     const response = await deleteFeed(feedId)
     if(response.ok){
         return res.status(200).json(response)
     }
 
     return res.status(403).json(response)
  })




// Get feeds
router.get('/getfeeds', (req, res)=>{
    return res.status(200).json({feeds: Feeds, "ok": true})
 })







export default router
