import express from 'express'
import bodyParser  from 'body-parser'
import { sendContactMessage } from '../htmpages/sendContactMessage.js';


const router = express.Router()
router.use(bodyParser.json());
const HOME_URL = process.env.HOME_URL


//  Send Contact message
 router.post('/sendcontactmessage', async (req, res)=>{
  const {name, email, message} = req.body
  if(!name || !email || !message){
    return res.status(400).json({ok: false, error: 'No payload received'})
  }
  
  const response = await sendContactMessage(name, email, message)
  if(response.ok){
      console.log(response)
      return res.status(200).json({ok: true, message: 'Your message has been received. Thank you.'})
  }
  
  return res.status(400).json(response) 

})

export default router