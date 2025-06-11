import { Products } from "../models/productData.js"
import { Users } from "../models/userData.js"

       
        // Returns products array for user store items
        const getUserProducts =  (userId)=>{
            if(!userId){
                return {ok: false, error: 'User must be logged in to add product'}
            }
            let storeProducts = []
            const userStoreProducts = Products?.filter((products)=>products.userId === userId)
            if(userStoreProducts?.length > 0){
                storeProducts = userStoreProducts
            }else{
                storeProducts = []
            }
            return {ok: true, message: 'Product has been added', data: storeProducts}
        }



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
            const productExist = Products.find((product)=>product.productName === productName)
            if(productExist){
                return {ok: false, error: 'You with same name already exists.'}
            }
            const maxId = Products.length > 0 
                ? Math.max(...Products.map(product => product.id)) 
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
                totalVotes: 0,
                numOfItemsSold: 0,
                isAdded: false,
                orderStatus:['processing', 'shipped', 'completed'],
                productPageVisits: 256 
            }
            Products.push(newProduct)
            const UpdatedUserStore = getUserProducts(userId)
            Users[userIndex].store.items = UpdatedUserStore.data
            return {ok: true, message: 'Product was added to your store', data: Users[userIndex]}
        }
