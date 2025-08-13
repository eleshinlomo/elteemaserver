import express from 'express'
import bodyParser  from 'body-parser'
import { createStore, getAllStores, getSingleStore, updateStore,  deleteStore, 
    deleteStoreOrder, updateStoreOrderStatus, updateStoreOrderPaymentStatus } from '../controllers/store.js';



const router = express.Router()
router.use(bodyParser.json());
const HOME_URL = process.env.HOME_URL



// Create Store
router.post('/createstore', async (req, res)=>{
   
    const {
        userId,
        tagline,
        storeName,
        bankAccountName,
        bankAccountNumber,
        bvn,
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
         bankAccountName,
        bankAccountNumber,
        bvn,
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
        bankAccountName,
        bankAccountNumber,
        bvn,
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
        bankAccountName,
        bankAccountNumber,
        bvn,
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

// Update store order status
 router.put('/updatestoreorderstatus', async (req, res)=>{
    const payload = {...req.body}
    const response = await updateStoreOrderStatus(payload)
    if(response.ok){
        return res.json(response)
    }
     return res.json(response)
 })

 // Update store order payment status
 router.put('/updatestoreorderpaymentstatus', async (req, res)=>{
    const payload = {...req.body}
    const response = await updateStoreOrderPaymentStatus(payload)
    if(response.ok){
        return res.json(response)
    }
     return res.json(response)
 })



 // Get all stores
router.get('/allstores', (req, res)=>{
    const stores = getAllStores()
    if(stores?.length > 0){
        return res.json({stores: stores, "ok": true})
    }
     return res.json({error: 'Unable to fetch stores', "ok": false})
 })





//  Get Single store
 router.post('/getstore', async (req, res)=>{
    const {storeId} = req.body
     const response = await getSingleStore(storeId)
     if(response.ok){
        return res.status(200).json(response)
     }

     return res.status(403).json(response)
 })


 //  Delete store order
 router.delete('/deletestoreorder', async (req, res)=>{
    const {storeName, orderId, buyerId, reason} = req.body
    const response = await deleteStoreOrder(storeName, orderId, buyerId, reason)
    if(response.ok){
     return res.status(200).json(response)
    }
 
    return res.status(403).json(response)
 
 })


// Delete store
 router.delete('/deletestore', async (req, res)=>{
    const {userId} = req.body
    const response = await deleteStore(userId)
    if(response.ok){
     return res.status(200).json(response)
    }
 
    return res.status(403).json(response)
 
 })





export default router
