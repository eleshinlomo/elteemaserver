

import mongoose from "mongoose";

const waitlistSchema = mongoose.Schema({
        firstname: {type: String, default: ''}, 
        lastname: {type: String, default: ''}, 
        clientType: {type: String, default: ''}, 
        numOfProperties: {type: Number, default: 0}, 
        email: {type: String, default: ''}, 
}, {timestamps: true})

export const Waitlists = mongoose.model('waitlists', waitlistSchema)