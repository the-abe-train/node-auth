import { user } from "../user/user";
import bcrypt from "bcryptjs";
const { compare } = bcrypt;

export async function authorizeUser(email: string, password: string) {
	
	// look up user
	// get user password
	// compare password with one in database
	// return boolean of "if password is correct"


	const userData = await user.findOne({
		'email.address': email
	})

  if (userData) {
    console.log(userData);
  
    const savedPassword = userData.password;
    const isAuthorized = await compare(password, savedPassword);
    console.log("isAuthorized", isAuthorized);
    return {isAuthorized, userId: userData._id};
  }
  return {isAuthorized: false, userId: null}
  
}