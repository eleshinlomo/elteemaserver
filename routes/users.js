import express from 'express'
import { Users} from '../models/userData.js'
import bodyParser  from 'body-parser'
import { registerUser, updateUser } from '../controllers/userController.js'

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



 router.post('/register', (req, res)=>{
    const {email, username} = req.body
    console.log(email, username)
    const response = registerUser(email, username)

        if(response.ok){
            
            return res.status(200).json(response)
        }else{
            return res.status(400).json(response)
        }

 })


//  Update User
 router.put('/updateuser', async (req, res)=>{
    const {id,username,firstname,lastname,email,phone,address, gender, city, state} = req.body

        const payload = {
        id,
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


 
  



export default router
