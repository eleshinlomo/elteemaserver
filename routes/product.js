import express from 'express'
import { createProduct, deleteProduct } from '../controllers/product.js'
import { productImagesUpload } from '../middleware/multerConfig.js'
import { verifyUser } from '../middleware/verifyUser.js'
import bodyParser  from 'body-parser'
import { Products } from '../models/productData.js'

const router = express.Router()
// router.use(bodyParser.json());
const BASE_URL = process.env.BASE_URL


// Create Product with file uploads
router.post('/createproduct', verifyUser, productImagesUpload, async (req, res) => {
  try {
    
    
    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        ok: false, 
        error: 'At least one product image is required' 
      })
    }

    // Get other form data from req.body (text fields)
    const {
      userId,
      addedBy,
      colors,
      productName,
      price,
      condition,
      deliveryMethod,
      quantity,
      size,
      category,
      description,
      store,
    } = req.body

    // Process uploaded files
    const imageUrls = req.files.map(file => {
    return `${BASE_URL}/uploads/products/${file.filename}`;
    });

    const payload = {
      userId,
      addedBy,
      imageUrls, 
      colors: Array.isArray(colors) ? colors : [colors].filter(Boolean),
      productName,
      price: Number(price),
      condition,
      deliveryMethod,
      quantity: Number(quantity),
      size,
      category,
      description,
      store,
    }

    const response = await createProduct(payload)
    
    if (response.ok) {
      return res.status(200).json(response)
    }
    return res.status(400).json(response)
    
  } catch (error) {
    console.error('Error creating product:', error)
    return res.status(500).json({
      ok: false,
      error: 'Internal server error'
    })
  }
})



//  Delete product
router.delete('/deleteproduct', async (req, res)=>{
    const {userId, productId} = req.body
 
    if(!productId){
        return res.status(403).json({ok: false, error: 'ProductId not found'})
    }

    const response = await deleteProduct(userId, productId)
    if(response.ok){
        return res.status(200).json(response)
    }

    return res.status(403).json(response)
 })

export default router