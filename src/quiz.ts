import { setData, getData } from './dataStore';
import { user, data, quiz, error, quizListReturn, quizInfoReturn, quizTrashListReturn, answer, answerBody, question, QuestionBody, session, State, quizSessionFinalResult, guest, Action } from './interface';
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
 * @param {*} data The database object containing quiz data.
 * @param {*} name The quiz name to check for uniqueness.
 * @returns {*} Returns false if the name is not unique, otherwise true.
 */
function isNameUnique(data: data, name: string): boolean {
  return !data.quizzes.some((quiz: quiz) => quiz.name === name);
}

/**
 * Checks if a guest name is unique within a session.
 * @param {*} session The session containing guests.
 * @param {*} name The guest name to check for uniqueness.
 * @returns {*} Returns false if the name is not unique, otherwise true.
 */
function isGuestNameUnique(session: session, name: string): boolean {
  return !session.guests.some((guest: guest) => guest.name === name);
}

/**
 * Searches for a session by sessionId within the quizzes in the database.
 * @param {*} data The database object containing quiz data.
 * @param {*} sessionId The ID of the session to search for.
 * @returns {*} Returns the session if found, otherwise null.
 */
function quizSessionIdSearch(data: data, sessionId: number): session | null {
  for (const quiz of data.quizzes) {
    const session = quiz.sessions.find(session => session.sessionId === sessionId);
    if (session) {
      return session;
    }
  }

  return null;
}

/**
 * Checks if a question is valid for a given quiz.
 * @param {*} questionBody The body of the question to validate.
 * @param {*} quiz The quiz to check against.
 * @returns {*} Returns true if the question is valid, otherwise false.
 */
function isQuestionValid(questionBody: QuestionBody, quiz: quiz): boolean {
  let totalDuration = questionBody.duration;
  let anyAnswerLengthLess = false;
  let anyAnswerDuplicates = false;
  const answerSet = new Set<string>();
  let hasTrue = false;

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

    if (answerBody.correct) {
      hasTrue = true;
    }
  });

  if (questionBody.question.length > 50 || questionBody.question.length < 5) {
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
  } else if (
    questionBody.answers.length > 6 ||
    questionBody.answers.length < 2
  ) {
    return false;
  } else if (!hasTrue) {
    return false;
  } else if (questionBody.thumbnailUrl !== undefined) {
    if (questionBody.thumbnailUrl.length === 0) {
      return false;
    } else if (
      !(
        questionBody.thumbnailUrl.toLowerCase().endsWith('jpg') ||
        questionBody.thumbnailUrl.toLowerCase().endsWith('jpeg') ||
        questionBody.thumbnailUrl.toLowerCase().endsWith('png')
      )
    ) {
      return false;
    } else if (
      !(
        questionBody.thumbnailUrl.toLowerCase().startsWith('http://') ||
        questionBody.thumbnailUrl.toLowerCase().startsWith('https://')
      )
    ) {
      return false;
    } else {
      return true;
    }
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
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

/**
 * Sets colours for a list of answer bodies.
 * @param {*} data The object containing the database of the API.
 * @param {*} answerBodies The list of answer bodies to set colours for.
 * @returns {*} Returns the list of answers with colours set.
 */
function setColours(data: data, answerBodies: answerBody[]): answer[] {
  let colours = ['red', 'blue', 'green', 'yellow', 'purple', 'violet'];
  colours = shuffleArray(colours);

  return answerBodies.map((body, index) => {
    const answer: answer = {
      answer: body.answer,
      correct: body.correct,
      colour: colours[index],
      answerId: data.answersCreated,
    };

    data.answersCreated++;
    return answer;
  });
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
      error:
        'Name is either less than 3 characters long or more than 30 characters long',
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
  const sessions: session[] = [];
  const newQuiz = {
    quizId: quizId,
    ownerId: (user as user).userId,
    name: name,
    questions: questions,
    description: description,
    timeCreated: Date.now(),
    timeLastEdited: Date.now(),
    sessions: sessions,
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
function adminQuizInfo(
  sessionId: number,
  quizId: number
): quizInfoReturn | error {
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
 * @param {*} sessionId id of the user who owns the quiz
 * @param {*} quizId if of the quiz to have it's name changed
 * @param {*} name new name of the quiz
 * @returns {*} An empty object if successful.
 * @throws {Error} If the name can not be updated.
 */
function adminQuizNameUpdate(
  sessionId: number,
  quizId: number,
  name: string
): object {
  const data = getData();

  const regex = /^[a-zA-Z0-9 ]{3,30}$/;
  const user = sessionIdSearch(data, sessionId);

  if (user === null) {
    throw new Error('invalid Token');
  }

  const authUserId = user.userId;

  if (!containsQuiz(data, quizId)) {
    throw new Error('provided quizId is not a real quiz.');
  }

  if (!quizOwned(data, authUserId, quizId)) {
    throw new Error('User does not own quiz');
  }

  if (!regex.test(name)) {
    throw new Error('name is invalid.');
  }

  if (!isNameUnique(data, name)) {
    throw new Error('name is being used for another quiz.');
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
 * @param {*} sessionId id of the user who owns the quiz
 * @param {*} quizId id of the quiz to have it's description updated
 * @param {*} description new description of the quiz
 * @returns {*} An empty object if successful.
 * @throws {Error} If the description can not be updated.
 */
function adminQuizDescriptionUpdate(
  sessionId: number,
  quizId: number,
  description: string
): object {
  const data = getData();

  const regex = /^.{0,100}$/;

  const user = sessionIdSearch(data, sessionId);

  if (user === null) {
    throw new Error('invalid Token');
  }

  const authUserId = user.userId;

  if (!containsQuiz(data, quizId)) {
    throw new Error('provided quizId is not a real quiz.');
  }

  if (!quizOwned(data, authUserId, quizId)) {
    throw new Error('User does not own quiz');
  }

  if (!regex.test(description)) {
    throw new Error('description is invalid.');
  }

  const quiz: quiz = data.quizzes.find(
    (element: quiz) => element.quizId === quizId
  );

  quiz.description = description;
  quiz.timeLastEdited = Date.now();

  setData(data);
  return {};
}

/**
 * this function allows users to see their trashes quizzes
 * @param sessionId
 * @returns a user's trashes quizzes array
 */
function adminQuizTrashList(sessionId: number): error | quizTrashListReturn {
  const data = getData();

  // validity check
  const user = sessionIdSearch(data, sessionId);
  if (!user || typeof user === 'boolean') {
    return { error: 'invalid Token' };
  }

  // filters for only trashed user quizzes in the trash user array
  // maps a new array with specific properties
  const quizzes = data.trash
    .filter((q: quiz) => user.userId === q.ownerId)
    .map((q: quiz) => ({ quizId: q.quizId, name: q.name }));

  return {
    quizzes,
  };
}

/**
 * Restore a quiz from the trash back to the active quizzes list.
 * @param sessionId The session ID of the admin user.
 * @param quizId The ID of the quiz to be restored.
 * @returns An empty object or an error object.
 */
function adminQuizRestore(sessionId: number, quizId: number): object {
  const database = getData();
  const currentUser = sessionIdSearch(database, sessionId);
  if (currentUser === null) {
    throw new Error('invalid Token');
  }
  const quizToRestore = database.trash.find(
    (quiz: quiz) => quiz.quizId === quizId
  );
  if (!quizToRestore) {
    throw new Error('Quiz does not exist');
  }
  if (quizToRestore.ownerId !== currentUser.userId) {
    throw new Error('Quiz is not owned by the current user');
  }

  const quiz = containsQuiz(database, quizId);
  if (quiz !== null) {
    throw new Error('Quiz ID refers to a quiz that is not currently in the trash');
  }
  if (isNameUnique(database, quizToRestore.name) === false) {
    throw new Error('Quiz name is already being used by another active quiz');
  }
  // all checks done time to restore from trash
  database.trash = database.trash.filter(
    (quiz: quiz) => quiz.quizId !== quizId
  );
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
function adminQuizTransfer(sessionId: number, quizId: number, email: string): object {
  const database = getData();
  const currentUser = sessionIdSearch(database, sessionId);
  if (currentUser === null) {
    throw new Error('invalid Token');
  }
  const recipientUser = database.users.find((user) => user.email === email);
  if (!recipientUser) {
    throw new Error('Recipient user not found');
  }
  const quizToTransfer = database.quizzes.find(
    (quiz: quiz) => quiz.quizId === quizId
  );
  if (!quizToTransfer) {
    throw new Error('quizID does not exist');
  }
  if (quizToTransfer.ownerId !== currentUser.userId) {
    throw new Error('Quiz is not owned by current user');
  }
  // check if recipient has quiz with the same name
  const existingQuizWithSameName = database.quizzes.find(
    (quiz: quiz) =>
      quiz.ownerId === recipientUser.userId && quiz.name === quizToTransfer.name
  );
  if (existingQuizWithSameName) {
    throw new Error('Recipient already owns a quiz with the same name');
  }
  quizToTransfer.ownerId = recipientUser.userId;
  quizToTransfer.timeLastEdited = Date.now();

  setData(database);

  return {};
}

/**
 * Adds a new question to a specified quiz.
 * @param {*} sessionId The ID of the admin session making the request
 * @param {*} quizId The ID of the quiz to which the question will be added
 * @param {*} questionBody An object containing the details of the question to be added
 * @returns {*} An object with the ID of the newly added question if successful.
 * @throws {Error} If the quiz question can not be added.
 */
export function adminQuizAddQuestion(
  sessionId: number,
  quizId: number,
  questionBody: QuestionBody
): { questionId: number } {
  const data = getData();

  const user = sessionIdSearch(data, sessionId);

  if (user === null) {
    throw new Error('invalid Token');
  }

  const authUserId = user.userId;

  if (!containsQuiz(data, quizId) || !quizOwned(data, authUserId, quizId)) {
    throw new Error('User does not own quiz');
  }

  const quiz: quiz = data.quizzes.find(
    (element: quiz) => element.quizId === quizId
  );

  if (!isQuestionValid(questionBody, quiz)) {
    throw new Error('The question is invalid');
  }

  const answers = setColours(data, questionBody.answers);

  const question = {
    questionId: data.questionsCreated,
    question: questionBody.question,
    duration: questionBody.duration,
    points: questionBody.points,
    timeLastEdited: Date.now(),
    timeCreated: Date.now(),
    answers: answers,
    thumbnail: questionBody.thumbnailUrl,
  };

  data.questionsCreated++;
  quiz.questions.push(question);
  quiz.timeLastEdited = Date.now();

  setData(data);

  return { questionId: question.questionId };
}

/**
 * Duplicates a question within a specified quiz for an admin session.
 * @param {*} sessionId The ID of the admin session making the request.
 * @param {*} quizId The ID of the quiz containing the question to be duplicated.
 * @param {*} questionId The ID of the question to be duplicated.
 * @returns {*} An object containing the ID of the newly duplicated question if successful.
 * @throws {Error} If the quiz question can not be duplicated.
 */
export function adminQuizDuplicateQuestion(
  sessionId: number,
  quizId: number,
  questionId: number
): { questionId: number } {
  const data = getData();

  const user = sessionIdSearch(data, sessionId);

  if (user === null) {
    throw new Error('invalid Token');
  }

  const authUserId = user.userId;

  if (!containsQuiz(data, quizId) || !quizOwned(data, authUserId, quizId)) {
    throw new Error('User does not own quiz');
  }

  const quiz: quiz = data.quizzes.find(
    (element: quiz) => element.quizId === quizId
  );

  const question = containsQuestion(quiz, questionId);

  if (question == null) {
    throw new Error('Question does not exist in quiz');
  }

  const newQuestion = {
    questionId: data.questionsCreated,
    question: question.question,
    duration: question.duration,
    points: question.points,
    timeLastEdited: question.timeLastEdited,
    timeCreated: question.timeCreated,
    answers: question.answers,
    thumbnail: question.thumbnailUrl,
  };

  data.questionsCreated++;
  quiz.questions.push(newQuestion);
  quiz.timeLastEdited = Date.now();

  setData(data);

  return { questionId: newQuestion.questionId };
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
    if (quizToTrash.ownerId !== user.userId) {
      return { error: 'quiz ID is not owned by user' };
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
function adminQuizQuestionUpdate(quizId: number, questionId: number, token: number, questionBody: QuestionBody, thumbnailUrl?: string) : object | error {
  const database = getData();
  const user = sessionIdSearch(database, token);

  if (!user || typeof user === 'boolean') {
    throw new Error('invalid Token');
  }

  const quiz = containsQuiz(database, quizId);
  if (!quiz) {
    throw new Error('Quiz ID does not refer to a valid quiz');
  }

  if (quiz.ownerId !== (user as user).userId) {
    throw new Error('Quiz is not owned by the current user');
  }

  const question = containsQuestion(quiz, questionId);

  if (!question) {
    throw new Error('Question Id does not refer to a valid question within this quiz');
  }

  if (questionBody.question.length < 5 || questionBody.question.length > 51) {
    throw new Error('Question string is less than 5 characters in length or greater than 50 characters in length');
  }

  if (questionBody.answers.length < 2 || questionBody.answers.length > 6) {
    throw new Error('The question has more than 6 answers or less than 2 answers');
  }

  if (questionBody.duration < 1) {
    throw new Error('The question duration is not a positive number');
  }

  const duration : number = quiz.questions.reduce((acc: number, q: question) => {
    return (acc += q.duration);
  }, 0);

  if (duration + questionBody.duration > 180) {
    throw new Error('If this question were to be updated, the sum of the question durations in the quiz exceeds 3 minutes');
  }

  if (questionBody.points > 10 || questionBody.points < 1) {
    throw new Error('The points awarded for the question are less than 1 or greater than 10');
  }

  const count = new Map();
  for (const answer of questionBody.answers) {
    if (answer.answer.length > 30 || answer.answer.length < 1) {
      throw new Error('The length of any answer is shorter than 1 character long, or longer than 30 characters long');
    }
    count.set(answer.answer, (count.get(answer.answer) || 0) + 1);
  }

  for (const [, num] of count.entries()) {
    if (num > 1) {
      throw new Error('Any answer strings are duplicates of one another (within the same question)');
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
    throw new Error('There are no correct answers');
  }

  if (thumbnailUrl !== undefined) {
    if (thumbnailUrl === '') {
      throw new Error('The thumbnailUrl is an empty string');
    }
    if (!(thumbnailUrl.toLowerCase().endsWith('.jpg') || thumbnailUrl.toLowerCase().endsWith('.jpeg') || thumbnailUrl.toLowerCase().endsWith('.png'))) {
      throw new Error('The thumbnailUrl does not end with one of the following filetypes (case insensitive): jpg, jpeg, png');
    }
    if (!(thumbnailUrl.startsWith('https://') || thumbnailUrl.toLowerCase().startsWith('http://'))) {
      throw new Error('The thumbnailUrl does not begin with http:// or https://');
    }

    question.thumbnailUrl = thumbnailUrl;
  }

  question.duration = questionBody.duration;
  question.answers = setColours(database, questionBody.answers);
  question.points = questionBody.points;
  question.question = questionBody.question;
  question.timeLastEdited = Date.now();

  setData(database);

  return {};
}

function adminQuizSessionStart(token: number, quizId: number, autoStartNum: number): number {
  const database = getData();
  const user = sessionIdSearch(database, token);
  if (!user || typeof user === 'boolean') {
    throw new Error('Token is empty or invalid (does not refer to valid logged in user session)');
  }

  let quiz = containsQuiz(database, quizId);
  if (quiz === null) {
    quiz = database.trash.find(element => element.quizId === quizId);
    if (quiz !== undefined) {
      throw new Error('The quiz is in trash');
    }
    throw new Error('Valid token is provided, but user is not an owner of this quiz or quiz doesn\'t exist');
  }

  if (quiz.ownerId !== user.userId) {
    throw new Error('Valid token is provided, but user is not an owner of this quiz or quiz doesn\'t exist');
  }

  if (autoStartNum > 50) {
    throw new Error('autoStartNum is a number greater than 50');
  }

  const numBadQuiz = quiz.sessions.reduce((acc, cur) => {
    if (cur.state !== State.END) {
      return acc + 1;
    } else {
      return acc;
    }
  }, 0);

  if (numBadQuiz > 10) {
    throw new Error('10 sessions that are not in END state currently exist for this quiz');
  }

  if (quiz.questions.length === 0) {
    throw new Error('The quiz does not have any questions in it');
  }
  const sessionId = database.sessionsCreated;
  const newSession: session = {
    state: State.LOBBY,
    guests: [],
    quiz: JSON.parse(JSON.stringify({ questions: quiz.questions })),
    autoStartNum: autoStartNum,
    sessionId: sessionId,
    currentQuestionIndex: -1,
    countDownCallBack: null,
    questionCallBack: null,
    timeAnswerOpened: []
  };
  database.sessionsCreated += 1;
  quiz.sessions.push(newSession);
  setData(database);
  return sessionId;
}

function adminQuizSessionUpdate(quizId: number, sessionId: number, token: number, action: string) {
  const database = getData();
  const user = sessionIdSearch(database, token);
  if (!user || typeof user === 'boolean') {
    throw new Error('Token is empty or invalid (does not refer to valid logged in user session)');
  }

  let quiz = containsQuiz(database, quizId);
  if (quiz === null) {
    quiz = database.trash.find(element => element.quizId === quizId);
    if (quiz !== undefined) {
      throw new Error('The quiz is in trash');
    }
    throw new Error('Valid token is provided, but user is not an owner of this quiz or quiz doesn\'t exist');
  }

  if (quiz.ownerId !== user.userId) {
    throw new Error('Valid token is provided, but user is not an owner of this quiz or quiz doesn\'t exist');
  }

  const foundSession = quiz.sessions.find(session => session.sessionId === sessionId);

  if (foundSession === undefined) {
    throw new Error('Session Id does not refer to a valid session within this quiz');
  }

  if (!(action === 'NEXT_QUESTION' || action === 'SKIP_COUNTDOWN' || action === 'GO_TO_ANSWER' || action === 'GO_TO_FINAL_RESULTS' || action === 'END')) {
    throw new Error('Action provided is not a valid Action enum');
  }

  /// actual checking.

  switch (foundSession.state) {
    case 'LOBBY':
      switch (action) {
        case 'NEXT_QUESTION':
          foundSession.currentQuestionIndex += 1;
          foundSession.state = State.QUESTION_COUNTDOWN;
          foundSession.countDownCallBack = setTimeout(() => {
            foundSession.state = State.QUESTION_OPEN;
            foundSession.timeAnswerOpened[foundSession.currentQuestionIndex] = Date.now();
            foundSession.countDownCallBack = null;
            const questionDuration = foundSession.quiz.questions[foundSession.currentQuestionIndex].duration * 1000;
            foundSession.questionCallBack = setTimeout(() => {
              foundSession.state = State.QUESTION_CLOSE;
              foundSession.questionCallBack = null;
            }, questionDuration);
          }, 3000);
          return;
        case 'SKIP_COUNTDOWN':
          throw new Error('Action enum cannot be applied in the current state');
        case 'GO_TO_ANSWER':
          throw new Error('Action enum cannot be applied in the current state');
        case 'GO_TO_FINAL_RESULTS':
          throw new Error('Action enum cannot be applied in the current state');
        case 'END':
          foundSession.state = State.END;
          clearTimeout(foundSession.questionCallBack);
          clearTimeout(foundSession.countDownCallBack);
          foundSession.countDownCallBack = null;
          foundSession.questionCallBack = null;
      }
      break;

    case 'QUESTION_COUNTDOWN':
      switch (action) {
        case 'NEXT_QUESTION':
          throw new Error('Action enum cannot be applied in the current state');

        case 'SKIP_COUNTDOWN':
          clearTimeout(foundSession.countDownCallBack);
          foundSession.state = State.QUESTION_OPEN;
          foundSession.countDownCallBack = null;
          foundSession.timeAnswerOpened[foundSession.currentQuestionIndex] = Date.now();
          foundSession.questionCallBack = setTimeout(() => {
            foundSession.state = State.QUESTION_CLOSE;
            foundSession.questionCallBack = null;
          }, foundSession.quiz.questions[foundSession.currentQuestionIndex].duration * 1000);
          return;

        case 'GO_TO_ANSWER':
          throw new Error('Action enum cannot be applied in the current state');

        case 'GO_TO_FINAL_RESULTS':

          throw new Error('Action enum cannot be applied in the current state');

        case 'END':
          foundSession.state = State.END;
          clearTimeout(foundSession.questionCallBack);
          clearTimeout(foundSession.countDownCallBack);
          foundSession.countDownCallBack = null;
          foundSession.questionCallBack = null;
      }
      break;

    case 'QUESTION_OPEN':
      switch (action) {
        case 'NEXT_QUESTION':
          throw new Error('Action enum cannot be applied in the current state');
        case 'SKIP_COUNTDOWN':
          throw new Error('Action enum cannot be applied in the current state');
        case 'GO_TO_ANSWER':
          foundSession.state = State.ANSWER_SHOW;
          return;
        case 'GO_TO_FINAL_RESULTS':
          throw new Error('Action enum cannot be applied in the current state');
        case 'END':
          foundSession.state = State.END;
          clearTimeout(foundSession.questionCallBack);
          clearTimeout(foundSession.countDownCallBack);
          foundSession.countDownCallBack = null;
          foundSession.questionCallBack = null;
      }
      break;

    case 'QUESTION_CLOSE':
      switch (action) {
        case 'NEXT_QUESTION':
          foundSession.currentQuestionIndex += 1;
          foundSession.state = State.QUESTION_COUNTDOWN;
          foundSession.countDownCallBack = setTimeout(() => {
            foundSession.state = State.QUESTION_OPEN;
            foundSession.timeAnswerOpened[foundSession.currentQuestionIndex] = Date.now();
            foundSession.countDownCallBack = null;
            const questionDuration = foundSession.quiz.questions[foundSession.currentQuestionIndex].duration * 1000;
            foundSession.questionCallBack = setTimeout(() => {
              foundSession.state = State.QUESTION_CLOSE;
              foundSession.questionCallBack = null;
            }, questionDuration);
          }, 3000);
          return;
        case 'SKIP_COUNTDOWN':
          throw new Error('Action enum cannot be applied in the current state');
        case 'GO_TO_ANSWER':
          foundSession.questionCallBack = null;
          foundSession.state = State.ANSWER_SHOW;
          return;
        case 'GO_TO_FINAL_RESULTS':
          foundSession.questionCallBack = null;
          foundSession.state = State.FINAL_RESULTS;
          return;
        case 'END':
          foundSession.state = State.END;
          foundSession.countDownCallBack = null;
          foundSession.questionCallBack = null;
      }
      break;

    case 'ANSWER_SHOW':
      switch (action) {
        case 'NEXT_QUESTION':
          foundSession.currentQuestionIndex += 1;
          foundSession.state = State.QUESTION_COUNTDOWN;
          foundSession.countDownCallBack = setTimeout(() => {
            foundSession.state = State.QUESTION_OPEN;
            foundSession.timeAnswerOpened[foundSession.currentQuestionIndex] = Date.now();
            foundSession.countDownCallBack = null;
            const questionDuration = foundSession.quiz.questions[foundSession.currentQuestionIndex].duration * 1000;
            foundSession.questionCallBack = setTimeout(() => {
              foundSession.state = State.QUESTION_CLOSE;
              foundSession.questionCallBack = null;
            }, questionDuration);
          }, 3000);
          return;
        case 'SKIP_COUNTDOWN':
          throw new Error('Action enum cannot be applied in the current state');
        case 'GO_TO_ANSWER':
          throw new Error('Action enum cannot be applied in the current state');
        case 'GO_TO_FINAL_RESULTS':
          foundSession.countDownCallBack = null;
          foundSession.questionCallBack = null;
          foundSession.state = State.FINAL_RESULTS;
          return;
        case 'END':
          foundSession.state = State.END;
          foundSession.countDownCallBack = null;
          foundSession.questionCallBack = null;
      }
      break;

    case 'FINAL_RESULTS':
      switch (action) {
        case 'NEXT_QUESTION':
          throw new Error('Action enum cannot be applied in the current state');
        case 'SKIP_COUNTDOWN':
          throw new Error('Action enum cannot be applied in the current state');
        case 'GO_TO_ANSWER':
          throw new Error('Action enum cannot be applied in the current state');
        case 'GO_TO_FINAL_RESULTS':
          throw new Error('Action enum cannot be applied in the current state');
        case 'END':
          foundSession.state = State.END;
          foundSession.countDownCallBack = null;
          foundSession.questionCallBack = null;
      }
      break;

    case 'END':
      switch (action) {
        case 'NEXT_QUESTION':
          throw new Error('Action enum cannot be applied in the current state');
        case 'SKIP_COUNTDOWN':
          throw new Error('Action enum cannot be applied in the current state');
        case 'GO_TO_ANSWER':
          throw new Error('Action enum cannot be applied in the current state');
        case 'GO_TO_FINAL_RESULTS':
          throw new Error('Action enum cannot be applied in the current state');
        case 'END':
          throw new Error('Action enum cannot be applied in the current state');
      }
  }
}

function adminQuizSessionUpdateLocal(quiz: quiz, sessionId: number, action: string) {
  const foundSession = quiz.sessions.find(session => session.sessionId === sessionId);

  if (foundSession === undefined) {
    throw new Error('Session Id does not refer to a valid session within this quiz');
  }

  if (!(action === 'NEXT_QUESTION' || action === 'SKIP_COUNTDOWN' || action === 'GO_TO_ANSWER' || action === 'GO_TO_FINAL_RESULTS' || action === 'END')) {
    throw new Error('Action provided is not a valid Action enum');
  }

  /// actual checking.

  switch (foundSession.state) {
    case 'LOBBY':
      switch (action) {
        case 'NEXT_QUESTION':
          foundSession.currentQuestionIndex += 1;
          foundSession.state = State.QUESTION_COUNTDOWN;
          foundSession.countDownCallBack = setTimeout(() => {
            foundSession.state = State.QUESTION_OPEN;
            foundSession.timeAnswerOpened[foundSession.currentQuestionIndex] = Date.now();
            foundSession.countDownCallBack = null;
            const questionDuration = foundSession.quiz.questions[foundSession.currentQuestionIndex].duration * 1000;
            foundSession.questionCallBack = setTimeout(() => {
              foundSession.state = State.QUESTION_CLOSE;
              foundSession.questionCallBack = null;
            }, questionDuration);
          }, 3000);
          return;
        case 'SKIP_COUNTDOWN':
          throw new Error('Action enum cannot be applied in the current state');
        case 'GO_TO_ANSWER':
          throw new Error('Action enum cannot be applied in the current state');
        case 'GO_TO_FINAL_RESULTS':
          throw new Error('Action enum cannot be applied in the current state');
        case 'END':
          foundSession.state = State.END;
          clearTimeout(foundSession.questionCallBack);
          clearTimeout(foundSession.countDownCallBack);
          foundSession.countDownCallBack = null;
          foundSession.questionCallBack = null;
      }
      break;

    case 'QUESTION_COUNTDOWN':
      switch (action) {
        case 'NEXT_QUESTION':
          throw new Error('Action enum cannot be applied in the current state');

        case 'SKIP_COUNTDOWN':
          clearTimeout(foundSession.countDownCallBack);
          foundSession.state = State.QUESTION_OPEN;
          foundSession.countDownCallBack = null;
          foundSession.timeAnswerOpened[foundSession.currentQuestionIndex] = Date.now();
          foundSession.questionCallBack = setTimeout(() => {
            foundSession.state = State.QUESTION_CLOSE;
            foundSession.questionCallBack = null;
          }, foundSession.quiz.questions[foundSession.currentQuestionIndex].duration * 1000);
          return;

        case 'GO_TO_ANSWER':
          throw new Error('Action enum cannot be applied in the current state');

        case 'GO_TO_FINAL_RESULTS':

          throw new Error('Action enum cannot be applied in the current state');

        case 'END':
          foundSession.state = State.END;
          clearTimeout(foundSession.questionCallBack);
          clearTimeout(foundSession.countDownCallBack);
          foundSession.countDownCallBack = null;
          foundSession.questionCallBack = null;
      }
      break;

    case 'QUESTION_OPEN':
      switch (action) {
        case 'NEXT_QUESTION':
          throw new Error('Action enum cannot be applied in the current state');
        case 'SKIP_COUNTDOWN':
          throw new Error('Action enum cannot be applied in the current state');
        case 'GO_TO_ANSWER':
          foundSession.state = State.ANSWER_SHOW;
          return;
        case 'GO_TO_FINAL_RESULTS':
          throw new Error('Action enum cannot be applied in the current state');
        case 'END':
          foundSession.state = State.END;
          clearTimeout(foundSession.questionCallBack);
          clearTimeout(foundSession.countDownCallBack);
          foundSession.countDownCallBack = null;
          foundSession.questionCallBack = null;
      }
      break;

    case 'QUESTION_CLOSE':
      switch (action) {
        case 'NEXT_QUESTION':
          foundSession.currentQuestionIndex += 1;
          foundSession.state = State.QUESTION_COUNTDOWN;
          foundSession.countDownCallBack = setTimeout(() => {
            foundSession.state = State.QUESTION_OPEN;
            foundSession.timeAnswerOpened[foundSession.currentQuestionIndex] = Date.now();
            foundSession.countDownCallBack = null;
            const questionDuration = foundSession.quiz.questions[foundSession.currentQuestionIndex].duration * 1000;
            foundSession.questionCallBack = setTimeout(() => {
              foundSession.state = State.QUESTION_CLOSE;
              foundSession.questionCallBack = null;
            }, questionDuration);
          }, 3000);
          return;
        case 'SKIP_COUNTDOWN':
          throw new Error('Action enum cannot be applied in the current state');
        case 'GO_TO_ANSWER':
          foundSession.questionCallBack = null;
          foundSession.state = State.ANSWER_SHOW;
          return;
        case 'GO_TO_FINAL_RESULTS':
          foundSession.questionCallBack = null;
          foundSession.state = State.FINAL_RESULTS;
          return;
        case 'END':
          foundSession.state = State.END;
          foundSession.countDownCallBack = null;
          foundSession.questionCallBack = null;
      }
      break;

    case 'ANSWER_SHOW':
      switch (action) {
        case 'NEXT_QUESTION':
          foundSession.currentQuestionIndex += 1;
          foundSession.state = State.QUESTION_COUNTDOWN;
          foundSession.countDownCallBack = setTimeout(() => {
            foundSession.state = State.QUESTION_OPEN;
            foundSession.timeAnswerOpened[foundSession.currentQuestionIndex] = Date.now();
            foundSession.countDownCallBack = null;
            const questionDuration = foundSession.quiz.questions[foundSession.currentQuestionIndex].duration * 1000;
            foundSession.questionCallBack = setTimeout(() => {
              foundSession.state = State.QUESTION_CLOSE;
              foundSession.questionCallBack = null;
            }, questionDuration);
          }, 3000);
          return;
        case 'SKIP_COUNTDOWN':
          throw new Error('Action enum cannot be applied in the current state');
        case 'GO_TO_ANSWER':
          throw new Error('Action enum cannot be applied in the current state');
        case 'GO_TO_FINAL_RESULTS':
          foundSession.countDownCallBack = null;
          foundSession.questionCallBack = null;
          foundSession.state = State.FINAL_RESULTS;
          return;
        case 'END':
          foundSession.state = State.END;
          foundSession.countDownCallBack = null;
          foundSession.questionCallBack = null;
      }
      break;

    case 'FINAL_RESULTS':
      switch (action) {
        case 'NEXT_QUESTION':
          throw new Error('Action enum cannot be applied in the current state');
        case 'SKIP_COUNTDOWN':
          throw new Error('Action enum cannot be applied in the current state');
        case 'GO_TO_ANSWER':
          throw new Error('Action enum cannot be applied in the current state');
        case 'GO_TO_FINAL_RESULTS':
          throw new Error('Action enum cannot be applied in the current state');
        case 'END':
          foundSession.state = State.END;
          foundSession.countDownCallBack = null;
          foundSession.questionCallBack = null;
      }
      break;

    case 'END':
      switch (action) {
        case 'NEXT_QUESTION':
          throw new Error('Action enum cannot be applied in the current state');
        case 'SKIP_COUNTDOWN':
          throw new Error('Action enum cannot be applied in the current state');
        case 'GO_TO_ANSWER':
          throw new Error('Action enum cannot be applied in the current state');
        case 'GO_TO_FINAL_RESULTS':
          throw new Error('Action enum cannot be applied in the current state');
        case 'END':
          throw new Error('Action enum cannot be applied in the current state');
      }
  }
}

function adminQuizUpdateThumbnail(quizId: number, token: number, imgurl: string): object {
  const database = getData();
  const user = sessionIdSearch(database, token);

  if (!user || typeof user === 'boolean') {
    throw new Error('Token is empty or invalid (does not refer to valid logged in user session)');
  }

  let quiz = containsQuiz(database, quizId);
  if (quiz === null) {
    quiz = database.trash.find(element => element.quizId === quizId);
    if (quiz !== undefined) {
      throw new Error('The quiz is in trash');
    }
    throw new Error('Valid token is provided, but user is not an owner of this quiz or quiz doesn\'t exist');
  }

  if (quiz.ownerId !== user.userId) {
    throw new Error('Valid token is provided, but user is not an owner of this quiz or quiz doesn\'t exist');
  }

  const timgurl = imgurl.toLowerCase();

  if (!(timgurl.startsWith('http://') || timgurl.startsWith('https://'))) {
    throw new Error('The imgUrl does not begin with http:// or https://');
  }

  if (!(timgurl.endsWith('jpg') || timgurl.endsWith('png') || timgurl.endsWith('jpeg'))) {
    throw new Error('The imgUrl does not end with one of the following filetypes (case insensitive): jpg, jpeg, png');
  }

  quiz.thumbnailUrl = imgurl;
  setData(database);

  return {};
}

/**
 * Fetches the final results for a particular quiz session.
 * @param {*} token The ID of the session making the request.
 * @param {*} sessionId The session Id of the quiz session.
 * @param {*} quizId The ID of the quiz containing the session.
 * @returns {*} An object containing the final results of the session.
 * @throws {Error} If the final results can not be fetched.
 */
function adminQuizFinalResults(token: number, sessionId: number, quizId: number): quizSessionFinalResult {
  return null;
}

/**
 * Fetches the .csv final results in format for a particular quiz session.
 * @param {*} token The ID of the session making the request.
 * @param {*} sessionId The session Id of the quiz session.
 * @param {*} quizId The ID of the quiz containing the session.
 * @returns {*} An object containing the .csv final results of the session.
 * @throws {Error} If the .csv final results can not be fetched.
 */
function adminQuizFinalResultsCSV(token: number, sessionId: number, quizId: number): { url: string } {
  return null;
}

/**
 * Allows a guest user to join a quiz session.
 * @param {*} sessionId The ID of the session to join.
 * @param {*} name The name of the guest joining the session.
 * @returns {*} An object containing the ID of the newly guest player.
 * @throws {Error} If the user can not join the session.
 */
function adminPlayerGuestJoin(sessionId: number, name: string): { playerId: number } {
  const data = getData();

  const session = quizSessionIdSearch(data, sessionId);

  if (session === null) {
    throw new Error('invalid session id');
  }

  if (session.state !== State.LOBBY) {
    throw new Error('session not in LOBBY state');
  }

  if (!isGuestNameUnique(session, name)) {
    throw new Error('name is not unique in session');
  }

  const guest: guest = {
    name: name,
    score: 0,
    id: data.playersCreated,
    answers: [],
    state: State.LOBBY,
    numQuestions: session.quiz.questions.length,
    atQuestion: session.currentQuestionIndex,
  };

  if (session.autoStartNum === session.guests.length) {
    adminQuizSessionUpdateLocal(session.quiz, session.sessionId, Action.NEXT_QUESTION);
  }

  session.guests.push(guest);
  data.playersCreated++;
  setData(data);

  return { playerId: guest.id };
}

function adminQuizSessionStatus(token: number, quizId: number, sessionId: number): object | error {
  const database = getData();
  const user = sessionIdSearch(database, token);
  console.log(user);
  return { error: 'HAHH' };
}

export {
  adminQuizCreate,
  adminQuizList,
  adminQuizDescriptionUpdate,
  adminQuizInfo,
  adminQuizRemove,
  adminQuizNameUpdate,
  adminQuizTrashList,
  adminQuizRestore,
  adminQuizTransfer,
  adminQuizQuestionDelete,
  adminQuizQuestionUpdate,
  adminQuizSessionStart,
  adminQuizSessionUpdate,
  adminQuizUpdateThumbnail,
  adminQuizFinalResults,
  adminQuizFinalResultsCSV,
  adminPlayerGuestJoin,
  adminQuizSessionStatus
};
