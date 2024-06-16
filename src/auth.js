import validator from 'validator';
import {getData,setData} from './dataStore.js'
/**
 * a function that logins a user given a email and password.
 * @param {*} email 
 * @param {*} password 
 * @returns user Id for given email and password
 */
function adminAuthLogin(email, password) {
  let database = getData();
  if(!database.hasOwnProperty('users')){
    database = {users: [], quizzes: []};
  }
  for(const user of database.users) {
    if(email === user.email && password === user.password) {
      return user.userId;
    } else if(email === user.email && password !== user.password){ 
      return {error: "The password is incorrect"};
    } else if(email !== user.email) {
      return {error: "Email address does not exist"};
    }
  }
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
  let database = getData();
  if(!database.hasOwnProperty('users')){
    database = {users: [], quizzes: []};
  }

  //check if email already exists
  for (const user of database.users){
    if (email === user.email){
      return {error: "Email address is used by another user"};
    }
  }

  //check if email is valid.
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

  //check password to see if it contains more than 7 characters
  if (password.length < 8){
    return {error: "password too short needs to be 8 characters"};
  }
  
  //check password to see if contains at least one number and letter
  const passwordPattern = /(?=.*[a-zA-Z])(?=.*[0-9])/
  if (!passwordPattern.test(password)){
    return {error: "password does not at least contain 1 number and 1 letter"};
  }
  
  //all checks done time to add user to database and assign user id.
  const authUserId = database.users.length;
  const newUser = {firstName: nameFirst, 
      lastName: nameLast,
      password: password,
      quizzesOwned: [],
      userId: authUserId,
      email: email,
      numSuccessfulLogins: 1,
      numFailedPasswordsSinceLastLogin: 0,
    };
  database.users.push(newUser);
  setData(database);
  return {
    authUserId: authUserId
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
  return {

  }
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