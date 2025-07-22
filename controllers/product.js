import { Products } from "../models/productData.js";
import path from 'path';
import fs from 'fs/promises';
import { Users } from "../models/userData.js";
import { cleanImagePath, getImageFilesystemPath } from "../utils.js";
import { Stores } from "../models/storeData.js";
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';



const s3Client = new S3Client({ region: process.env.BUCKET_REGION });




export const createProduct = async (imageUrls, payload) => {
  try {
    const {
      userId,
      colors,
      productName,
      price,
      condition,
      deliveryMethod,
      quantity,
      unitCost,
      shoeSizes,
      clotheSizes,
      category,
      description,
    } = payload;

    if (!productName || !price || !description) {
      return { ok: false, error: "Missing required fields" };
    }

    const user = await Users.findById(userId);
    if (!user) return { ok: false, error: "User not found" };
    if (!user.store) return { ok: false, error: `Store not found for ${user.username}` };

    const existingProduct = await Products.findOne({
      productName: { $regex: new RegExp(`^${productName}$`, 'i') },
      userId
    });
    if (existingProduct) return { ok: false, error: "A product with this name already exists" };
    
    // This is needed to update objects in the database when a new field has just been added. Comment this out one existing objects in the databse has been updated with the newly added field
    // await Products.updateMany(
    //   {storeId: {$exists: false}},
    //   {$set: {storeId: false}}
    // )

    const newProduct = new Products({
      imageUrls,
      addedBy: user.store.storeName,
      colors,
      productName,
      price: Number(price),
      condition,
      deliveryMethod,
      quantity: Number(quantity),
      unitCost,
      shoeSizes,
      clotheSizes,
      income: 0,
      category,
      description,
      storeId: user.store._id,
      storeName: user.store.storeName,
      storePhone: user.store.phone,
      storeCity: user.store.city,
      storeState: user.store.state,
      reviews: [],
      rating: 5,
      totalVotes: 5,
      numOfItemsSold: 0,
      totalSales: 0,
      isAdded: false,
      orderStatus: "",
      productPageVisits: 0,
    });

    // First save product
    const savedProduct = await newProduct.save();

    user.store.items.push(savedProduct); 
    user.markModified('store')
    const updatedUser = await user.save();
     
    // Update Stores with new item
    const userStoreInStores = await Stores.findOne({userId: user._id})
    userStoreInStores.items.push(newProduct)
    await userStoreInStores.save()


    return {
      ok: true,
      message: "Product added successfully",
      data: updatedUser // or updated user if needed
    };

  } catch (error) {
    console.error("Error creating product:", error);
    return {
      ok: false,
      error: error.message || "Internal server error"
    };
  }
};


// Update product
export const updateProduct = async (imageUrls, payload) => {
  try {
    const {
      userId,
      productId,
      addedBy,
      colors,
      productName,
      price,
      condition,
      deliveryMethod,
      quantity,
      unitCost,
      shoeSizes,
      clotheSizes,
      category,
      description,
    } = payload;


    // 1. Get the product first (for fallback imageUrls)
const existingProduct = await Products.findById(payload.productId);
if (!existingProduct) {
  return { ok: false, error: 'Product not found.' };
}

// 2. Fallback: use existing imageUrls if no new ones are provided
const finalImageUrls =
  Array.isArray(imageUrls) && imageUrls.length > 0
    ? imageUrls
    : existingProduct.imageUrls;



    // Find user
    const user = await Users.findById(userId);
    if (!user) {
      return { ok: false, error: `User with ID ${userId} not found.` };
    }

    // ✅ Update user.store.items
    if (user.store?.items) {
      const storeIndex = user.store.items.findIndex(
        (item) => item._id.toString() === productId
      );
      if (storeIndex !== -1) {
        const item = user.store.items[storeIndex];
        if (addedBy !== undefined) item.addedBy = addedBy;
        if (imageUrls) item.imageUrls = finalImageUrls;
        if (colors !== undefined) item.colors = colors;
        if (productName !== undefined) item.productName = productName;
        if (price !== undefined) item.price = Number(price);
        if (condition !== undefined) item.condition = condition;
        if (deliveryMethod !== undefined) item.deliveryMethod = deliveryMethod;
        if (quantity !== undefined) item.quantity = quantity;
        if(unitCost !== undefined) item.unitCost = unitCost;
        if(shoeSizes !== undefined) item.shoeSizes = shoeSizes;
        if(clotheSizes !== undefined) item.clotheSizes = clotheSizes;
        if (category !== undefined) item.category = category;
        if (description !== undefined) item.description = description;

        user.markModified('store');
      }
    }

    // ✅ Update user.cart item if it exists. This makes no sen and needs work. Cart should be updated and not user.cart
    if (user.cart?.length > 0) {
      const cartIndex = user.cart.findIndex(
        (item) => item._id === productId
      );
      if (cartIndex !== -1) {
        const item = user.cart[cartIndex];
        if (addedBy !== undefined) item.addedBy = addedBy;
        if (imageUrls) item.imageUrls = finalImageUrls;
        if (colors !== undefined) item.colors = colors;
        if (productName !== undefined) item.productName = productName;
        if (price !== undefined) item.price = price;
        if (condition !== undefined) item.condition = condition;
        if (deliveryMethod !== undefined) item.deliveryMethod = deliveryMethod;
        if (quantity !== undefined) item.quantity = quantity;
        if(unitCost !== undefined) item.unitCost = unitCost;
        if(shoeSizes !== undefined) item.shoeSizes = shoeSizes;
        if(clotheSizes !== undefined) item.clotheSizes = clotheSizes;
        if (category !== undefined) item.category = category;
        if (description !== undefined) item.description = description;

        user.markModified('cart');
      }
    }

    await user.save(); // ✅ Only save once

    // ✅ Update product in Products collection
    const updatedProduct = await Products.findOneAndUpdate(
      { _id: productId, storeId: user.store._id },
      {
        $set: {
          ...(addedBy && { addedBy }),
          ...(imageUrls && { finalImageUrls}),
          ...(colors && { colors }),
          ...(productName && { productName }),
          ...(price !== undefined && { price }),
          ...(condition && { condition }),
          ...(deliveryMethod && { deliveryMethod }),
          ...(quantity !== undefined && { quantity }),
          ...(shoeSizes && { shoeSizes }),
          ...(clotheSizes && { clotheSizes }),
          ...(unitCost && { unitCost }),
          ...(category && { category }),
          ...(description && { description }),
        },
      },
      { new: true }
    );

    if (!updatedProduct) {
      return { ok: false, error: 'Product not found or not owned by user.' };
    }

    // ✅ Update product inside Store model
    const store = await Stores.findOne({ userId: user._id });
    if (!store) {
      return { ok: false, error: 'Store not found for this user.' };
    }

    const storeIndex = store.items.findIndex(
      (item) => item._id.toString() === productId
    );
    if (storeIndex !== -1) {
      const item = store.items[storeIndex];
      if (addedBy !== undefined) item.addedBy = addedBy;
      if (imageUrls !== undefined) item.imageUrls = finalImageUrls;
      if (colors !== undefined) item.colors = colors;
      if (productName !== undefined) item.productName = productName;
      if (price !== undefined) item.price = price;
      if (condition !== undefined) item.condition = condition;
      if (deliveryMethod !== undefined) item.deliveryMethod = deliveryMethod;
      if (quantity !== undefined) item.quantity = quantity;
      if(unitCost !== undefined) item.unitCost = unitCost;
      if(shoeSizes !== undefined) item.shoeSizes = shoeSizes;
      if(clotheSizes !== undefined) item.clotheSizes = clotheSizes;
      if (category !== undefined) item.category = category;
      if (description !== undefined) item.description = description;

      store.markModified('items');
      await store.save();
    }

    return {
      ok: true,
      message: 'Product updated successfully',
      data: user,
    };
  } catch (error) {
    console.error('Error updating product:', error);
    return {
      ok: false,
      error: error.message || 'Internal server error',
    };
  }
};




// Delete product
export const deleteProduct = async (userId, productId) => {
  try {
    const product = await Products.findOne({ _id: productId });

    if (!product) {
      return { ok: false, message: `Unable to find product with ID ${productId}` };
    }

     // Prevent deleting product if it's in any user order
    const userHasProductInOrders = await Users.findOne({
      'orders._id': productId
    });

    if (userHasProductInOrders) {
      return {
        ok: false,
        error: 'You cannot delete a product that has been ordered by a user. Please cancel the order first.'
      };
    }

    // Prevent deleting if in store current orders
    const storeHasProductInCurrentOrders = await Stores.findOne({
      'orders.currentOrders._id': productId
    });

    if (storeHasProductInCurrentOrders) {
      return {
        ok: false,
        error: 'You cannot delete a product that is in an ongoing store order. Please cancel the order first.'
      };
    }

    // 🧹 Delete product images from S3
    if (product.imageUrls?.length > 0) {
      await Promise.all(product.imageUrls.map(async (url) => {
        try {
          const urlParts = url.split('/');
          const key = urlParts.slice(3).join('/'); // after the bucket name
          await s3Client.send(new DeleteObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: key,
          }));
        } catch (err) {
          console.error(`Error deleting image from S3: ${url}`, err);
        }
      }));
    }

    // 🗑️ Delete product from Products collection
    await Products.deleteOne({ _id: productId });

    // 🧼 Remove product from all users
    await Users.updateMany(
      { 'store.items._id': product._id },
      { $pull: { 'store.items': { _id: product._id } } }
    );

    // 🧼 Remove product from all stores
    await Stores.updateMany(
      { 'items._id': product._id },
      { $pull: { items: { _id: product._id } } }
    );

    // ✅ Return updated state
    const updatedProducts = await Products.find();
    const updatedUser = await Users.findOne({ _id: userId });

    return {
      ok: true,
      message: 'Product deleted successfully',
      data: {
        updatedUser,
        updatedProducts,
      }
    };
  } catch (error) {
    console.error('Error deleting product:', error);
    return {
      ok: false,
      error: error.message || 'Failed to delete product'
    };
  }
};





// Get all Products
export const getAllProducts = async () => {
  try {
    const products = await Products.find()
    return {
      ok: true,
      message: products,
    };

  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      ok: false,
      error: 'Failed to fetch products'
    };
  }
};