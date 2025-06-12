
import { Users } from "./models/userData.js";

export const capitalize = (text) => {
  if (text && typeof text === 'string') {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
  return text; // Return the original input if it's not a string
};

