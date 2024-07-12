import { setData, getData } from './dataStore';
import { user, data, quiz, error, quizListReturn, quizInfoReturn, quizTrashReturn, answer, answerBody, question, QuestionBody } from './interface';
import { sessionIdSearch } from './auth';

/**
 * Searches the database to check if there is a question with the specified id in a quiz.
 * @param {string|number} id The ID of the question to search for.
 * @returns {Object|boolean} Returns the question object if found, otherwise null.
 */
function containsQuestion(quiz: quiz, id: number): question | null {
  return (
    quiz.questions.find((question: question) => question.questionId === id) ||
    null
  );
}

/**
 * Searches the database to check if there is a quiz with the specified id.
 * @param {Object} database The database object containing quiz data.
 * @param {string|number} id The ID of the quiz to search for.
 * @returns {Object|boolean} Returns the quiz object if found, otherwise false.
 */
function containsQuiz(database: data, id: number): quiz | null {
  return database.quizzes.find((quiz: quiz) => quiz.quizId === id) || null;
}
/**
 * Checks if a specific quiz is owned by a user in the database.
 * @param {*} database The database object containing quiz and user data.
 * @param {*} authUserId The ID of the user to check ownership.
 * @param {*} quizId The ID of the quiz to check.
 * @returns {*} Returns true if the user owns the quiz, otherwise false.
 */
function quizOwned(database: data, authUserId: number, quizId: number): boolean | null {
  for (const quiz of database.quizzes) {
    if (quiz.quizId === quizId && quiz.ownerId === authUserId) {
      return true;
    }
  }

  return null;
}

/**
 * This function handles the validation for quiz.ts
 * @param database
 * @param sessionId
 * @param quizId
 * @returns user object and quiz object
 */
function validateUserAndQuiz(database: data, sessionId: number, quizId: number): { quiz: quiz } | error {
  const user = sessionIdSearch(database, sessionId);
  const quiz = containsQuiz(database, quizId);

  if (!quiz && user === null) {
    return { error: 'invalid quizID & invalid Token' };
  }
  if (user === null) {
    return { error: 'invalid Token' };
  }
  if (!quiz) {
    return { error: 'invalid quizID' };
  }

  const authUserId = user.userId;
  if (!quizOwned(database, authUserId, quizId)) {
    return { error: 'quizId is not owned by authUserId.' };
  }

  return { quiz };
}

/**
 * Checks if a quiz name is unique for a given user and quiz in the database.
 * @param {*} database The database object containing quiz data.
 * @param {*} sessionId The ID of the user to check against.
 * @param {*} quizId The ID of the quiz to check against.
 * @param {*} name The name to check for uniqueness.
 * @returns {*} Returns false if the name is not unique, otherwise true.
 */
function isNameUnique(
  database: data,
  sessionId: number,
  quizId: number,
  name: string
): boolean {
  for (const quiz of database.quizzes) {
    if (quiz.name === name) { return false; }
  }
  return true;
}

/**
 * Checks if a question is valid for a given quiz.
 * @param {*} questionBody - The body of the question to validate.
 * @param {*} quiz - The quiz to check against.
 * @returns {*} Returns true if the question is valid, otherwise false.
 */
function isQuestionValid(questionBody: QuestionBody, quiz: quiz): boolean {
  let totalDuration = questionBody.duration;
  let anyAnswerLengthLess = false;
  let anyAnswerDuplicates = false;
  const answerSet = new Set<string>();

  quiz.questions.forEach((question: question) => {
    totalDuration += question.duration;
  });

  questionBody.answers.forEach((answerBody: answerBody) => {
    if (answerSet.has(answerBody.answer)) {
      anyAnswerDuplicates = true;
    } else {
      answerSet.add(answerBody.answer);
    }

    if (answerBody.answer.length > 30 || answerBody.answer.length < 1) {
      anyAnswerLengthLess = true;
    }
  });

  if (questionBody.question.length > 50 || questionBody.question.length < 5) {
    return false;
  } else if (
    questionBody.answers.length > 6 ||
    questionBody.answers.length < 2
  ) {
    return false;
  } else if (questionBody.duration < 0) {
    return false;
  } else if (totalDuration > 180) {
    return false;
  } else if (questionBody.points > 10 || questionBody.points < 1) {
    return false;
  } else if (anyAnswerLengthLess) {
    return false;
  } else if (anyAnswerDuplicates) {
    return false;
  } else if (questionBody.answers.length === 0) {
    return false;
  } else {
    return true;
  }
}

/**
 * Randomly shuffles an array of strings.
 * @param {*} array - The array of strings to shuffle.
 * @returns {*} Returns the shuffled array.
 */
function shuffleArray(array: string[]): string[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

/**
 * Sets colours for a list of answer bodies.
 * @param {*} answerBodies - The list of answer bodies to set colours for.
 * @returns {*} Returns the list of answers with colours set.
 */
function setColours(answerBodies: answerBody[]): answer[] {
  let colours = ['red', 'blue', 'green', 'yellow', 'purple', 'violet'];
  colours = shuffleArray(colours);
  const answers: answer[] = [];

  for (let i = 0; i < answerBodies.length; i++) {
    const answer: answer = {
      answer: answerBodies[i].answer,
      correct: answerBodies[i].correct,
      colour: colours[i],
    };

    answers.push(answer);
  }
  return answers;
}

/**
 * Function: Provide a list of all quizzes that are owned by the currently logged in user.
 * @param {token} token
 * @returns object containing quizId and name
 */
function adminQuizList(token: number): quizListReturn | error {
  const database = getData();
  const user = sessionIdSearch(database, token);

  if (!user || typeof user === 'boolean') {
    return { error: 'invalid Token' };
  }

  const quizzes = database.quizzes
    .filter((quiz: quiz) => quiz.ownerId === (user as user).userId)
    .map((quiz: quiz) => ({
      quizId: quiz.quizId,
      name: quiz.name,
    }));

  return { quizzes };
}

/**
 * Function: Given basic details about a new quiz, create one for the logged in user.
 * @param {token} token
 * @param {name} name
 * @param {description} description
 * @returns object containing quizId of user
 */
function adminQuizCreate(token: number, name: string, description: string): { quizId: number } | error {
  const database: data = getData();
  const user = sessionIdSearch(database, token);

  if (!user || typeof user === 'boolean') {
    return { error: 'invalid Token' };
  }

  if (!Object.prototype.hasOwnProperty.call(database, 'quizzesCreated')) {
    database.quizzesCreated = 0;
  }

  if (!/^[a-zA-Z0-9 ]+$/.test(name)) {
    return { error: 'Name contains invalid characters' };
  }

  if (name.length < 3 || name.length > 30) {
    return {
      error: 'Name is either less than 3 characters long or more than 30 characters long',
    };
  }

  if (description.length > 100) {
    return { error: 'Description is more than 100 characters in length' };
  }

  const quizExists = database.quizzes.find(
    (quiz: quiz) => quiz.ownerId === (user as user).userId && quiz.name === name
  );
  if (quizExists) {
    return {
      error: 'Name is already used by the current logged in user for another quiz',
    };
  }

  const quizId = database.quizzesCreated + 1;
  database.quizzesCreated += 1;

  const questions: question[] = [];
  const newQuiz = {
    quizId: quizId,
    ownerId: (user as user).userId,
    name: name,
    questions: questions,
    description: description,
    timeCreated: Date.now(),
    timeLastEdited: Date.now(),
  };

  database.quizzes.push(newQuiz);
  setData(database);

  return { quizId };
}

/**
 * This function removes a quiz using userId.
 * @param sessionId
 * @param quizId
 * @returns an empty object
 */
function adminQuizRemove(sessionId : number, quizId: number): object | error {
  const database = getData();

  // validates user and quiz existence
  const validationResult = validateUserAndQuiz(database, sessionId, quizId);
  if ('error' in validationResult) {
    return validationResult;
  }
  const { quiz } = validationResult;

  // move quiz to trash
  quiz.timeLastEdited = Date.now();
  database.trash.push(quiz);
  database.quizzes = database.quizzes.filter((q: quiz) => q.quizId !== quizId);
  setData(database);

  return {};
}

/**
 * This function stores quiz info.
 * @param sessionId
 * @param quizId
 * @returns returns a object containing info about the quiz in question.
 */
function adminQuizInfo(sessionId : number, quizId: number): quizInfoReturn | error {
  const database: data = getData();

  // validates user and quiz existence
  const validationResult = validateUserAndQuiz(database, sessionId, quizId);
  if ('error' in validationResult) {
    return validationResult;
  }
  const { quiz } = validationResult;

  return {
    quizId: quiz.quizId,
    name: quiz.name,
    questions: quiz.questions,
    timeCreated: quiz.timeCreated,
    timeLastEdited: quiz.timeLastEdited,
    description: quiz.description,
  };
}

/**
 * Update the name of the relevant quiz.
 * @param {*} authUserId id of the user who owns the quiz
 * @param {*} quizId if of the quiz to have it's name changed
 * @param {*} name new name of the quiz
 * @returns {{}} empty object
 */
function adminQuizNameUpdate(
  sessionId: number,
  quizId: number,
  name: string
): object | error {
  const data = getData();

  const regex = /^[a-zA-Z0-9 ]{3,30}$/;
  const user = sessionIdSearch(data, sessionId);

  if (user === null) {
    return { error: 'invalid Token' };
  }

  const authUserId = user.userId;

  if (!containsQuiz(data, quizId)) {
    return { error: 'provided quizId is not a real quiz.' };
  }

  if (!quizOwned(data, authUserId, quizId)) {
    return { error: 'User does not own quiz' };
  }

  if (!regex.test(name)) {
    return { error: 'name is invalid.' };
  }

  if (!isNameUnique(data, authUserId, quizId, name)) {
    return { error: 'name is being used for another quiz.' };
  }

  const quiz: quiz = data.quizzes.find(
    (element: quiz) => element.quizId === quizId
  );

  quiz.name = name;
  quiz.timeLastEdited = Date.now();

  setData(data);
  return {};
}

/**
 * Update the description of the relevant quiz.
 * @param {*} authUserId id of the user who owns the quiz
 * @param {*} quizId id of the quiz to have it's description updated
 * @param {*} description new description of the quiz
 * @returns {{}} empty object
 */
function adminQuizDescriptionUpdate(
  sessionId: number,
  quizId: number,
  description: string
): object | error {
  const data = getData();

  const regex = /^.{0,100}$/;

  const user = sessionIdSearch(data, sessionId);

  if (user === null) {
    return { error: 'invalid Token' };
  }

  const authUserId = user.userId;

  if (!containsQuiz(data, quizId)) {
    return { error: 'provided quizId is not a real quiz.' };
  }

  if (!quizOwned(data, authUserId, quizId)) {
    return { error: 'User does not own quiz' };
  }

  if (!regex.test(description)) {
    return { error: 'description is invalid.' };
  }

  const quiz: quiz = data.quizzes.find(
    (element: quiz) => element.quizId === quizId
  );

  quiz.description = description;
  quiz.timeLastEdited = Date.now();

  setData(data);
  return {};
}

function adminQuizTrash(sessionId : number): error | quizTrashReturn {
  return {
    quizzes: [
      {
        quizId: 5546,
        name: 'My Quiz Name'
      }
    ]
  };
}

/**
 * Restore a quiz from the trash back to the active quizzes list.
 * @param sessionId The session ID of the admin user.
 * @param quizId The ID of the quiz to be restored.
 * @returns An empty object or an error object.
 */
function adminQuizRestore(sessionId: number, quizId: number): object | error {
  const database = getData();
  const currentUser = sessionIdSearch(database, sessionId);
  if (currentUser === null) {
    return { error: 'invalid Token' };
  }
  const quizToRestore = database.trash.find((quiz: quiz) => quiz.quizId === quizId);
  if (!quizToRestore) {
    return { error: 'Quiz does not exist' };
  }
  if (quizToRestore.ownerId !== currentUser.userId) {
    return { error: 'Quiz is not owned by the current user' };
  }

  const quiz = containsQuiz(database, quizId);
  if (quiz !== null) {
    return { error: 'Quiz ID refers to a quiz that is not currently in the trash' };
  }
  if (isNameUnique(database, sessionId, quizId, quizToRestore.name) === false) {
    return { error: 'Quiz name is already being used by another active quiz' };
  }
  // all checks done time to restore from trash
  database.trash = database.trash.filter((quiz: quiz) => quiz.quizId !== quizId);
  database.quizzes.push(quizToRestore);
  quizToRestore.timeLastEdited = Date.now();

  setData(database);
  return {};
}

/**
 * Transfer the ownership of a quiz from one user to another.
 * @param sessionId The session ID of the admin user.
 * @param quizId The ID of the quiz to be transferred.
 * @param newOwnerId The user ID of the new owner.
 * @returns An empty object or an error object.
 */
function adminQuizTransfer(sessionId: number, quizId: number, email: string): object | error {
  const database = getData();
  const currentUser = sessionIdSearch(database, sessionId);
  if (currentUser === null) {
    return { error: 'invalid Token' };
  }
  const recipientUser = database.users.find((user) => user.email === email);
  if (!recipientUser) {
    return { error: 'Recipient user not found' };
  }
  const quizToTransfer = database.quizzes.find((quiz: quiz) => quiz.quizId === quizId);
  if (!quizToTransfer) {
    return { error: 'quizID does not exist' };
  }
  if (quizToTransfer.ownerId !== currentUser.userId) {
    return { error: 'Quiz is not owned by current user' };
  }
  // check if recipient has quiz with the same name
  const existingQuizWithSameName = database.quizzes.find(
    (quiz: quiz) => quiz.ownerId === recipientUser.userId && quiz.name === quizToTransfer.name
  );
  if (existingQuizWithSameName) {
    return { error: 'Recipient already owns a quiz with the same name' };
  }
  quizToTransfer.ownerId = recipientUser.userId;
  quizToTransfer.timeLastEdited = Date.now();

  setData(database);

  return {};
}

export function adminQuizAddQuestion(
  sessionId: number,
  quizId: number,
  questionBody: QuestionBody
): { questionId: number } | error {
  const data = getData();

  const user = sessionIdSearch(data, sessionId);

  if (user === null) {
    return { error: 'invalid Token' };
  }

  const authUserId = user.userId;

  if (!containsQuiz(data, quizId) || !quizOwned(data, authUserId, quizId)) {
    return { error: 'User does not own quiz' };
  }

  const quiz: quiz = data.quizzes.find(
    (element: quiz) => element.quizId === quizId
  );

  if (!isQuestionValid(questionBody, quiz)) {
    return { error: 'The question is invalid' };
  }

  const answers = setColours(questionBody.answers);

  const question = {
    questionId: data.questionsCreated,
    question: questionBody.question,
    duration: questionBody.duration,
    points: questionBody.points,
    timeLastEdited: Date.now(),
    timeCreated: Date.now(),
    answers: answers,
  };

  data.questionsCreated++;
  quiz.questions.push(question);
  quiz.timeLastEdited = Date.now();

  setData(data);
  return { questionId: question.questionId };
}

export function adminQuizDuplicateQuestion(
  sessionId: number,
  quizId: number,
  questionId: number
): { questionId: number } | error {
  const data = getData();

  const user = sessionIdSearch(data, sessionId);

  if (user === null) {
    return { error: 'invalid Token' };
  }

  const authUserId = user.userId;

  if (!containsQuiz(data, quizId) || !quizOwned(data, authUserId, quizId)) {
    return { error: 'User does not own quiz' };
  }

  const quiz: quiz = data.quizzes.find(
    (element: quiz) => element.quizId === quizId
  );

  const question = containsQuestion(quiz, questionId);

  if (question == null) {
    return { error: 'Question does not exist in quiz' };
  }

  const newQuestion = {
    questionId: data.questionsCreated,
    question: question.question,
    duration: question.duration,
    points: question.points,
    timeLastEdited: question.timeLastEdited,
    timeCreated: question.timeCreated,
    answers: question.answers,
  };

  data.questionsCreated++;
  quiz.questions.push(newQuestion);
  quiz.timeLastEdited = Date.now();

  setData(data);
  return { questionId: newQuestion.questionId };
}

function ifUserOwnsTrash(database : data, userId: number, quizId: number) : boolean {
  let quiz = database.trash.find(q => q.quizId === quizId);
  return quiz.ownerId === userId; 
}

function quizExistsinTrash(database: data, quizId: number): boolean {
  let quiz = database.trash.find(q => q.quizId === quizId) || false;
  if (quiz !== false) {
    quiz = true;
  }
  return quiz;
}

/**
 * Permanently delete specific quizzes currently sitting in the trash.
 * @param token The session ID of the user.
 * @param quizIds An array of quiz IDs to be deleted.
 * @returns An empty object or an error object.
 */

export function adminQuizTrashEmpty(token: number, quizIds: number[]): object | error {
  const database = getData();
  const user = sessionIdSearch(database, token);


  if (!user || typeof user === 'boolean') {
    return { error: 'invalid Token' };
  }

  for (const quizId of quizIds) {
    const quizNotTrash = containsQuiz(database, quizId);
    if (quizNotTrash) {
      return { error: 'One or more quiz IDs is not currently in the trash' };
    }

    const quizToTrash = database.trash.find((quiz: quiz) => quiz.quizId === quizId);
    if (!quizToTrash) {
      return { error: 'Quiz ID doesnt exist' };
    }
    if(quizToTrash.ownerId !== user.userId) {
      return {error: 'quiz ID is not owned by user'}
    }
    database.trash = database.trash.filter((q: quiz) => q.quizId !== quizId);
  }

  setData(database);
  return {};
}

/**
 * Move a question from one particular position in the quiz to another.
 * @param token The session ID of the user.
 * @param quizId The ID of the quiz containing the question.
 * @param questionId The ID of the question to move.
 * @param newPosition The new position for the question.
 * @returns An empty object or an error object.
 */

export function adminQuizQuestionMove(token: number, quizId: number, questionId: number, newPosition: number): object | error {
  const database = getData();
  const user = sessionIdSearch(database, token);

  if (!user || typeof user === 'boolean') {
    return { error: 'invalid Token' };
  }

  const quiz = containsQuiz(database, quizId);
  if (!quiz) {
    return { error: 'Quiz ID does not refer to a valid quiz' };
  }

  if (quiz.ownerId !== (user as user).userId) {
    return { error: 'Quiz is not owned by the current user' };
  }

  const questionIndex = quiz.questions.findIndex((q: question) => q.questionId === questionId);
  if (questionIndex === -1) {
    return { error: 'Question ID does not refer to a valid question within this quiz' };
  }

  if (newPosition < 0 || newPosition >= quiz.questions.length) {
    return { error: 'New position is out of range' };
  }

  const [movedQuestion] = quiz.questions.splice(questionIndex, 1);
  quiz.questions.splice(newPosition, 0, movedQuestion);
  quiz.timeLastEdited = Date.now();

  setData(database);
  return {};
}

/**
 * 
 * @param quizId quizId of quiz you want the question to be deleted from.
 * @param questionId questionId of the question inthe quiz
 * @param token SessionId of user.
 * @returns error or nothing depending on success.
 */
function adminQuizQuestionDelete(quizId: number, questionId: number, token: number): object | error {
  const database = getData();
  const user = sessionIdSearch(database, token);

  if (!user || typeof user === 'boolean') {
    return { error: 'invalid Token' };
  }

  const quiz = containsQuiz(database, quizId);
  if (!quiz) {
    return { error: 'Quiz ID does not refer to a valid quiz' };
  }

  if (quiz.ownerId !== (user as user).userId) {
    return { error: 'Quiz is not owned by the current user' };
  }

  const question = containsQuestion(quiz, questionId);

  if (!question) {
    return { error: 'Question Id does not refer to a valid question within this quiz' };
  }

  quiz.questions = quiz.questions.filter((q: question) => q.questionId !== questionId);

  setData(database);

  return {};
}

/**
 * 
 * @param quizId quizId of quiz you want the question to be deleted from.
 * @param questionId questionId of the question inthe quiz
 * @param token SessionId of user.
 * @param questionBody body of the question you want to create.
 * @returns error or nothing depending on success.
 */
function adminQuizQuestionUpdate(quizId: number, questionId: number, token: number, questionBody: QuestionBody) : object | error {
  const database = getData();
  const user = sessionIdSearch(database, token);

  if (!user || typeof user === 'boolean') {
    return { error: 'invalid Token' };
  }

  const quiz = containsQuiz(database, quizId);
  if (!quiz) {
    return { error: 'Quiz ID does not refer to a valid quiz' };
  }

  if (quiz.ownerId !== (user as user).userId) {
    return { error: 'Quiz is not owned by the current user' };
  }

  const question = containsQuestion(quiz, questionId);

  if (!question) {
    return { error: 'Question Id does not refer to a valid question within this quiz' };
  }

  if (questionBody.question.length < 5 || questionBody.question.length > 51) {
    return { error: 'Question string is less than 5 characters in length or greater than 50 characters in length' };
  }

  if (questionBody.answers.length < 2 || questionBody.answers.length > 6) {
    return { error: 'The question has more than 6 answers or less than 2 answers' };
  }

  if (questionBody.duration < 1) {
    return { error: 'The question duration is not a positive number' };
  }

  const duration : number = quiz.questions.reduce((acc: number, q: question) => {
    return (acc += q.duration);
  }, 0);

  if (duration + questionBody.duration > 180) {
    return { error: 'If this question were to be updated, the sum of the question durations in the quiz exceeds 3 minutes' };
  }

  if (questionBody.points > 10 || questionBody.points < 1) {
    return { error: 'The points awarded for the question are less than 1 or greater than 10' };
  }

  const count = new Map();
  for (const answer of questionBody.answers) {
    if (answer.answer.length > 30 || answer.answer.length < 1) {
      return { error: 'The length of any answer is shorter than 1 character long, or longer than 30 characters long' };
    }
    count.set(answer.answer, (count.get(answer.answer) || 0) + 1);
  }

  for (const [, num] of count.entries()) {
    if (num > 1) {
      return { error: 'Any answer strings are duplicates of one another (within the same question)' };
    }
  }

  const numfalses : number = questionBody.answers.reduce((acc : number, answer : answer) => {
    if (answer.correct === false) {
      return acc + 1;
    } else {
      return acc;
    }
  }, 0);

  if (numfalses === questionBody.answers.length) {
    return { error: 'There are no correct answers' };
  }

  question.duration = questionBody.duration;
  question.answers = setColours(questionBody.answers);
  question.points = questionBody.points;
  question.question = questionBody.question;
  question.timeLastEdited = Date.now();

  setData(database);

  return {};
}

export {
  adminQuizCreate,
  adminQuizList,
  adminQuizDescriptionUpdate,
  adminQuizInfo,
  adminQuizRemove,
  adminQuizNameUpdate,
  adminQuizTrash,
  adminQuizRestore,
  adminQuizTransfer,
  adminQuizQuestionDelete,
  adminQuizQuestionUpdate,
};
