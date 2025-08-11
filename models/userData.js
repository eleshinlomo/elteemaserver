import { Products } from "./productData.js"
import mongoose from "mongoose"


// Session
const sessionSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'}, 
    email: {type: String, default: '', unique: true},
    authCode: {type: String, default: '', unique: true}
})


// User
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, lowercase: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  authCode: { type: String, default: '0' },
  paymentEmail: { type: String, default: '' },
  paymentMethod: { type: String, default: '' },
  cart: { type: Array, default: [] },
  isCookieAccepted: {type: Boolean, default: false},
  isLoggedIn: { type: Boolean, default: false },
  type: { type: String, default: "customer" },
  role: { type: String, default: "customer" },
  service: { type: String, default: "Petrolage Store" },
  createdAt: { type: Date, default: Date.now },
  firstname: { type: String, default: '' },
  lastname: { type: String, default: '' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  orders: { type: Array, default: [] },
  gender: { type: String, default: '' },
  city: { type: String, default: '' },
  store: { type: Object, default: null },
  state: { type: String, default: '' },
  country: {type: String, default: ''},
  lastLogin: { type: Date, default: null },
  isNewsletter: { type: Boolean, default: true }
},
{ timestamps: true}
)


export const Users = mongoose.model("users", userSchema)
export const Sessions = mongoose.model("sessions", sessionSchema)


           
           


   
        

          
            
            

          
            
            