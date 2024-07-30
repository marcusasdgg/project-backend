interface quiz {
  quizId: number;
  ownerId: number;
  name: string;
  questions: question[];
  description: string;
  timeCreated: number;
  timeLastEdited: number;
  sessions: session[];
  thumbnailUrl?: string;
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
  answersCreated: 0;
  trash: quiz[];
  sessionsCreated: number;
  playersCreated: 0;
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
  answerId: number;
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

enum State {
  LOBBY = 'LOBBY',
  QUESTION_COUNTDOWN = 'QUESTION_COUNTDOWN',
  QUESTION_OPEN = 'QUESTION_OPEN',
  QUESTION_CLOSE = 'QUESTION_CLOSE',
  ANSWER_SHOW = 'ANSWER_SHOW',
  FINAL_RESULTS = 'FINAL_RESULTS',
  END = 'END'
}

enum Action {
  NEXT_QUESTION = 'NEXT_QUESTION',
  SKIP_COUNTDOWN = 'SKIP_COUNTDOWN',
  GO_TO_ANSWER = 'GO_TO_ANSWER',
  GO_TO_FINAL_RESULTS = 'GO_TO_FINAL_RESULTS',
  END = 'END',
  INVALID = 'INVALID'
}

interface session {
  guests: guest[];
  quiz: quiz;
  autoStartNum: number;
  state: State;
  sessionId: number;
  currentQuestionIndex: number;
  countDownCallBack: ReturnType<typeof setTimeout> | null;
  questionCallBack: ReturnType<typeof setTimeout> | null;
  timeAnswerOpened: number[];
}

interface guest {
  name: string;
  score: number;
  id: number;
  answers: guestAnswer[];
  state: State;
  numQuestions: number;
  atQuestion: number;
}

interface guestAnswer {
  questionId: number;
  answerId: number;
  answerTime: number;
}

interface userRanked {
  name: string;
  score: number;
}

interface questionResult {
  questionId: number;
  playersCorrectList: string[];
  averageAnswerTime: number;
  percentCorrect: number;
}

interface quizSessionFinalResult {
  usersRankedByScore: userRanked[];
  questionResults: questionResult[];
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
  State,
  Action,
  session,
  userRanked,
  questionResult,
  quizSessionFinalResult,
  guest,
  guestAnswer
};
