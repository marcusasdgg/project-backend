function adminQuizList(authUserId ){ 
  return { quizzes: [
      {
        quizId: 1,
        name: 'My Quiz',
      }
    ]
  }
}

function adminQuizCreate(authUserId, name, description) {

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
