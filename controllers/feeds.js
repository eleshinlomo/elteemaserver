import { Users } from "../models/userData.js"
import { Feeds } from "../models/feedData.js"
import { getUserStore } from "./store.js"
import { text } from "stream/consumers"


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
    console.log('CREATED NEW FEED', newFeed)
    Feeds.push(newFeed)
    return {ok: true, message: 'Feed has been created', data: newFeed}
}



export const updateFeed = (payload) => {

  const {text, feedId, userId} = payload

  if(!text.trim()){
    return {ok: false, error: 'Text cannot be empty'}
  }
  
  const feedIndex = Feeds.findIndex((feed)=>feed.feedId === Number(feedId))

  console.log('FEED TO UPDATE', Feeds[feedIndex])
  if(feedIndex === -1){
    return {ok: false, error: 'Feed to update OR userId not found'}
  }

  Feeds[feedIndex].text = text

  return {ok: true, message: Feeds[feedIndex]}
}


// Delete feed
export const deleteFeed = async (feedId) => {
  try {
    // Find feed
    const feedIndex = Feeds.findIndex((feed) => feed.feedId === feedId);
    if (feedIndex === -1) {
      return { ok: false, error: `Feed with ID ${feedId} not found` };
    }

    const feedToDelete = Feeds[feedIndex];

    // Handle single image deletion
    if (feedToDelete.image) {
      try {
        const cleanPath = cleanImagePath(feedToDelete.image);
        const filePath = getImageFilesystemPath(cleanPath);
        
        await fs.unlink(filePath);
        console.log(`Deleted image: ${cleanPath}`);
      } catch (err) {
        // Ignore "file not found" errors
        if (err.code !== 'ENOENT') {
          console.error(`Error deleting image ${feedToDelete.image}:`, err);
        }
      }
    }

    // Remove feed 
    Feeds.splice(feedIndex, 1);

    return { 
      ok: true, 
      message: 'Feed deleted successfully',
      data: Feeds
    };

  } catch (err) {
    console.error('Error in deleteFeed:', err);
    return { 
      ok: false, 
      error: 'Failed to delete feed',
      details: err.message 
    };
  }
};