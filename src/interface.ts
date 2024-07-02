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

interface adminUserDetailsReturn {
  user: {
    userId: number,
    name: string,
    email: string,
    numSuccessfulLogins: number,
    numFailedPasswordsSinceLastLogin: number 
  }
}



export {data, user, quiz, error, adminUserDetailsReturn}