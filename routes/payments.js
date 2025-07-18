import express from 'express'
import bodyParser  from 'body-parser'
import { initiaLizePayment} from '../controllers/payments.js';



const router = express.Router()
router.use(bodyParser.json());
const HOME_URL = process.env.HOME_URL





router.get('/initializepayment', async (res, req)=>{
   const {userId} = req.body
   const response = await initiaLizePayment(userId)
   if(response.ok){
    return res.status(200).json(response)
   }

   return res.status(403).json(response)
})




export default router