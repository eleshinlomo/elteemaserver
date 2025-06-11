import express from 'express'
import bodyParser  from 'body-parser'
import { createStore } from '../controllers/store.js';
import { Stores } from '../models/storeData.js';
import { createProduct } from '../controllers/product.js';


const router = express.Router()
router.use(bodyParser.json());
const HOME_URL = process.env.HOME_URL



// Create Store
router.post('/createproduct', async (req, res)=>{
   
    const {
          userId,
          addedBy,
          imageFiles,
           colors,
            productName,
            price,
                condition,
                deliveryMethod,
                quantity,
                size,
                categories,
                description,
                store,
    } = req.body

    const payload = {
           userId,
                addedBy,
                 imageFiles,
                colors,
                productName,
                price,
                condition,
                deliveryMethod,
                quantity,
                size,
                categories,
                description,
                store,
    }

    const response = await createProduct(payload)
  
    if(response.ok){
    return res.status(200).json(response)
    }
    return res.status(401).json(response)
 })





export default router
