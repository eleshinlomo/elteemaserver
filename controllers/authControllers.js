import { Users} from "../models/data.js"


const session = []

const checkLoginStatus = (email)=>{
  if(!email) return

  const user = session.find((user)=>user.email === email)
  if(user){
    console.log(`User session is valid for ${user.email}`)
    console.log(`There are ${session.length} users currently logged in`)
    console.log(user)
    return user
  }

  console.log('Please login')
  return
  
}

const generateTwoFactCode = (email)=>{
  
    const generatedCode = 1234
    for (let i = 0; i < Users.length; i++){
      if(Users[i].email === email){
        Users[i].code = generatedCode
        console.log('New Code',Users[i].code)
        return Users[i].code
      }
    }
    return null
    
}

export const login = (email)=>{
  if(!email) return 'Please enter a valid email'
  if(!Users) return 'Server error.No userData found'
  const user = Users.find((user)=>user.email === email)
    if (user){
      generateTwoFactCode(email)
     
      const verifyLink = `http://localhost:3005/api/verifycode?code=${user.code}&email=${user.email}`
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
       if(user && user.code === code){
        user.isLoggedIn = true
        session.push(user)
        checkLoginStatus(email)
        return 'You are authenticated'
       }
}