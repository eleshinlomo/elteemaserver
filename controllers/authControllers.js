import { Users} from "../models/data.js"


const session = []
const codeSession = []


export const registerUser = (email, username)=>{
  if(!email || !username) {
   return {
    error: 'You must provide email and username',
    ok: false
   }
  }

  

  const emailExist = Users.find((user)=>user.email.toLowerCase() === email.toLowerCase())

  if(emailExist) {
    return {
      error: 'This email exists in our database',
      ok: false
     }
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {
      error: 'Invalid email format',
      ok: false
    }
  }

  const usernameExist = Users.find((user)=>user.username.toLowerCase() === username.toLowerCase())
  if(usernameExist) {
    return {
      error: 'Username already taken',
      ok: false
     }
  }

  const newUser = {
    "username": username.toLowerCase(),
    'email': email,
    "cart": [],
    "isLoggedIn": false,
    "role": "user",
    "createdAt": new Date()
  }

  Users.push(newUser)
  return {

      message: 'You are now registered',
      ok: true
  } 
}




// Login Status
const checkLoginStatus = (email)=>{
  if(!email) return null

  const user = session.find((user)=>user.email === email)
  if(user){
    console.log(`User session is valid for ${user.email}`)
    console.log(`There are ${session.length} users currently logged in`)
    console.log(user)
    return user
  }


  return null
  
}


// Generate Random Numbers
function getRandomInt() {
  let min = 0
  let max = 100
  return Math.floor(Math.random() * (max - min + 1));
}




const generateTwoFactCode = (email)=>{

    const generatedCode = 1234
    const user = Users.find((user)=>user.email === email)
    if(user){
      codeSession.push(generatedCode)
      return Number(generatedCode)
     
    }
    return null
    
}

export const login = (email)=>{
  if(!email) return 'Please enter a valid email'
  if(!Users) return 'Server error.No userData found'
  const user = Users.find((user)=>user.email === email)
  console.log('Old User', user || 'No user')
    if (user){
      const newCode = generateTwoFactCode(email)
     
      const verifyLink = `http://localhost:3005/api/verifycode?code=${newCode}&email=${user.email}`
      const emailBody = `Click on the link to login: ${verifyLink}`
      console.log(emailBody)
      
      return 'We have sent a verification code to your email'
    }else{
      return 'Invalid credential'
    }
  
}

// Verify 2Factor Code
export const verifyTwoFactor = (code, email)=>{
       const user = Users.find((user)=>user.email === email)
       if(user && codeSession.includes(code)){
        user.isLoggedIn = true
        session.push(user)
        checkLoginStatus(email)
        return 'You are authenticated'
       }
       return null
}