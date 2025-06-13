import { Products } from "../models/productData.js"
import { Users } from "../models/userData.js"
import { updateUserStoreItems } from "./store.js"
import path from 'path'

export const createProduct = async (payload) => {
  try {
    const {
      userId,
      addedBy,
      imageUrls,
      colors,
      productName,
      price,
      condition,
      deliveryMethod,
      quantity,
      size,
      category,
      description,
      store,
    } = payload

    const userIndex = Users.findIndex((user) => user.id === userId)
    if (userIndex === -1) {
      return { 
        ok: false, 
        error: 'You must be signed in before adding item to your store.' 
      }
    }

    // Check if product already exists
    const productExist = Products.find((product) => 
      product.productName.trim() === productName.trim()
    )
    if (productExist) {
      return { 
        ok: false, 
        error: 'A product with same name already exists.' 
      }
    }

    

    const maxId = Products.length > 0 
      ? Math.max(...Products.map(product => product.productId)) 
      : 0

    const newProductId = maxId + 1

    const newProduct = {
      userId,
      productId: newProductId,
      images: imageUrls, // Store array of image URLs
      addedBy,
      colors: Array.isArray(colors) ? colors : [colors],
      productName,
      price: Number(price),
      condition,
      deliveryMethod,
      quantity: Number(quantity),
      size,
      category,
      description,
      store,
      star: 5,
      totalVotes: 5,
      numOfItemsSold: 0,
      isAdded: false,
      orderStatus: '',
      productPageVisits: 256,
      createdAt: new Date().toISOString()
    }

    Products.push(newProduct)
    const user = updateUserStoreItems(userId, newProduct)
    console.log('NEW USER WITH PRODUCT', user)
    
    if (!user) {
      return res.status(500).json({ 
        ok: false, 
        error: 'Unable to add item to store' 
      })
    }

    return {
      ok: true,
      message: 'Product was added to your store',
      data: user,
    
    }

  } catch (error) {
    console.error('Error creating product:', error)
    return res.status(500).json({ 
      ok: false, 
      error: 'Internal server error' 
    })
  }
}