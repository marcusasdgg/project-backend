import validator from 'validator';
import { getData, setData } from './dataStore'
import {user, data, error, adminUserDetailsReturn, sessionIdToken} from "./interface"

/**
 * A function that scrapes the database to see if there is a user with said ID.
 * @param {*} dataBase 
 * @param {*} authUserId 
 * @returns false or reference to user object within the dataBase.users array.
 */
function containsUser(dataBase: data, id: number) : user | boolean {
  return dataBase.users.find(user => user.userId === id) || false;
}

/**
 * A function that returns the User that has the particular sessionId or returns false.
 * @param database 
 * @param sessionId 
 * @returns user or boolean
 */
function sessionIdSearch(database: data, sessionId: number): user | null {
  for (const user of database.users) {
    if (user.validSessionIds.includes(sessionId)) {
      return user;
    }
  }
  return null;
}

/**
 * a function that scrapes the database to see if there is a user with said email.
 * @param {*} dataBase 
 * @param {*} email 
 * @returns false or reference to user with said email.
 */
function containsEmail(dataBase : data, email : string) : user | boolean {
  return dataBase.users.find(user => user.email === email) || false;
}

/**
 * a function that logins a user given a email and password.
 * @param {*} email 
 * @param {*} password 
 * @returns user Id for given email and password
 */
function adminAuthLogin(email : string, password : string) : {authUserId: number} | error {
  const database = getData();
  const user = database.users.find((user) => user.email === email);
  if (!user) {
    return { error: "Email address does not exist" };
  }
  if (user.password !== password) {
    user.numFailedPasswordsSinceLastLogin += 1;
    setData(database);
    return { error: "The password is incorrect" };
  }
  user.numFailedPasswordsSinceLastLogin = 0;
  user.numSuccessfulLogins += 1;
  setData(database);
  return { authUserId: user.userId }
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
function adminAuthRegister(email : string, password: string, nameFirst: string, nameLast: string) :  error | sessionIdToken {
  let database = getData();

  if (!database.hasOwnProperty('usersCreated')) {
    database.usersCreated = 0;
  }

  //check if email already exists
  for (const user of database.users) {
    if (email === user.email) {
      return { error: "Email address is used by another user" };
    }
  }

  //check if email is valid.
  if (!validator.isEmail(email)) {
    return { error: "Email does not satisfy validity." };
  }


  //check if first name and last name contains characters other than
  // lowercase letters, uppercase letters, spaces, hyphens, or apostrophes via regex
  const namePattern = /[^a-zA-Z\s\-']/
  if (namePattern.test(nameFirst)) {
    return { error: "Invalid first name" };
  }
  if (namePattern.test(nameLast)) {
    return { error: "Invalid last name" };
  }

  //check first and lastname to see if has required character length range.
  if (nameFirst.length < 2 || nameFirst.length > 20) {
    return { error: "Invalid first name" };
  }
  if (nameLast.length < 2 || nameLast.length > 20) {
    return { error: "Invalid last name" };
  }

  //check password to see if it contains more than 7 characters
  if (password.length < 8) {
    return { error: "password too short needs to be 8 characters" };
  }

  //check password to see if contains at least one number and letter
  const passwordPattern = /(?=.*[a-zA-Z])(?=.*[0-9])/
  if (!passwordPattern.test(password)) {
    return { error: "password does not at least contain 1 number and 1 letter" };
  }

  //all checks done time to add user to database and assign user id.
  const authUserId = database.usersCreated;
  database.usersCreated += 1;
  let validSessionIds : number[] = [];
  validSessionIds.push(database.totalLogins);
  let sessionId = database.totalLogins;

  const newUser : user = {
    firstName: nameFirst,
    lastName: nameLast,
    password: password,
    userId: authUserId,
    email: email,
    numSuccessfulLogins: 1,
    numFailedPasswordsSinceLastLogin: 0,
    previousPasswords: [],
    validSessionIds 
  };

  database.totalLogins += 1;
  database.users.push(newUser);
  setData(database);

  console.log("registered sessionID " + sessionId);

  return {
    sessionId
  }
}


/**
 * function that returns the user details of a user given the ID.
 * @param {*} authUserId 
 * @returns user object with fields for the user 
 */
function adminUserDetails(authUserId : number) : adminUserDetailsReturn | error  {
  const database = getData();
  const user = database.users.find((user) => user.userId === authUserId);
  if (!user) {
    return { error: "AuthUserId is not a valid user" }
  }
  //if authUserId is valid, return details about user
  return {
    user: {
      userId: authUserId,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      numSuccessfulLogins: user.numSuccessfulLogins,
      numFailedPasswordsSinceLastLogin: user.numFailedPasswordsSinceLastLogin,
    }
  }
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
function adminUserDetailsUpdate(sessionId: number, email : string, nameFirst : string, nameLast : string) : error | {}  {
  let dataBase = getData();
  //check if authuserid is not a valid user
  let user = sessionIdSearch(dataBase, sessionId);
  if (user === null) {
    return { error: "invalid Token" };
  }

  // check if email is used by a current user.
  let potSameUser = containsEmail(dataBase, email);
  if (potSameUser !== false && typeof potSameUser === 'object' && typeof user === 'object') {
    if (user.userId !== potSameUser.userId) {
      return { error: "Email is currently used by another user" };
    }
  }

  if (!validator.isEmail(email)) {
    return { error: "Email does not satisfy validity." };
  }

  //check if first name and last name contains characters other than
  // lowercase letters, uppercase letters, spaces, hyphens, or apostrophes via regex
  const namePattern = /[^a-zA-Z\s\-']/
  if (namePattern.test(nameFirst)) {
    return { error: "Invalid first name" };
  }
  if (namePattern.test(nameLast)) {
    return { error: "Invalid last name" };
  }

  //check first and lastname to see if has required character length range.
  if (nameFirst.length < 2 || nameFirst.length > 20) {
    return { error: "Invalid first name" };
  }
  if (nameLast.length < 2 || nameLast.length > 20) {
    return { error: "Invalid last name" };
  }

  if (typeof user === 'object'){
    user.email = email;
    user.firstName = nameFirst;
    user.lastName = nameLast;
  }
  setData(dataBase);

  return {}
}

/**
 * A function that updates the password of a user.
 * @param {*} authUserId 
 * @param {*} oldPassword 
 * @param {*} newPassword 
 * @returns an empty object for now
 */
function adminUserPasswordUpdate(sessionId : number, oldPassword : string, newPassword : string) : error | {} {

  let dataBase = getData();

  //check auth user id to see if valid;
  let user = sessionIdSearch(dataBase, sessionId);
  if (user === null) {
    return { error: "invalid Token" };
  }

  //check if old password is correct
  if (typeof user === 'object' && user.password !== oldPassword) {
    return { error: "Old password is not the correct old password" };
  }

  //check if old and new passwords are the exact same.
  if (oldPassword === newPassword) {
    return { error: "Old Password and New Password match exactly" };
  }

  //check if password has been used before.
  if (user.hasOwnProperty("previousPasswords")) {
    if (typeof user === 'object' && user.previousPasswords.find(password => password === newPassword) !== undefined) {
      return { error: "New password has already been used before by this user." };
    }
  }

  //check if password is less than 8 characters
  if (newPassword.length < 8) {
    return { error: "New password is too short." }
  }

  //check if password has at least 1 number and letter.
  const passwordPattern = /(?=.*[a-zA-Z])(?=.*[0-9])/
  if (!passwordPattern.test(newPassword)) {
    return { error: "password does not at least contain 1 number and 1 letter" };
  }

  if (typeof user === 'object'){
    user.password = newPassword;
    user.previousPasswords.push(oldPassword);
  }
  
  setData(dataBase);

  return {

  }
}

export { adminAuthLogin, adminAuthRegister, adminUserDetails, adminUserDetailsUpdate, adminUserPasswordUpdate, sessionIdSearch }