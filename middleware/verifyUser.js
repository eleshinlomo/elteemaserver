import { Users } from "../models/userData.js"

export const verifyUser = (req, res, next)=>{
    
  // custom header needs to be sent in the request
    const userId =
    req.headers['userid'] ||
    req.headers['userId'] ||
    req.headers['user-id'];
  
      const user = Users.find((u) =>u.id === Number(userId))
        if (!user) {
          return res.status(403).json({ 
            ok: false, 
            error: 'You must be signed in before adding item to your store.' 
          })
        }

        next()
        
}