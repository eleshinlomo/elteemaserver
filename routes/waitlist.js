
import express from 'express'
import bodyParser  from 'body-parser'
import { sendContactMessage } from '../htmpages/sendContactMessage.js';
import { getWaitlist } from '../controllers/waitlist.js';


const router = express.Router()
router.use(bodyParser.json());
const HOME_URL = process.env.HOME_URL


//  Send Contact message
 router.post('/waitlist', async (req, res)=>{
  
 const payload = {...req.body}
  const response = await getWaitlist(payload)  
  console.log('WAITLIST', payload)    
  if(response.ok){
      return res.status(200).json(response)
  }
  
  return res.status(400).json(response) 

})

export default router