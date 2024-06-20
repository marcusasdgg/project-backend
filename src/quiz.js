import { setData, getData } from "./dataStore";
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

  const quizId = database.quizzes.length + 1;
  const newQuiz = {
    quizId,
    ownerId: authUserId,
    name,
    description,
  };

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
function adminQuizRemove (authUserId, quizId) {
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
function adminQuizInfo (authUserId, quizId) {
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
  return {};
}

export {adminQuizCreate, adminQuizList, adminQuizDescriptionUpdate, adminQuizInfo, adminQuizRemove, adminQuizNameUpdate}
