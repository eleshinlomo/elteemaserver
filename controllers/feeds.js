import { Users } from "../models/userData.js"
import { Feeds } from "../models/feedData.js"
import { getUserStore } from "./store.js"


// Add feed
export const createFeed = async (payload)=>{
    console.log('NEW FEED', payload)
    const {userId, text, imageUrl } = payload

    const userIndex = Users.findIndex((user)=> user.id === Number(userId))
    if(userIndex === -1){
         return {ok: false, error: 'You must be signed in before creating post.'}
    }


    if(!text){
         return {ok: false, error: 'Text is empty'}
    }

  
    
    const maxId = Feeds.length > 0 
        ? Math.max(...Feeds.map(feed => feed.feedId)) 
        : 0;

    const newFeedId = maxId + 1
    const userStore = await getUserStore(Users[userIndex].username)
    const store = userStore || null

    
    const newFeed = {
        userId: userId, 
        postedBy: Users[userIndex].username,
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