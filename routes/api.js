import express from 'express'
import { ProductData } from '../models/data.js'
import { Users} from '../models/data.js'
import bodyParser  from 'body-parser'
import { login, registerUser, verifyTwoFactor } from '../controllers/authControllers.js'

const router = express.Router()
router.use(bodyParser.json());




// Get APIs
router.get('/', (req, res)=>{
    res.send('Hello World')
})

router.get('/api', (req, res)=>{
    res.send('API is working perfectly')
})

// User Data
router.get('/api/userdata', (req, res)=>{
   return res.json({user: Users , "ok": true})
})


router.get('/api/productdata', (req, res)=>{
    return res.json({product: ProductData, "ok": true})
 })


 router.post('/api/register', (req, res)=>{
    const {email, username} = req.body
    console.log(email, username)
    const response = registerUser(email, username)

        if(response.ok){
            
            return res.status(200).json(response)
        }else{
            return res.status(400).json(response)
        }

 })


 router.post('/api/login', async (req, res)=>{
    const {email} = req.body
    console.log('Email ', email)
    const response = await login(email)
    if(response.ok){
        console.log(response)
        return res.status(200).json(response)
    }
    
    console.log(response)
    return res.status(400).json(response) 

 })
 

 router.get('/api/verifycode', (req, res)=>{
     const {code, email} = req.query
     if(code && email){
        const response = verifyTwoFactor(Number(code), email)
        console.log(response)
        return res.status(200).send(response)
     }

     return res.status(404).send('You are not authenticated')
 })

export default router
