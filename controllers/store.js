import { Users } from "../models/userData.js"
import { Stores } from "../models/storeData.js"


// Add Store. Store is an object
export const createStore = async (payload)=>{
    
    const {
        userId,
        tagline,
        name,
        logo,
        phone,
        email,
        city,
        state
    } = payload

    console.log('STORE PAYLOAD', payload)

    const userIndex = Users.findIndex((user)=> user.id === userId)
    if(userIndex === -1){
         return {ok: false, error: 'You must be signed in before creating a store.'}
    }

    if(!name  || !phone || !email){
       
         return {ok: false, error: 'Problem with payload'}
    }
    
    
    // A check to confirm user does not have existing store
    const existingStore = Users[userIndex].store
    if(existingStore){
        return {ok: false, error: 'You already have a store.'}
    }
    const maxId = Stores.length > 0 
        ? Math.max(...Stores.map(store => store.storeId)) 
        : 0;

    const newStoreId = maxId + 1
    

    
    
    const newStore = {
        userId: userId, 
        addedBy: Users[userIndex].username.toLowerCase(),
        storeId: newStoreId, 
        tagline: tagline.toLowerCase(),
        name: name.toLowerCase(),
        logo: logo,
        phone: phone,
        email: email.toLowerCase(),
        city,
        state,
        items: [],
        
    }
    Stores.push(newStore)
   
    // update user with the new store
    Users[userIndex].store = newStore
    console.log('UPDATED USER STORE', Users[userIndex])
    return {ok: true, message: 'Store has been created', data: Users[userIndex]}
}



// Update Store Items
export const updateUserStoreItems = (userId, newItem)=>{
  if(!userId){
    return 'No username found'
  }
   const user = Users.find((user)=> user.id === Number(userId))
    if(user){
        user.store.items.push(newItem)
    }
   return user
}

// Get store
export const getUserStore = (username)=>{
  if(!username.trim()){
    return 'No username found'
  }
   const user = Users.find((user)=> user?.username.toLowerCase() === username.toLowerCase())
   
   const userStore = user.store
   if(userStore){
    return userStore
   }
   return null
}