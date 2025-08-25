
import mongoose from "mongoose";

const adminSchema = mongoose.Schema({
        email: {type: String, default: ''}, 
        password: {type: String, default: ''}, 
        
}, {timestamps: true})

export const Admins = mongoose.model('admin', adminSchema)