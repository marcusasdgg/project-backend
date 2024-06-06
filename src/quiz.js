/**
 * Function: Provide a list of all quizzes that are owned by the currently logged in user.
 
 * @param {authUserId} authUserId 
 * @returns object containing quizId and name 
 */
function adminQuizList(authUserId) {
  return {
    quizzes: [
      {
        quizId: 1,
        name: 'My Quiz',
      }
    ]
  };
}


/**
* Function: Given basic details about a new quiz, create one for the logged in user.

* @param {authUserId } authUserId 
* @param {name } name 
* @param {description} description 
* @returns object containing quizId of user 
*/
function adminQuizCreate(authUserId, name, description){

  return{ quizId: 2}

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
 * @returns 
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


