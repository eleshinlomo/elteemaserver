import express from 'express'
import bodyParser  from 'body-parser'
import { initiaLizePayment} from '../controllers/payments.js';
import Flutterwave from 'flutterwave-node-v3'



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




// Replace with your keys from the dashboard
const flw = new Flutterwave("FLWPUBK-xxxxx-X", "FLWSECK-xxxxx-X");

router.get('/makepayment', async (req, res) => {
       try {
    const payload = {
      tx_ref: "tx-" + Date.now(),
      amount: "100",
      currency: "NGN",
      payment_options: "card, mobilemoneyghana, ussd",
      redirect_url: "https://yourdomain.com/payment-callback",
      customer: {
        email: "user@example.com",
        phonenumber: "080****1234",
        name: "Seun Olatunji",
      },
      customizations: {
        title: "My Store Payment",
        description: "Payment for items in cart",
        logo: "https://yourdomain.com/logo.png",
      },
    };

    const response = await flw.Payment.initialize(payload);
    return res.redirect(response.data.link); // Redirect to Flutterwave payment page
  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).json({ error: "Payment initiation failed" });
  }
})





export default router