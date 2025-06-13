import express from 'express'
import bodyParser  from 'body-parser'
import { createStore } from '../controllers/store.js';
import { Stores } from '../models/storeData.js';


const router = express.Router()
router.use(bodyParser.json());
const HOME_URL = process.env.HOME_URL



// Create Store
router.post('/createstore', async (req, res)=>{
   
    const {
        userId,
        tagline,
        name,
        logo,
        phone,
        email,
        city,
        state
    } = req.body

    const payload = {
         userId,
         tagline,
         name,
        logo,
        phone,
        email,
        city,
        state
    }

    const response = await createStore(payload)
  
    if(response.ok){
    return res.status(200).json(response)
    }
    return res.status(401).json(response)
 })

// Get Stores
router.get('/getstores', (req, res)=>{
    return res.status(200).json({stores: Stores, "ok": true})
 })





export default router
