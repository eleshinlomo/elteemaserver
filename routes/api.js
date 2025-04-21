import express from 'express'
import { admin, Products } from '../models/data.js'
import { Users} from '../models/data.js'
import bodyParser  from 'body-parser'
import { login, registerUser, verifyTwoFactor} from '../controllers/authControllers.js'
import { authCodeErrorHtml, } from '../htmpages/error.js'
import { notAuthenticatedHtml } from '../htmpages/notAuthenticatedHtml.js'

const router = express.Router()
router.use(bodyParser.json());
const HOME_URL = process.env.HOME_URL




// Get APIs
router.get('/', (req, res)=>{
    res.send('Hello World')
})

router.get('/api', (req, res)=>{
    res.send('API is working perfectly')
})

// User Data
router.get('/api/userdata', (req, res)=>{
    const {userid} = req.query
    const user = Users.find((u)=> u.id === userid)

if(user?.role === 'admin'){
    
   return res.json({data: Users , "ok": true})
    }

    return res.status(400).json({error: 'Permission denied', ok: false})
})


router.get('/api/products', (req, res)=>{
    return res.json({products: Products, "ok": true})
 })


 router.post('/api/register', (req, res)=>{
    const {email, username} = req.body
    console.log(email, username)
    const response = registerUser(email, username)

        if(response.ok){
            
            return res.status(200).json(response)
        }else{
            return res.status(400).json(response)
        }

 })


 router.post('/api/login', async (req, res)=>{
    const {email} = req.body
    console.log('Email ', email)
    const response = await login(email)
    if(response.ok){
        console.log(response)
        return res.status(200).json(response)
    }
    
    console.log(response)
    return res.status(400).json(response) 

 })
 


 router.post('/api/verifycode', (req, res) => {
    const { authCode, authEmail } = req.body;
    
    if (!authCode || !authEmail) {
      return res.status(400).json({ error: "Missing code or email", ok: false});
    }
    console.log(authCode, authEmail)
    const response = verifyTwoFactor(authCode, authEmail);
    
    if (response?.ok) {
      // Return the token in JSON (frontend will store it)
      return res.status(200).json({
        ok: response.ok,
        token: response.verifiedToken,
        user: response.user,
      });
    } else {
      return res.status(401).json({ error: response.error});
    }
  });
  

// Logout
router.get('/api/logout', (req, res)=>{
    res.clearCookie('ptlgAuth', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        // domain: process.env.COOKIE_DOMAIN, // must match set cookie
        path: '/'
    });
})

export default router
