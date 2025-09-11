import { Products } from "../models/productData.js";
import { Users } from "../models/userData.js";
import { Stores } from "../models/storeData.js";
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSingleStore } from "./store.js";



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
      storeAddress: user.store.address,
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
    const newProductAdded = await newProduct.save();
    let updatedProducts = []
    if(newProductAdded){
      updatedProducts = await Products.find() 
    }

    return {
      ok: true,
      message: "Product added successfully",
      data: updatedProducts
    };

  } catch (error) {
    console.error("Error creating product:", error);
    return {
      ok: false,
      error: error.message || "Internal server error"
    };
  }
};



// Update views
export const updateViews = async (payload) => {

  const { productId } = payload;
  const normaliZedId = productId?.toString()
  if (!normaliZedId) {
    return { ok: false, error: `ProductId not included` };
  }

  const existingProduct = await Products.findById(productId);
  if (!existingProduct) {
    return { ok: false, error: `Existing product not found` };
  }

  const productUpdated = await Products.findOneAndUpdate(
    { _id: productId },
    { $inc: { views: 1 } },  // increment views safely
    { new: true }
  );
   
  
  if (productUpdated) {
    const updatedProducts = await Products.find()
    return { ok: true, data: updatedProducts };
  }

  return { ok: false, error: `Unable to update product views` };
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
      imagesToRemove = [],
      likes,
    } = payload;

    // Normalize helper to ensure flat string arrays
    const normalizeColors = (val) => {
      if (!val) return [];
      if (Array.isArray(val)) {
        return val.flat(Infinity).map(String).map(s => s.trim()).filter(Boolean);
      }
      if (typeof val === 'string') {
        const str = val.trim();
        try {
          const parsed = JSON.parse(str);
          if (Array.isArray(parsed)) {
            return parsed.flat(Infinity).map(String).map(s => s.trim()).filter(Boolean);
          }
        } catch {}
        if (str.includes(',')) {
          return str.split(',').map(s => s.trim()).filter(Boolean);
        }
        return [str];
      }
      return [String(val)];
    };

    const processedColors = normalizeColors(colors);

    // 1. Get the existing product first
    const existingProduct = await Products.findById(productId);
    if (!existingProduct) {
      return { ok: false, error: 'Product not found.' };
    }

    // 2. Process images - remove deleted ones from S3
    for (const url of imagesToRemove) {
      try {
        const urlParts = url.split('/');
        const key = urlParts.slice(3).join('/');
        await s3Client.send(new DeleteObjectCommand({
          Bucket: process.env.BUCKET_NAME,
          Key: key,
        }));
      } catch (err) {
        console.error(`Error deleting image from S3: ${url}`, err);
      }
    }

    // 3. Combine kept existing images with new ones
    const keptExistingImages = existingProduct.imageUrls.filter(
      url => !imagesToRemove.includes(url)
    );
    const finalImageUrls = [...keptExistingImages, ...imageUrls];

    // 4. Find user
    const user = await Users.findById(userId);
    if (!user) {
      return { ok: false, error: `User with ID ${userId} not found.` };
    }

    // Update user.store.items
    // if (user.store?.items) {
    //   const storeIndex = user.store.items.findIndex(
    //     (item) => item._id.toString() === productId
    //   );
    //   if (storeIndex !== -1) {
    //     const item = user.store.items[storeIndex];
    //     item.addedBy = addedBy || item.addedBy;
    //     item.imageUrls = finalImageUrls;
    //     item.colors = processedColors.length ? processedColors : item.colors;
    //     item.productName = productName || item.productName;
    //     item.price = price !== undefined ? Number(price) : item.price;
    //     item.condition = condition || item.condition;
    //     item.deliveryMethod = deliveryMethod || item.deliveryMethod;
    //     item.quantity = quantity !== undefined ? quantity : item.quantity;
    //     item.unitCost = unitCost !== undefined ? unitCost : item.unitCost;
    //     item.shoeSizes = shoeSizes || item.shoeSizes;
    //     item.clotheSizes = clotheSizes || item.clotheSizes;
    //     item.category = category || item.category;
    //     item.description = description || item.description;

    //     user.markModified('store');
    //   }
    // }

    // Update user.cart if needed
    // if (user.cart?.length > 0) {
    //   const cartIndex = user.cart.findIndex(
    //     (item) => item._id.toString() === productId
    //   );
    //   if (cartIndex !== -1) {
    //     const item = user.cart[storeIndex];
    //     item.addedBy = addedBy || item.addedBy;
    //     item.imageUrls = finalImageUrls;
    //     item.colors = processedColors.length ? processedColors : item.colors;
    //     item.productName = productName || item.productName;
    //     item.price = price !== undefined ? Number(price) : item.price;
    //     item.condition = condition || item.condition;
    //     item.deliveryMethod = deliveryMethod || item.deliveryMethod;
    //     item.quantity = quantity !== undefined ? quantity : item.quantity;
    //     item.unitCost = unitCost !== undefined ? unitCost : item.unitCost;
    //     item.shoeSizes = shoeSizes || item.shoeSizes;
    //     item.clotheSizes = clotheSizes || item.clotheSizes;
    //     item.category = category || item.category;
    //     item.description = description || item.description;
    //     user.markModified('cart');
    //   }
    // }

    // await user.save();

    // 5. Update product in Products collection
    const productUpdated = await Products.findOneAndUpdate(
      { _id: productId, storeId: user.store._id },
      {
        $set: {
          addedBy: addedBy || existingProduct.addedBy,
          imageUrls: finalImageUrls,
          colors: processedColors.length ? processedColors : existingProduct.colors,
          productName: productName || existingProduct.productName,
          price: price !== undefined ? Number(price) : existingProduct.price,
          condition: condition || existingProduct.condition,
          deliveryMethod: deliveryMethod || existingProduct.deliveryMethod,
          quantity: quantity !== undefined ? quantity : existingProduct.quantity,
          unitCost: unitCost !== undefined ? unitCost : existingProduct.unitCost,
          shoeSizes: shoeSizes || existingProduct.shoeSizes,
          clotheSizes: clotheSizes || existingProduct.clotheSizes,
          category: category || existingProduct.category,
          description: description || existingProduct.description,
          likes: likes || existingProduct.likes,
          
        },
      },
      { new: true }
    );

    if (!productUpdated) {
      return { ok: false, error: 'Product not found or not owned by user.' };
    }

 
     const  updatedProducts = await Products.find() 
    

    // 6. Update store document
    // const store = await Stores.findOne({ _id: user?.store?._id.toString() });
    // if (!store) {
    //   return { ok: false, error: 'Store not found for this user.' };
    // }

    // const storeIndex = store.items.findIndex(
    //   (item) => item._id.toString() === productId
    // );
    // if (storeIndex !== -1) {
    //   const item = store.items[storeIndex];
    //   item.addedBy = addedBy || item.addedBy;
    //   item.imageUrls = finalImageUrls;
    //   item.colors = processedColors.length ? processedColors : item.colors;
    //   item.productName = productName || item.productName;
    //   item.price = price !== undefined ? Number(price) : item.price;
    //   item.condition = condition || item.condition;
    //   item.deliveryMethod = deliveryMethod || item.deliveryMethod;
    //   item.quantity = quantity !== undefined ? quantity : item.quantity;
    //   item.unitCost = unitCost !== undefined ? unitCost : item.unitCost;
    //   item.shoeSizes = shoeSizes || item.shoeSizes;
    //   item.clotheSizes = clotheSizes || item.clotheSizes;
    //   item.category = category || item.category;
    //   item.description = description || item.description;

    //   store.markModified('items');
    //   await store.save();
    // }

    return {
      ok: true,
      message: 'Product updated successfully',
      data: {
        updatedUser: user,
        updatedProducts
      },
    };
  } catch (error) {
    console.error('Error updating product:', error);
    return {
      ok: false,
      error: error.message || 'Internal server error',
    };
  }
};




// Hide or Unhide product
export const modifyProductDisplay = async (payload) => {
  const { isHidden, productId, userId } = payload;

  try {
    // 1. Update in Users collection (nested array)
    const user = await Users.findOneAndUpdate(
      {
        _id: userId,
        "store.items._id": productId
      },
      {
        $set: { "store.items.$.isHidden": isHidden }
      },
      { new: true }
    );

    if (!user) {
      return { ok: false, error: `No user with the id ${userId} found or product not in user store` };
    }

    // 2. Update in Products collection (direct field)
    const product = await Products.findOneAndUpdate(
      { _id: productId },
      { $set: { isHidden: isHidden } },
      { new: true }
    );

    if (!product) {
      return { ok: false, error: `No product with the id ${productId} found` };
    }

  

const store = await Stores.findOneAndUpdate(
  {
    _id: user?.store?._id, // string match
    'items._id': productId.toString() // string match
  },
  { $set: { 'items.$.isHidden': isHidden } },
  { new: true }
);


    if (!store) {
      return { ok: false, error: `No product with the id ${productId} found in store` };
    }

    // 3. Get updated list of products
    const updatedProducts = await Products.find();
    const updatedUser = user

    return {
      ok: true,
      message: "Product successfully modified",
      data: { updatedUser, updatedProducts }
    };

  } catch (err) {
    console.log('Hide product err:', err);
    return { ok: false, error: 'Server error' };
  }
};






// Delete product
export const deleteProduct = async (userId, productId) => {
  try {
    const product = await Products.findOne({ _id: productId });

    if (!product) {
      return { ok: false, message: `Unable to find product with ID ${productId}` };
    }
    
      const user = await Users.findOne({_id: userId})
    if(!user){
      return {ok: false, error: `User with id ${userId} not found`}
    }
    
     const sellerOrders = user?.store?.orders?.currentOrders.find((order)=>order?.productId?.toString() === productId.toString())
    

    if (sellerOrders) {
      return {
        ok: false,
        error: 'You cannot delete a product that has been ordered by a user. Please cancel the order first.'
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

    // 🧼 Remove product from Stores collection
    await Stores.updateMany(
      { 'items._id': product._id },
      { $pull: { items: { _id: product._id } } }
    );

      // 🧼 Remove product from user store
    user.store.items = user?.store?.items.filter((item)=> item._id.toString() !== productId)
    user.markModified('store')
    const updatedUser = await user.save()

    // ✅ Return updated state
    const updatedProducts = await Products.find();

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