// import express from 'express'
// import bodyParser  from 'body-parser'
// import { initializePayment } from '../controllers/payments.js';


// const router = express.Router()
// router.use(bodyParser.json());
// const HOME_URL = process.env.HOME_URL


// //  Initialize payment
//  router.post('/initializepayment', async (req, res)=>{
//   const {email, amount} = req.body
//   if(!email || !amount){
//     return res.status(400).json({ok: false, error: 'No payload received'})
//   }
  
//   const response = await initializePayment(email, amount)
//   if(response.ok){
//       console.log(response)
//       return res.status(200).json({ok: true, message: response})
//   }
  
//   return res.status(400).json(response) 

// })

// //  launch payment
//  router.post('/launchpayment', async (req, res)=>{
//   const {email, amount} = req.body
//   if(!email || !amount){
//     return res.status(400).json({ok: false, error: 'No payload received'})
//   }
  
//   const response = await initializePayment(email, amount)
//   if(response.ok){
//       console.log(response)
//       return res.status(200).json(response)
//   }else{
  
//   return res.status(400).json(response) 
//   }

// })


// //  Launch payment popup
// //  router.post('/paymentpopup', async (req, res)=>{
// //   const {email, amount} = req.body
// //   if(!email || !amount){
// //     return res.status(400).json({ok: false, error: 'No payload received'})
// //   }
  
// //   const response = await launchPaymentPopup(email, amount)
// //   if(response.ok){
// //       console.log(response)
// //       return res.status(200).json({ok: true, message: response})
// //   }
  
// //   return res.status(400).json(response) 

// // })

// export default router