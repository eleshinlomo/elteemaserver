

import express from 'express'
import bodyParser  from 'body-parser'
import { sendContactMessage } from '../htmpages/sendContactMessage.js';
import stripe from 'stripe'
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY


const router = express.Router()
router.use(bodyParser.json());
const HOME_URL = process.env.HOME_URL


//  Send Contact message
 router.post('/testwebhook', async (req, res)=>{

  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_SECRET_KEY);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  console.log(`Unhandled event type ${event.type}`);

  // Return a 200 response to acknowledge receipt of the event
  res.send();

 
})

export default router




