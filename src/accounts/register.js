import bcrypt from "bcryptjs";
const { genSalt, hash } = bcrypt;

export async function registerUser(email, password) {

  // Generate salt
  const salt = await genSalt(10);
  console.log('salt', salt);
  
  
  // Hash with salt
  const hashedPassword = await hash(password, salt);
  console.log('hash', hashedPassword);


  // Store in database


  // Return user from database


}