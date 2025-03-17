import express from 'express'
import { ProductData } from '../models/data.js'
import { UserData } from '../models/data.js'


const router = express.Router()



router.get('/', (req, res)=>{
    res.send('Hello World')
})

router.get('/api', (req, res)=>{
    const data = {
        'name': 'Oluwaseun',
        'lastname': 'Olatunji',
        'ok': true
    }

    res.json(data)
})

// User Data
router.get('/api/userdata', (req, res)=>{
   res.json({user: UserData, "ok": true})
})


router.get('/api/productdata', (req, res)=>{
    res.json({product: ProductData, "ok": true})
 })

export default router
