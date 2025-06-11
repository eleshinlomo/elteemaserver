import express from 'express'
import bodyParser  from 'body-parser'
import { login, logout, persistLogin, verifyToken, verifyTwoFactor} from '../controllers/authControllers.js'


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





 router.post('/login', async (req, res)=>{
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

  router.post('/persistlogin', async (req, res)=>{
    try{
    const {email, token} = req.body
    console.log('Email ', email)
   
    const response = await persistLogin(token, email)
    if(response?.ok){
        console.log(response)
        return res.status(200).json(response)
    }
    
    console.log(response)
    return res.status(401).json(response) 
  }catch(err){
    console.log('ERROR', err)
  }

 })


 


 router.post('/verifycode', async (req, res) => {
  try{
    const { authCode, authEmail } = req.body;
    
    if (!authCode || !authEmail) {
      return res.status(400).json({ error: "Missing code or email", ok: false});
    }
    console.log(authCode, authEmail)
    const response = verifyTwoFactor(authCode, authEmail);
    console.log('Response', response)
    if (response?.ok) {
      // Return the token in JSON (frontend will store it)
      return res.status(200).json({
        ok: response.ok,
        token: response.data.verifiedToken,
        data: response.data,
      });
    } else {
      return res.status(401).json({ error: response.error});
    }
  }catch(err){
    console.log('ERR', err)
    return {ok: false, error: err}
  }
  });
  

// Logout
router.post('/logout', async (req, res)=>{
   try{
    const {email} = req.body
    if(!email)return {ok: false, error: 'missing user email'}

      const response = logout(email)
      if(response.ok){
        res.status(200).json(response.message)
      }
    
    res.status(400).send(response)
   }catch(err){
    return {ok: false, error: err}
   }
})

export default router
