import express from 'express'
import bodyParser  from 'body-parser'
import { createStore, getAllStores, updateStoreOrder } from '../controllers/store.js';
import { Stores } from '../models/storeData.js';


const router = express.Router()
router.use(bodyParser.json());
const HOME_URL = process.env.HOME_URL



// Create Store
router.post('/createstore', async (req, res)=>{
   
    const {
        userId,
        tagline,
        storeName,
        logo,
        phone,
        email,
        city,
        state
    } = req.body

    const payload = {
         userId,
         tagline,
        storeName,
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



 // Get all stores
router.get('/allstores', (req, res)=>{
    const stores = getAllStores()
    console.log('ALL STORES', stores)
    if(stores?.length > 0){
        return res.json({stores: stores, "ok": true})
    }
     return res.json({error: 'Unable to fetch stores', "ok": false})
 })


  // Update store order
router.put('/updateorder', (req, res)=>{
    const {items, buyerId} = req.body

    if(!items || items.length === 0){
      return res.json({error: 'Items to add not found', "ok": false})
    }

    if(!buyerId){
      return res.json({error: 'Buyer id not found', "ok": false})
    }

   

    const response = updateStoreOrder(items, buyerId)
    
    if(response.ok){
        return res.status(200).json(response)
    }
     return res.status(403).json(response)
 })





export default router
