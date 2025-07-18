import express from 'express'
import { Users} from '../models/userData.js'
import bodyParser  from 'body-parser'
import { deleteUser, deleteUserOrder, registerUser, updatePaymentMethod, updateUser, updateUserCart, updateUserCookie } from '../controllers/userController.js'

const router = express.Router()
router.use(bodyParser.json());
const HOME_URL = process.env.HOME_URL





// User Data
router.get('/userdata', (req, res)=>{
    const {userid} = req.query
    const user = Users.find((u)=> u.id === userid)

if(user?.role === 'admin'){
    
   return res.json({data: Users , "ok": true})
    }

    return res.status(400).json({error: 'Permission denied', ok: false})
})



 router.post('/register', async (req, res)=>{
    const {email, username} = req.body
    console.log(email, username)
    const response = await registerUser(email, username)

        if(response.ok){
            
            return res.status(200).json(response)
        }else{
            return res.status(400).json(response)
        }

 })


//  Update User
 router.put('/updateuser', async (req, res)=>{
    const {id, cart, username,firstname,lastname,email,phone,address, gender, city, state} = req.body

        const payload = {
        userId: id,
        cart,
        username,
        firstname,
        lastname,
        email,
        phone,
        address,
        gender, city, state

        }

    console.log(payload)
    const response = await updateUser(id, payload)

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

    console.log(payload)
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

    console.log(payload)
    const response = await updateUserCookie(userId, isCookieAccepted)

        if(response.ok){
            
            return res.status(200).json(response)
        }else{
            return res.status(400).json(response)
        }

 })

router.get('/users', async (req, res) => {
  try {
    const users = await Users.find(); // Wait for the query to complete
    if (users.length > 0) {
      return res.status(200).json(users); // Return users if found
    }
    res.status(404).json({ ok: false, error: 'No users found' }); // No users case
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ ok: false, error: 'Server error' }); // Database error
  }
});


//  update payment method
 router.put('/updatepaymentmethod', async (req, res)=>{
  const {userId, paymentEmail, paymentMethod} = req.body
  const payload = {userId, paymentEmail, paymentMethod}
 
  const response = await updatePaymentMethod(payload)
  if(response.ok){
      console.log(response)
      return res.status(200).json(response)
  }
  
  return res.status(400).json(response) 

})


router.delete('/deleteuserorder', async (req, res)=>{
   const {userId, orderId} = req.body
   const response = await deleteUserOrder(userId, orderId)
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
