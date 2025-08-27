import express from 'express'
import bodyParser  from 'body-parser'
import { deleteOrder } from '../controllers/admin/order.js';
import { adminUpdateUser} from '../controllers/admin/userAdmin.js';
import { sendMailshot } from '../controllers/admin/mailshot.js';
import { Users } from '../models/userData.js';
import { adminLogin } from '../controllers/admin/auth.js';




const router = express.Router()
router.use(bodyParser.json());
const HOME_URL = process.env.HOME_URL



//  Send Mailshot
 router.post('/sendmailshot', async (req, res)=>{
    const payload = {...req.body}
    const response = await sendMailshot(payload)

        if(response.ok){
            
            return res.status(200).json(response)
        }else{
            return res.status(400).json(response)
        }

 })


//  Update User
 router.post('/adminlogin', async (req, res)=>{
    const payload = {...req.body}
    const response = await adminLogin(payload)

        if(response.ok){
            
            return res.status(200).json(response)
        }else{
            return res.status(400).json(response)
        }

 })



//  Update User
 router.put('/updateuser', async (req, res)=>{
    const payload = {...req.body}
    const response = await adminUpdateUser(payload)

        if(response.ok){
            
            return res.status(200).json(response)
        }else{
            return res.status(400).json(response)
        }

 })



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


router.get('/users', async (req, res) => {
  try {
    const users = await Users.find(); // Wait for the query to complete
    if (users.length > 0) {
      return res.status(200).json({ok: true, data: users}); // Return users if found
    }
    res.status(404).json({ ok: false, error: 'No users found' }); // No users case
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ ok: false, error: 'Server error' }); // Database error
  }
});

export default router
