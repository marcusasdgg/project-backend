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
* @returns quizId
*/
function adminQuizCreate(authUserId, name, description){

  return{ quizId: 2}

}