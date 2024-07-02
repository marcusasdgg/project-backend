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
  username: string,
  password: string,
  userId: number,
  email: string,
  numSuccessfulLogins: number,
  numFailedPasswordsSinceLastLogin: number
}
  
interface data {
  users: user[],
  quizzes: quiz[],
  usersCreated: number,
  quizzesCreated: number,
}

interface error {
  error: string,
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

export {data, user, quiz, error, quizListReturn, quizInfoReturn}