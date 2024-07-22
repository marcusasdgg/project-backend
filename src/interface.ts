interface quiz {
  quizId: number;
  ownerId: number;
  name: string;
  questions: question[];
  description: string;
  timeCreated: number;
  timeLastEdited: number;
}

interface user {
  lastName: string;
  firstName: string;
  password: string;
  userId: number;
  email: string;
  numSuccessfulLogins: number;
  numFailedPasswordsSinceLastLogin: number;
  previousPasswords: string[];
  validSessionIds: number[];
}

interface data {
  users: user[];
  quizzes: quiz[];
  questionsCreated: 0;
  usersCreated: number;
  quizzesCreated: number;
  totalLogins: number;
  trash: quiz[];
}

interface question {
  questionId: number;
  question: string;
  duration: number;
  timeLastEdited: number;
  timeCreated: number;
  points: number;
  answers: answer[];
  thumbnailUrl?: string;
}

interface answerBody {
  answer: string;
  correct: boolean;
}

interface answer {
  answer: string;
  correct: boolean;
  colour: string;
}

interface error {
  error: string;
}

interface adminUserDetailsReturn {
  user: {
    userId: number;
    name: string;
    email: string;
    numSuccessfulLogins: number;
    numFailedPasswordsSinceLastLogin: number;
  };
}

interface quizListReturn {
  quizzes: { quizId: number; name: string }[];
}

interface quizInfoReturn {
  quizId: number;
  questions: question[];
  name: string;
  timeCreated: number;
  timeLastEdited: number;
  description: string;
}

interface sessionIdToken {
  sessionId: number;
}

interface QuestionBody {
  question: string;
  duration: number;
  points: number;
  answers: answerBody[];
  thumbnailUrl?: string;
}

interface quizTrashListReturn {
  quizzes: {quizId: number, name: string}[]
}

export {
  data,
  answer,
  answerBody,
  question,
  user,
  quiz,
  error,
  quizListReturn,
  quizInfoReturn,
  adminUserDetailsReturn,
  sessionIdToken,
  quizTrashListReturn,
  QuestionBody,
};
