
/**
 * Provide a list of all quizzes that are owned by the currently logged in user.
 
 * @param {authUserId} authUserId 
 * @returns object containing quizId and name 
 */
function adminQuizList(authUserId ){ 
      return{ quizzes: [
    {
      quizId: 1,
      name: 'My Quiz',
    }
   ]
  }
}


/**
 * Given basic details about a new quiz, create one for the logged in user.
 
 * @param {authUserId } authUserId 
 * @param {name } name 
 * @param {description} description 
 * @returns quizId
 */
function adminQuizCreate(authUserId, name, description){

  return { 
    quizId: 2
  }

}

function adminQuizRemove (authUserId, quizId) {
  return {
      
  }
}

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
 * adminQuizDescriptionUpdate function stub 
 */
function adminQuizDescriptionUpdate(authUserId, quizId, name) {
  return {};
}

/**
 * adminQuizNameUpdate function stub
 */
function adminQuizNameUpdate() {
  return {};
}