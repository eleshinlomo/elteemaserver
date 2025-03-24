import { Users} from "../models/data.js"


const session = []
const codeSession = []




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
      codeSession.push(Number(generatedCode))
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