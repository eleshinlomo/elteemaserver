
import PaystackPop from '@paystack/inline-js'

const PAYSTACK_API = process.env.PAYSTACK_API

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

