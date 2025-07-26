

import { Users } from "../models/userData.js"
import https from 'https'










export const initiaLizePayment = async (userId, amount)=>{

  try{

  const user = await Users.findOne({_id: userId})
  if(!user){
    return {ok: false, error: 'user not found'}
  }

const params = JSON.stringify({
  "email": user.email,
  "amount": amount
})

const options = {
  hostname: 'api.paystack.co',
  port: 443,
  path: '/transaction/initialize',
  method: 'POST',
  headers: {
    Authorization: `Bearer ${PAYSTACK_API_KEY}`,
    'Content-Type': 'application/json'
  }
}

const req = https.request(options, res => {
  let data = ''

  res.on('data', (chunk) => {
    data += chunk
  });

  res.on('end', () => {
    console.log(JSON.parse(data))
  })
}).on('error', error => {
  console.error(error)
})

req.write(params)
req.end()
console.log(params)
return {ok: true, message: 'response from paystack', data: params}
  }catch(err){
    console.log(err)
  }
}



