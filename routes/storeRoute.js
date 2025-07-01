import express from 'express'
import bodyParser  from 'body-parser'
import { createStore, getAllStores, getSingleStore, updateStore, updateStoreOrder } from '../controllers/store.js';



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
        industry,
        address,
        city,
        state,
        country
    } = req.body

    const payload = {
         userId,
         tagline,
        storeName,
        logo,
        phone,
        email,
        industry,
        address,
        city,
        state,
         country
    }

    const response = await createStore(payload)
  
    if(response.ok){
    return res.status(200).json(response)
    }
    return res.status(401).json(response)
 })
 

 // Update Store
router.put('/updatestore', async (req, res)=>{
   
    const {
        userId,
        tagline,
        storeName,
        logo,
        phone,
        email,
        industry,
        address,
        city,
        state,
        country
    } = req.body

    const payload = {
         userId,
         tagline,
        storeName,
        logo,
        phone,
        email,
        industry,
        address,
        city,
        state,
        country
    }

    const response = await updateStore(payload)
  
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


//  Get Single store
 router.post('/getstore', async (req, res)=>{
    const {storeName} = req.body
     const response = await getSingleStore(storeName)
     if(response.ok){
        return res.status(200).json(response)
     }

     return res.status(403).json(response)
 })





export default router
