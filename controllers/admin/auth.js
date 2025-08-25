import bcrypt from "bcrypt";


//hash password
async function hashPassword(plainPassword) {
  const saltRounds = 10; // higher is more secure but slower
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
  return hashedPassword;
}


export const adminLogin = async (payload)=>{
    const {email, password} = payload
    const hashedPassword = await hashPassword(password)

    console.log('Amin Payload', hashedPassword)
    return {ok: true, message: 'Admin login was successful'}
}