/**
 * adminQuizNameUpdate function stub
 */
function adminQuizNameUpdate() {
    return {};
}

function adminQuizList(authUserId) {
  return {
    quizzes: [
      {
        quizId: 1,
        name: 'My Quiz',
      }
    ]
  }
}

function adminQuizCreate(authUserId, name, description) {

  return { quizId: 2 }

}

/**
 * adminQuizNameUpdate function stub
 */
function adminQuizNameUpdate() {
  return {};
}

/**
 * adminQuizDescriptionUpdate function stub 
 */
function adminQuizDescriptionUpdate(authUserId, quizId, name) {
  return {};
}

