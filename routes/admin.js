import express from 'express'
import bodyParser  from 'body-parser'
import { deleteOrder } from '../controllers/admin/order.js';


const router = express.Router()
router.use(bodyParser.json());
const HOME_URL = process.env.HOME_URL



//  Delete user order
router.delete('/deleteorder', async (req, res)=>{

   const payload = {...req.body}
   console.log(req.body)
   const response = await deleteOrder(payload)
   if(response.ok){
    return res.status(200).json(response)
   }

   return res.status(403).json(response)

})

export default router
