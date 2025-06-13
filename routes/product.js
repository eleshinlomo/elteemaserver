import express from 'express'
import { createProduct } from '../controllers/product.js'
import { productImagesUpload } from '../controllers/multerConfig.js'

const router = express.Router()

// Create Product with file uploads
router.post('/createproduct', productImagesUpload, async (req, res) => {
  try {
    console.log('Uploaded files:', req.files) // Files from Multer
    
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
    // Process uploaded files
    const imageUrls = req.files.map(file => {
    return `/public/uploads/products/${file.filename}`;
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

export default router