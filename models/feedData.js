
import mongoose from "mongoose";

const feedSchema = mongoose.Schema({
        userId: {type: mongoose.Schema.Types.ObjectId}, 
        postedBy: {type: String, default: ''}, 
        text: {type: String, default: ''}, 
        imageUrl: {type: String, default: ''}, 
        likes: {type: Number, default: 0}, 
        comments: {type: [String], default: []},
        store: {type: Object}
}, {timestamps: true})

export const Feeds = mongoose.model('feeds', feedSchema)