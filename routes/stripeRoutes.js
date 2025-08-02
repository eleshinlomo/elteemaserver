

import express from 'express'
import bodyParser  from 'body-parser'
import { sendContactMessage } from '../htmpages/sendContactMessage.js';
const stripe = process.env.STRIPE_SECRET_KEY


const router = express.Router()
router.use(bodyParser.json());
const HOME_URL = process.env.HOME_URL

const YOUR_DOMAIN = 'http://localhost:4242';


//  Send Contact message
 router.post('/create-checkout-session', async (req, res)=>{

const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, price_1234) of the product you want to sell
        price: '{{PRICE_ID}}',
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}/success.html`,
    cancel_url: `${YOUR_DOMAIN}/cancel.html`,
    automatic_tax: {enabled: true},
  });

  res.redirect(303, session.url);
});

 

export default router






