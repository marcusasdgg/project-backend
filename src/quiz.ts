import { setData, getData } from "./dataStore";
import { user, data, quiz, error, quizListReturn, quizInfoReturn, quizTrashReturn, answer, answerBody, question, QuestionBody } from "./interface"
import { sessionIdSearch } from "./auth";

/**
 * Searches the database to check if there is a user with the specified id.
 * @param {*} database The database object containing user data.
 * @param {*} id The id of the user to search for.
 * @returns {*} Returns the user object if found, otherwise false.
 */
function containsUser(database: data, id: number): user | null {
  return (
    database.users.find((user: user) => user.userId === id) || null
  );
}

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
    return { error: "invalid quizID & invalid Token" };
  }
  if (user === null) {
    return { error: "invalid Token" };
  }
  if (!quiz) {
    return { error: "invalid quizID" };
  }

  const authUserId = user.userId;
  if (!quizOwned(database, authUserId, quizId)) {
    return { error: "quizId is not owned by authUserId." };
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
    if (
      quiz.quizId === quizId &&
      quiz.ownerId === sessionId &&
      quiz.name === name
    ) {
      return false;
    }
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
  const answers: answer[] = []

  for (let i = 0; i < answerBodies.length; i++) {
    const answer: answer = {
      answer: answerBodies[i].answer,
      correct: answerBodies[i].correct,
      colour: colours[i],
    }

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
    return { error: "invalid Token" };
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
    return { error: "invalid Token" };
  }

  if (!database.hasOwnProperty("quizzesCreated")) {
    database.quizzesCreated = 0;
  }

  if (!/^[a-zA-Z0-9 ]+$/.test(name)) {
    return { error: "Name contains invalid characters" };
  }

  if (name.length < 3 || name.length > 30) {
    return {
      error: "Name is either less than 3 characters long or more than 30 characters long",
    };
  }

  if (description.length > 100) {
    return { error: "Description is more than 100 characters in length" };
  }

  const quizExists = database.quizzes.find(
    (quiz: quiz) => quiz.ownerId === (user as user).userId && quiz.name === name
  );
  if (quizExists) {
    return {
      error: "Name is already used by the current logged in user for another quiz",
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
function adminQuizRemove(sessionId : number, quizId: number): {} | error {
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
): {} | error {
  let data = getData();
  
  const regex = /^[a-zA-Z0-9 ]{3,30}$/;
  const user = sessionIdSearch(data, sessionId);

  if (user === null) {
    return { error: "invalid Token" };
  }

  const authUserId = user.userId;

  if (!containsQuiz(data, quizId)) {
    return { error: "provided quizId is not a real quiz." };
  }

  if (!quizOwned(data, authUserId, quizId)) {
    return { error: "User does not own quiz" };
  }

  if (!regex.test(name)) {
    return { error: "name is invalid." };
  }

  if (!isNameUnique(data, authUserId, quizId, name)) {
    return { error: "name is being used for another quiz." };
  }

  let quiz: quiz = data.quizzes.find(
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
): {} | error {
  let data = getData();

  const regex = /^.{0,100}$/;

  const user = sessionIdSearch(data, sessionId);

  if (user === null) {
    return { error: "invalid Token" };
  }
  
  const authUserId = user.userId;

  if (!containsQuiz(data, quizId)) {
    return { error: "provided quizId is not a real quiz." };
  }

  if (!quizOwned(data, authUserId, quizId)) {
    return { error: "User does not own quiz" };
  }

  if (!regex.test(description)) {
    return { error: "description is invalid." };
  }

  let quiz: quiz = data.quizzes.find(
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
        name: "My Quiz Name"
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
function adminQuizRestore(sessionId: number, quizId: number): {} | error {
  const database = getData();
  const currentUser = sessionIdSearch(database, sessionId);
  //validate details
  if(currentUser === null) {
    return { error: "invalid Token"};
  }
  //now validate that the quiz is in the trash 
  const quizToRestore = database.trash.find((quiz: quiz) => quiz.quizId === quizId);
  if (!quizToRestore) {
    return { error: "invalid quizID" };
  }
  //check if the quiz is owner by current logged in user
  if(quizToRestore.ownerId != currentUser.userId) {
    return { error: "Quiz is not owned by the current user"};
  }
  //all checks done time to restore from trash 
  database.trash = database.trash.filter((quiz: quiz) => quiz.quizId !== quizId);
  //add quiz back to active quizzes
  database.quizzes.push(quizToRestore);
  //update time last edited
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
function adminQuizTransfer(sessionId: number, quizId: number, email: string): {} | error {
  const database = getData();
  const currentUser = sessionIdSearch(database, sessionId);
  if(currentUser === null) {
    return { error: "invalid Token" };
  }
  //check if email is invalid
  const recipientUser = database.users.find((user) => user.email === email);
  if (!recipientUser) {
    return { error: "Recipient user not found" };
  }
  const quizToTransfer = database.quizzes.find((quiz: quiz) => quiz.quizId === quizId);
  if (!quizToTransfer) {
    return { error: "quizID does not exist" };
  }
  if(quizToTransfer.ownerId != currentUser.userId) {
    return {error: "Quiz is not owned by current user"}
  }
  //check if recipient has quiz with the same name
  const existingQuizWithSameName = database.quizzes.find(
    (quiz: quiz) => quiz.ownerId === recipientUser.userId && quiz.name === quizToTransfer.name
  );
  if (existingQuizWithSameName) {
    return { error: "Recipient already owns a quiz with the same name" };
  }
  quizToTransfer.ownerId = recipientUser.userId;
  quizToTransfer.timeLastEdited = Date.now();

  // Save the updated data
  setData(database);

  return {};
}

export function adminQuizAddQuestion(
  sessionId: number,
  quizId: number,
  questionBody: QuestionBody
): { questionId: number } | error { 
  let data = getData();

  const user = sessionIdSearch(data, sessionId);

  if (user === null) {
    return { error: 'invalid Token' };
  }

  const authUserId = user.userId;

  if (!containsQuiz(data, quizId) || !quizOwned(data, authUserId, quizId)) {
    return { error: 'User does not own quiz' };
  }

  let quiz: quiz = data.quizzes.find(
    (element: quiz) => element.quizId === quizId
  );

  if (!isQuestionValid(questionBody, quiz)) {
    return { error: 'The question is invalid' };
  }
    
  const answers = setColours(questionBody.answers);

  const question = {
    questionId: quiz.questions.length,
    question: questionBody.question,
    duration: questionBody.duration,
    points: questionBody.points,
    timeLastEdited: Date.now(),
    timeCreated: Date.now(),
    answers: answers,
  };

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
    questionId: quiz.questions.length,
    question: question.question,
    duration: question.duration,
    points: question.points,
    timeLastEdited: question.timeLastEdited,
    timeCreated: question.timeCreated,
    answers: question.answers,
  };

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

export function adminQuizTrashEmpty(token: number, quizIds: number[]): {} | error {
  const database = getData();
  const user = sessionIdSearch(database, token);

  if (!user || typeof user === 'boolean') {
    return { error: "invalid Token" };
  }

  for (const quizId of quizIds) {
    const quiz = containsQuiz(database, quizId);
    if (!quiz) {
      return { error: "One or more quiz IDs is not currently in the trash" };
    }
    if (quiz.ownerId !== (user as user).userId) {
      return { error: "Quiz ID is not owned by the current user" };
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

export function adminQuizQuestionMove(token: number, quizId: number, questionId: number, newPosition: number): {} | error {
  const database = getData();
  const user = sessionIdSearch(database, token);

  if (!user || typeof user === 'boolean') {
    return { error: "invalid Token" };
  }

  const quiz = containsQuiz(database, quizId);
  if (!quiz) {
    return { error: "Quiz ID does not refer to a valid quiz" };
  }

  if (quiz.ownerId !== (user as user).userId) {
    return { error: "Quiz is not owned by the current user" };
  }

  const questionIndex = quiz.questions.findIndex((q: question) => q.questionId === questionId);
  if (questionIndex === -1) {
    return { error: "Question ID does not refer to a valid question within this quiz" };
  }

  if (newPosition < 0 || newPosition >= quiz.questions.length) {
    return { error: "New position is out of range" };
  }

  const [movedQuestion] = quiz.questions.splice(questionIndex, 1);
  quiz.questions.splice(newPosition, 0, movedQuestion);
  quiz.timeLastEdited = Date.now();

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
};
