import express from 'express'
import { Products } from '../models/data.js'
import bodyParser  from 'body-parser'

const router = express.Router()
router.use(bodyParser.json());
const HOME_URL = process.env.HOME_URL




router.get('/allproducts', (req, res)=>{
    return res.json({products: Products, "ok": true})
 })





export default router
