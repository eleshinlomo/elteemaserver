import { Users } from "../models/userData.js"
import { Feeds } from "../models/feedData.js"
import { getStore } from "../utils.js"


// Add feed
export const createFeed = async (payload)=>{
    
    const {userId, text, imageUrl } = payload
    if(!userId || !text || !imageUrl){
       
         return {ok: false, error: 'Problem with payload'}
    }
    const userIndex = Users.findIndex((user)=> user.id === userId)
    if(userIndex === -1){
         return {ok: false, error: 'You must be signed in before creating post.'}
    }
    
    const maxId = Feeds.length > 0 
        ? Math.max(...Feeds.map(feed => feed.feedId)) 
        : 0;

    const newFeedId = maxId + 1
    const userStore = await getStore(Users[userIndex].username)
      const store = userStore || [] // array
    
    const newFeed = {
        userId: userId, 
        username: Users[userIndex].username,
        feedId: newFeedId, 
        text: text, 
        imageUrl: imageUrl,
        likes: 0,
        createdAt: new Date(),
        comments: [], 
        store: store
    }
    Feeds.push(newFeed)
    return {ok: true, message: 'Feed has been created', data: newFeed}
}