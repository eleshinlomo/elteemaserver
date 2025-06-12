import { Products } from "../models/productData.js"
import { Users } from "../models/userData.js"
import { getUserStore, updateUserStoreItems } from "./store.js"

       
      



        // Add Product. Product is an object
        export const createProduct = async (payload)=>{
            
            const {
                userId,
                addedBy,
                imageFiles,
                colors,
                productName,
                price,
                condition,
                deliveryMethod,
                quantity,
                size,
                categories,
                description,
                store,
            } = payload
        
           
            const userIndex = Users.findIndex((user)=> user.id === userId)
            if(userIndex === -1){
                 return {ok: false, error: 'You must be signed in before adding  item to your store.'}
            }

            console.log('Product PAYLOAD', payload)
        
            // if(!name  || !phone || !email){
               
            //      return {ok: false, error: 'Problem with payload'}
            // }
            
            
            // A check to confirm user does not have existing store
            const productExist = Products.find((product)=>product.productName.trim() === productName.trim())
            if(productExist){
                return {ok: false, error: 'A product with same name already exists.'}
            }
            const maxId = Products.length > 0 
                ? Math.max(...Products.map(product => product.productId)) 
                : 0;
        
            const newProductId = maxId + 1
        
            
            const newProduct = {
                userId,
                productId: newProductId,
                imageFiles,
                addedBy,
                colors,
                productName,
                price,
                condition,
                deliveryMethod,
                quantity,
                size,
                categories,
                description,
                store, //Object
                star: 5,
                totalVotes: 5,
                numOfItemsSold: 0,
                isAdded: false,
                orderStatus:['processing', 'shipped', 'completed'],
                productPageVisits: 256 
            }
            Products.push(newProduct)
            const user = updateUserStoreItems(userId, newProduct)
            if(!user) return {ok: false,error: 'Unable to add item to store'}

            return {ok: true, message: 'Product was added to your store', data: user}
        }
