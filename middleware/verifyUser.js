import { Users } from "../models/userData.js"

export const verifyUser = (req, res, next)=>{
    const userId = req.headers['userId']
    console.log("Full req.headers:", userId, req.headers)

      const user = Users.find((u) =>u.id === Number(userId))
        console.log('USERS', Users)
      console.log('USER MIDDLEWARE', user)
      console.log('USER.ID', user?.id, 'USERID', userId)
        if (!user) {
          return res.status(403).json({ 
            ok: false, 
            error: 'You must be signed in before adding item to your store.' 
          })
        }

        next()
        
}