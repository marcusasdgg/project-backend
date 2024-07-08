import { setData, getData, } from "./dataStore";
import {user, data, quiz, error, quizListReturn, quizInfoReturn, quizTrashReturn, sessionIdToken, question, QuestionBody } from "./interface"
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
 * @param {*} authUserId The ID of the user to check against.
 * @param {*} quizId The ID of the quiz to check against.
 * @param {*} name The name to check for uniqueness.
 * @returns {*} Returns false if the name is not unique, otherwise true.
 */
function isNameUnique(
  database: data,
  sessionId: number,
  quizId: number,
  name: string
): boolean | user {
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

function adminQuizRestore(sessionId: number, quizId: number): {} | error {
  return {};
}

export function adminQuizAddQuestion(
  sessionId: number,
  quizId: number,
  questionBody: QuestionBody
): { questionId: number } | error { 
  return null;
}

export function adminQuizDuplicateQuestion(
  sessionId: number,
  quizId: number,
  questionId: number
): { questionId: number } | error {
  return null;
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
};
