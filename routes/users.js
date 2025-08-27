import express from 'express'
import { Users} from '../models/userData.js'
import bodyParser  from 'body-parser'
import { createUserOrder, deleteUser, deleteUserOrder, registerUser, updatePaymentMethod, updateUser, updateUserCart, updateUserCookie } from '../controllers/userController.js'

const router = express.Router()
router.use(bodyParser.json());
const HOME_URL = process.env.HOME_URL








 router.post('/register', async (req, res)=>{
    const {email, username} = req.body
    const response = await registerUser(email, username)

        if(response.ok){
            
            return res.status(200).json(response)
        }else{
            return res.status(400).json(response)
        }

 })


//  Update User
 router.put('/updateuser', async (req, res)=>{
    const payload = {...req.body}
    const response = await updateUser(payload)

        if(response.ok){
            
            return res.status(200).json(response)
        }else{
            return res.status(400).json(response)
        }

 })


  // Update cart
 router.put('/updatecart', async (req, res)=>{
    const {userId, updatedCart} = req.body

        const payload = {
        userId,
        updatedCart
     
        }


    const response = await updateUserCart(userId, updatedCart)

        if(response.ok){
            
            return res.status(200).json(response)
        }else{
            return res.status(400).json(response)
        }

 })


  // Update isCookie accepted
 router.put('/updatecookie', async (req, res)=>{
    const {userId, isCookieAccepted} = req.body

        const payload = {
        userId,
        isCookieAccepted
     
        }

    const response = await updateUserCookie(userId, isCookieAccepted)

        if(response.ok){
            
            return res.status(200).json(response)
        }else{
            return res.status(400).json(response)
        }

 })




//  update payment method
 router.put('/updatepaymentmethod', async (req, res)=>{
  const {userId, paymentEmail, paymentMethod} = req.body
  const payload = {userId, paymentEmail, paymentMethod}
 
  const response = await updatePaymentMethod(payload)
  if(response.ok){
      return res.status(200).json(response)
  }
  
  return res.status(400).json(response) 

})


  // Create user order
router.put('/createuserorder', async (req, res)=>{
    const {items, buyerId} = req.body

    if(!items || items.length === 0){
      return res.json({error: 'Items to add not found', "ok": false})
    }

    const response = await createUserOrder(items, buyerId)
    
    if(response.ok){
        return res.status(200).json(response)
    }
     return res.status(403).json(response)
 })


//  Delete user order
router.delete('/deleteuserorder', async (req, res)=>{
   const {userId, orderId, reason} = req.body
   const response = await deleteUserOrder(userId, orderId, reason)
   if(response.ok){
    return res.status(200).json(response)
   }

   return res.status(403).json(response)

})

router.delete('/deleteuser', async (req, res)=>{
   const {userId} = req.body
   const response = await deleteUser(userId)
   if(response.ok){
    return res.status(200).json(response)
   }

   return res.status(403).json(response)

})


 
  



export default router
