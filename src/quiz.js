import { setData, getData } from "./dataStore";

/**
 * A function that scrapes the database to see if there is a user with said ID.
 * @param {*} database
 * @param {*} authUserId
 * @returns false or reference to user object within the dataBase.users array.
 */
function containsUser(database, id) {
  return database.users.find((user) => user.userId === id) || false;
}

/**
 * A function that scrapes the database to see if there is a user with said ID.
 * @param {*} database
 * @param {*} authUserId
 * @returns false or reference to user object within the dataBase.users array.
 */
function containsQuiz(database, id) {
  return database.quizzes.find((quiz) => quiz.quizId === id) || false;
}

/**
 * A function that scrapes the database to see if a quiz is owned by a user.
 * @param {*} database
 * @param {*} authUserId
 * @param {*} quizId
 * @returns false or reference to user object within the dataBase.users array.
 */
function quizOwned(database, authUserId, quizId) {
  for (const quiz of database.quizzes) {
    if (quiz.quizId === quizId && quiz.ownerId === authUserId) {
      return true;
    }
  }

  return false;
}

/**
 * A function that scrapes the database to see if a name is unique.
 * @param {*} database 
 * @param {*} authUserId
 * @param {*} quizId
 * @param {*} name
 * @returns false or true.
 */
function isNameUnique(database, authUserId, quizId, name) {
  for (const quiz of database.quizzes) {
    if (
      quiz.quizId === quizId &&
      quiz.ownerId === authUserId &&
      quiz.name === name
    ) {
      return false;
    }
  }

  return true;
}

/**
 * Function: Provide a list of all quizzes that are owned by the currently logged in user.
 
 * @param {authUserId} authUserId 
 * @returns object containing quizId and name 
 */
function adminQuizList(authUserId) {
  const database = getData();
  const user = database.users.find(user => user.userId === authUserId);

  if (!user) {
    return { error: 'AuthUserId is not a valid user' };
  }

  const quizzes = database.quizzes.filter(quiz => quiz.ownerId === authUserId).map(quiz => ({
    quizId: quiz.quizId,
    name: quiz.name,
  }));

  return { quizzes };

}


/**
* Function: Given basic details about a new quiz, create one for the logged in user.

* @param {authUserId } authUserId 
* @param {name } name 
* @param {description} description 
* @returns object containing quizId of user 
*/
function adminQuizCreate(authUserId, name, description) {
  const database = getData();

  if(!database.hasOwnProperty('quizzesCreated')){
    database.quizzesCreated =0;
  }
  
  const user = database.users.find(user => user.userId === authUserId);

  if (!user) {
    return { error: 'AuthUserId is not a valid user' };
  }

  if (!/^[a-zA-Z0-9 ]+$/.test(name)) {
    return { error: 'Name contains invalid characters' };
  }

  if (name.length < 3 || name.length > 30) {
    return { error: 'Name is either less than 3 characters long or more than 30 characters long' };
  }

  if (description.length > 100) {
    return { error: 'Description is more than 100 characters in length' };
  }

  const quizExists = database.quizzes.find(quiz => quiz.ownerId === authUserId && quiz.name === name);
  if (quizExists) {
    return { error: 'Name is already used by the current logged in user for another quiz' };
  }

  const quizId = database.quizzesCreated + 1;
  database.quizzesCreated +=1;
  const newQuiz = {
    quizId,
    ownerId: authUserId,
    name,
    description,
  };

  newQuiz.timeCreated = Date.now();
  newQuiz.timeLastEdited = Date.now();

  database.quizzes.push(newQuiz);
  setData(database);

  return { quizId };
}


/**
 * This function removes a quiz using userId.
 * 
 * @param {*} authUserId 
 * @param {*} quizId 
 * @returns 
 */
function adminQuizRemove(authUserId, quizId) {
  return {

  }
}

/**
 * This function stores quiz info.
 * 
 * @param {*} authUserId 
 * @param {*} quizId 
 * @returns returns a object containing info about the quiz in question.
 */
function adminQuizInfo(authUserId, quizId) {
  return {
    quizId: 1,
    name: 'My Quiz',
    timeCreated: 1683125870,
    timeLastEdited: 1683125871,
    description: 'This is my quiz',
  }
}

/**
 * Update the name of the relevant quiz.
 * @param {*} authUserId id of the user who owns the quiz
 * @param {*} quizId if of the quiz to have it's name changed
 * @param {*} name new name of the quiz
 * @returns {{}} empty object 
 */
function adminQuizNameUpdate(authUserId, quizId, name) {
  let data = getData();

  const regex = /^[a-zA-Z0-9 ]{3,30}$/;

  if (!containsUser(data, authUserId)) {
    return { error: "provided authUserId is not a real user." };
  }

  if (!containsQuiz(data, quizId)) {
    return { error: "provided quizId is not a real quiz." };
  }

  if (!quizOwned(data, authUserId, quizId)) {
    return { error: "provided quizId is not owned by current user." };
  }

  if (!regex.test(name)) {
    return { error: "name is invalid." };
  }

  if (!isNameUnique(data, authUserId, quizId, name)) {
    return { error: "name is being used for another quiz." };
  }

  let quiz = data.quizzes.find((element) => element.quizId === quizId);

  quiz.quizName = name;
  quiz.timeLastEdited = Date.now();

  setData(data);
  return {};
}

/**
 * Update the description of the relevant quiz.
 * @param {*} authUserId id of the user who owns the quiz
 * @param {*} quizId id of the quiz to have it's description updated
 * @param {*} description new description of the quiz 
 * @returns {{}} empty object 
 */
function adminQuizDescriptionUpdate(authUserId, quizId, description) {
  let data = getData();

  const regex = /^.{0,100}$/;

  if (!containsUser(data, authUserId)) {
    return { error: "provided authUserId is not a real user." };
  }

  if (!containsQuiz(data, quizId)) {
    return { error: "provided quizId is not a real quiz." };
  }

  if (!quizOwned(data, authUserId, quizId)) {
    return { error: "provided quizId is not owned by current user." };
  }

  if (!regex.test(description)) {
    return { error: "description is invalid." };
  }

  let quiz = data.quizzes.find((element) => element.quizId === quizId);

  quiz.description = description;
  quiz.timeLastEdited = Date.now();

  setData(data);
  return {};
}


export { adminQuizCreate, adminQuizList, adminQuizDescriptionUpdate, adminQuizInfo, adminQuizRemove, adminQuizNameUpdate }
