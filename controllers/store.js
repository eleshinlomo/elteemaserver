import { Users } from "../models/userData.js"
import { Feeds } from "../models/feedData.js"
import { getStore } from "../utils.js"
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
    const userStore = await getStore(Users[userIndex].username)

    
    
    const newStore = {
        userId: userId, 
        addedBy: Users[userIndex].username.toLowerCase(),
        storeId: newStoreId, 
        tagline: tagline.toLowerCase(),
        name: name.toLowerCase(),
        logo: logo,
        phone: phone,
        email: email.toLowerCase(),
        items: []
    }
    Stores.push(newStore)
    const newUserStore = Stores.find((store)=>store.userId === userId)


    // update user with the new store
    Users[userIndex].store = newUserStore
    const updatedUser = Users[userIndex]
    return {ok: true, message: 'Store has been created', data: updatedUser}
}