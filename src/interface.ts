interface quiz {
  quizId: number,
  ownerId: number,
  name: string,
  description: string,
  timeCreated: number,
  timeLastEdited: number,
}
  
interface user {
  lastName: string,
  firstName: string,
  password: string,
  userId: number,
  email: string,
  numSuccessfulLogins: number,
  numFailedPasswordsSinceLastLogin: number
  previousPasswords : string[]
  validSessionIds : number[],
}
  
interface data {
  users: user[],
  quizzes: quiz[],
  usersCreated: number,
  quizzesCreated: number,
  totalLogins: number,
  trash: quiz[]
}

interface error {
  error: string,
}

interface adminUserDetailsReturn {
  user: {
    userId: number,
    name: string,
    email: string,
    numSuccessfulLogins: number,
    numFailedPasswordsSinceLastLogin: number 
  }
}

interface quizListReturn{
  quizzes: {quizId : number, name: string}[]
}

interface quizInfoReturn{
  quizId: number,
  name: string,
  timeCreated: number
  timeLastEdited: number,
  description: string,
}

interface sessionIdToken {
  sessionId : number
}

interface quizTrashReturn {
  quizzes : [
    {
      quizId: number,
      name: string
    }
  ]
}


export {data, user, quiz, error, quizListReturn, quizInfoReturn, adminUserDetailsReturn, sessionIdToken, quizTrashReturn}

