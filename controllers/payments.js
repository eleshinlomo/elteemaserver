
// import PaystackPop from '@paystack/inline-js'

import { Users } from "../models/userData.js"

// const PAYSTACK_API = process.env.PAYSTACK_API


export const updatePaymentMethod = (payload)=>{
  try{

    const { userId, paymentEmail, paymentMethod} = payload
     console.log('PAYLOAD', payload)

     if(!userId) {
        return {ok: false, error: 'User not found'}
    }

    if(!paymentEmail || !paymentMethod) {
        return {ok: false, error: 'No payload'}
    }

    
   let userIndex = Users.findIndex((user)=>user.id === userId)

   if(userIndex === -1){
     return {ok: false, error: `User with ${id} not found`}
   }

   Users[userIndex] = {...Users[userIndex], paymentEmail: paymentEmail, paymentMethod: paymentMethod}
    // Save new user to the database
  
     console.log('UPDATED PAYMENT', Users[userIndex])
   return {ok: true, data: Users[userIndex], message: 'success'}
  }catch(err){
    console.log(err)
  }
}


export const initializePayment = async (email, amount) => {
  if(typeof window !== 'undefined') {
    const metadata = {
        firstname: 'yourname',
        lastname: 'yourname'
    }
    const payload = {
        email,
        amount,
        metadata
    }
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${PAYSTACK_API}`
        },
        method: 'POST',
        body: JSON.stringify(payload) // Note: Paystack expects 'amount' in kobo, not 'price'
    })
    
    if(!response.ok){
        console.log('Error from paystack server', response.status)
        return {ok: false, error: 'No response from payment server'}
    }
    
    const data = await response.json()
    
    return {ok: true, message: data.data}
  }
    
}


export const launchPaymentPopup = async (email, amount) => {
  if(typeof window !== 'undefined') {
  try {
    const response = await initializePayment(email, amount);
    const { access_code, reference } = response;
    
    if (access_code) {
      const popup = new PaystackPop();
      const popupResponse = await popup.resumeTransaction(access_code);
      
      return {
        reference,
        status: popupResponse.status,
        fullResponse: popupResponse
      };
    }
    return { status: 'failed', reference: null };
  } catch (error) {
    console.error('Payment error:', error);
    return {ok: false, error: 'payment error'}
  }
}
};

