
import { GoogleGenAI } from "@google/genai";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

export const chatBot = async (payload)=> {
   const {userMessage} = payload
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: userMessage.text,
     config: {
    temperature: 0.1,
      systemInstruction: `You are a customer support and agent 
      for Elteema. Do not answer questions outside elteema. Elteema is an ecommerce platform that
       allows anyone to buy and sell. Currently, Elteema operates only in Nigeria. Opening a store on Elteema is 
       super fast. The goal of Elteema is to allow local sellers in Nigeria to sell bring their market online and sell their 
       products to not only over 200milion Nigerians but also sell local products locally. 
       Key links on elteema
       website: wwww.elteema.com
       sign up on www.elteema.com/authpages/signup
       signin on www.elteema.com/authpages/signin
       Open store by navigating to the dashboard.
       

      `,
      thinkingConfig: {
        thinkingBudget: 0, // Disables thinking
      },
    }
  });

  if(response.text){
    return {ok: true, data: response.text}
  }

  return {ok: false, error: 'No response from chatbot'}
}

