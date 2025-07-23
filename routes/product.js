import express from 'express'
import { createProduct, deleteProduct, getAllProducts, updateProduct } from '../controllers/product.js'
import { productImagesUpload } from '../middleware/multerConfig.js'
import { verifyUser } from '../middleware/verifyUser.js'
import bodyParser  from 'body-parser'
import { Products } from '../models/productData.js'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import multer from 'multer'

const upload = multer(); 
const router = express.Router()
// router.use(bodyParser.json());
const BASE_URL = process.env.BASE_URL





const s3Client = new S3Client({ region: process.env.BUCKET_REGION });


// PreSign Url
router.post('/presignurl', async (req, res)=> {

  if (req.method === 'POST') {
    try {
      const { filename, filetype } = req.body;
      const key = `products/${Date.now()}-${filename}`;

      const command = new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: key,
        ContentType: filetype
      });

      const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

      return res.json({
        presignedUrl,
        publicUrl: `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/${key}`
      });
    } catch (error) {
      console.error('Error generating presigned URL:', error);
      res.status(500).json({ error: 'Failed to generate upload URL' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end('Method Not Allowed');
  }
})



// Create Product with file uploads
router.post('/createproduct', upload.array('images'), async (req, res) => {
  try {
    
    // Image upload
    const files = req.files;
  
    if (!files || files.length === 0) {
      return res.status(400).json({ ok: false, error: 'At least one product image is required' });
    }

   
      const imageUrls = await Promise.all(files.map(async (file, index) => {
      const ext = file.originalname.split('.').pop()?.toLowerCase();
      if (!ext || !['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)) {
        throw new Error(`Invalid file extension for file ${index}`);
      }

      const key = `products/${Date.now()}-${file.originalname}`;

      await s3Client.send(new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }));

      return `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/${key}`;
    }));
    
    // Others
    const payload = {
      ...req.body, 
    };

    const response = await createProduct(imageUrls, payload);
    if (response.ok) {
      return res.status(200).json(response);
    }
    return res.status(403).json(response);
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({ ok: false, error: 'Internal server error' });
  }
});



// Update Product with file uploads
router.put('/updateproduct', upload.array('images'), async (req, res) => {
  try {
    // Process uploaded images
    const imageUrls = await Promise.all(
      (req.files || []).map(async (file) => {
        const ext = file.originalname.split('.').pop()?.toLowerCase();
        if (!ext || !['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)) {
          throw new Error(`Invalid file extension for file ${file.originalname}`);
        }

        const key = `products/${Date.now()}-${file.originalname}`;
        
        await s3Client.send(new PutObjectCommand({
          Bucket: process.env.BUCKET_NAME,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }));

        return `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/${key}`;
      })
    );

    // Parse other form data
    const payload = {
      ...req.body,
      userId: req.body.userId,
      productId: req.body.productId,
      imagesToRemove: Array.isArray(req.body.imagesToRemove) 
    ? req.body.imagesToRemove 
    : [req.body.imagesToRemove].filter(Boolean),
      colors: JSON.parse(req.body.colors || '[]'),
      shoeSizes: JSON.parse(req.body.shoeSizes || '[]'),
      clotheSizes: JSON.parse(req.body.clotheSizes || '[]'),
      price: parseFloat(req.body.price),
      quantity: parseInt(req.body.quantity),
      unitCost: parseInt(req.body.unitCost),
    };

    const response = await updateProduct(imageUrls, payload);
    
    if (response.ok) {
      return res.status(200).json(response);
    }
    return res.status(400).json(response);
    
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({
      ok: false,
      error: error.message || 'Internal server error'
    });
  }
});




//  Delete product
router.delete('/deleteproduct', async (req, res)=>{
    const {userId, productId} = req.body
 
    if(!productId){
        return res.status(403).json({ok: false, error: 'ProductId not found'})
    }

       if(!userId){
        return res.status(403).json({ok: false, error: 'ProductId not found'})
    }

    const response = await deleteProduct(userId, productId)
    if(response.ok){
        return res.status(200).json(response)
    }

    return res.status(403).json(response)
 })



 // Get all products
router.get('/allproducts',  async (req, res)=>{
    const response = await getAllProducts()
    if(response.ok){
        return res.status(200).json(response)
    }
     return res.status(403).json(response)
 })
 

 export default router