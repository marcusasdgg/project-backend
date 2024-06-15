import validator from 'validator';
import {getData,setData} from './dataStore.js'
/**
 * a function that logins a user given a email and password.
 * @param {*} email 
 * @param {*} password 
 * @returns user Id for given email and password
 */
function adminAuthLogin(email, password) {

  return {
    authUserId: 1,
  };
}

/**
 * Registers user as an admin.
 * @param {*} email 
 * @param {*} password 
 * @param {*} nameFirst 
 * @param {*} nameLast 
 * @returns {} returns the User Id.
 * 
 */
function adminAuthRegister(email, password, nameFirst, nameLast) {

  return {
    authUserId: 1
  }
}
  

/**
 * function that returns the user details of a user given the ID.
 * @param {*} authUserId 
 * @returns user object with fields for the user 
 */
function adminUserDetails(authUserId) {

  return {
    user: {
      userId: 1,
      name: 'Hayden Smith',
      email: 'hayden.smith@unsw.edu.au',
      numSuccessfulLogins: 3,
      numFailedPasswordsSinceLastLogin: 1,
    },
  };
}

/**
 * 
 * @param {*} authUserId 
 * @param {*} email 
 * @param {*} nameFirst 
 * @param {*} nameLast 
 * @returns an empty object for now.
 */
// Function: adminUserDetailsUpdate
function adminUserDetailsUpdate(authUserId, email, nameFirst, nameLast) {
  let dataBase = getData();
  //check if authuserid is not a valid user
  let user = containsUser(dataBase, authUserId);
  if (user === false){
    return {error: "AuthUserId is not a valid user"};
  }

  // check if email is used by a current user.
  if (containsEmail !== false){
    return {error: "Email is currently used by another user"};
  }
  
  if (!validator.isEmail(email)){
    return {error: "Email does not satisfy validity."};
  }

  //check if first name and last name contains characters other than
  // lowercase letters, uppercase letters, spaces, hyphens, or apostrophes via regex
  const namePattern = /[^a-zA-Z\s\-']/
  if (namePattern.test(nameFirst)){
    return {error: "Invalid first name"};
  }
  if (namePattern.test(nameLast)){
    return {error: "Invalid last name"};
  }

  //check first and lastname to see if has required character length range.
  if (nameFirst.length < 2 || nameFirst.length > 20){
    return {error: "Invalid first name"};
  }
  if (nameLast.length < 2 || nameLast.length > 20){
    return {error: "Invalid last name"};
  }

  user.email = email;
  user.nameFirst = nameFirst;
  user.nameLast = nameLast;
  setData(dataBase);

  return { }
}

/**
 * A function that scrapes the database to see if there is a user with said ID.
 * @param {*} dataBase 
 * @param {*} authUserId 
 * @returns false or reference to user object within the dataBase.users array.
 */
function containsUser(dataBase, authUserId){
  return dataBase.users.find(user => user.Id === authUserId) || false;
}

/**
 * a function that scrapes the database to see if there is a user with said email.
 * @param {*} dataBase 
 * @param {*} email 
 * @returns false or reference to user with said email.
 */
function containsEmail(dataBase, email){
  return dataBase.users.find(user => user.email === email) || false;
}


/**
 * A function that updates the password of a user.
 * @param {*} authUserId 
 * @param {*} oldPassword 
 * @param {*} newPassword 
 * @returns an empty object for now
 */
function adminUserPasswordUpdate(authUserId, oldPassword, newPassword) {
  return {

  }
}

export {adminAuthLogin, adminAuthRegister, adminUserDetails, adminUserDetailsUpdate, adminUserPasswordUpdate}