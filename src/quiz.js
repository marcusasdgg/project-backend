import { setData, getData } from "./dataStore";

/**
 * Searches the database to check if there is a user with the specified ID.
 * @param {*} database The database object containing user data.
 * @param {*} id The ID of the user to search for.
 * @returns {*} Returns the user object if found, otherwise false.
 */
function containsUser(database, id) {
  return database.users.find((user) => user.userId === id) || false;
}

/**
 * Searches the database to check if there is a quiz with the specified ID.
 * @param {Object} database The database object containing quiz data.
 * @param {string|number} id The ID of the quiz to search for.
 * @returns {Object|boolean} Returns the quiz object if found, otherwise false.
 */
function containsQuiz(database, id) {
  return database.quizzes.find((quiz) => quiz.quizId === id) || false;
}

/**
 * Checks if a specific quiz is owned by a user in the database.
 * @param {*} database The database object containing quiz and user data.
 * @param {*} authUserId The ID of the user to check ownership.
 * @param {*} quizId The ID of the quiz to check.
 * @returns {*} Returns true if the user owns the quiz, otherwise false.
 */
function quizOwned(database, authUserId, quizId) {
  for (const quiz of database.quizzes) {
    if (quiz.quizId === quizId && quiz.ownerId === authUserId) {
      return true;
    }
  }

  return false;
}

/**
 * Checks if a quiz name is unique for a given user and quiz in the database.
 * @param {*} database The database object containing quiz data.
 * @param {*} authUserId The ID of the user to check against.
 * @param {*} quizId The ID of the quiz to check against.
 * @param {*} name The name to check for uniqueness.
 * @returns {*} Returns false if the name is not unique, otherwise true.
 */
function isNameUnique(database, authUserId, quizId, name) {
  for (const quiz of database.quizzes) {
    if (
      quiz.quizId === quizId &&
      quiz.ownerId === authUserId &&
      quiz.name === name
    ) {
      return false;
    }
  }

  return true;
}

/**
 * Function: Provide a list of all quizzes that are owned by the currently logged in user.
 
 * @param {authUserId} authUserId 
 * @returns object containing quizId and name 
 */
function adminQuizList(authUserId) {
  const database = getData();
  const user = database.users.find((user) => user.userId === authUserId);

  if (!user) {
    return { error: "AuthUserId is not a valid user" };
  }

  const quizzes = database.quizzes
    .filter((quiz) => quiz.ownerId === authUserId)
    .map((quiz) => ({
      quizId: quiz.quizId,
      name: quiz.name,
    }));

  return { quizzes };
}

/**
* Function: Given basic details about a new quiz, create one for the logged in user.

* @param {authUserId } authUserId 
* @param {name } name 
* @param {description} description 
* @returns object containing quizId of user 
*/
function adminQuizCreate(authUserId, name, description) {
  const database = getData();

  if (!database.hasOwnProperty("quizzesCreated")) {
    database.quizzesCreated = 0;
  }

  const user = database.users.find((user) => user.userId === authUserId);

  if (!user) {
    return { error: "AuthUserId is not a valid user" };
  }

  if (!/^[a-zA-Z0-9 ]+$/.test(name)) {
    return { error: "Name contains invalid characters" };
  }

  if (name.length < 3 || name.length > 30) {
    return {
      error:
        "Name is either less than 3 characters long or more than 30 characters long",
    };
  }

  if (description.length > 100) {
    return { error: "Description is more than 100 characters in length" };
  }

  const quizExists = database.quizzes.find(
    (quiz) => quiz.ownerId === authUserId && quiz.name === name
  );
  if (quizExists) {
    return {
      error:
        "Name is already used by the current logged in user for another quiz",
    };
  }

  const quizId = database.quizzesCreated + 1;
  database.quizzesCreated += 1;
  const newQuiz = {
    quizId: quizId,
    ownerId: authUserId,
    name: name,
    description: description,
    timeCreated: Date.now(),
    timeLastEdited: Date.now(),
  };

  newQuiz.timeCreated = Date.now();
  newQuiz.timeLastEdited = Date.now();

  database.quizzes.push(newQuiz);
  setData(database);

  return { quizId };
}

/**
 * This function removes a quiz using userId.
 *
 * @param {*} authUserId
 * @param {*} quizId
 * @returns
 */
function adminQuizRemove(authUserId, quizId) {
  const database = getData();
  const user = database.users.find((user) => user.userId === authUserId);
  const quiz = database.quizzes.find((quiz) => quiz.quizId === quizId);

  if (!quiz && !user) {
    return { error: "invalid userID & quizID" };
  }
  if (!user) {
    return { error: "invalid userID" };
  }
  if (!quiz) {
    return { error: "invalid quizID" };
  }

  if (!quizOwned(database, authUserId, quizId)) {
    return { error: "quizId is not owned by authUserId." };
  }

  database.quizzes = database.quizzes.filter((q) => q.quizId !== quizId);
  setData(database);

  return {};
}

/**
 * This function stores quiz info.
 *
 * @param {*} authUserId
 * @param {*} quizId
 * @returns returns a object containing info about the quiz in question.
 */
function adminQuizInfo(authUserId, quizId) {
  const database = getData();
  const user = database.users.find((user) => user.userId === authUserId);
  const quiz = database.quizzes.find((quiz) => quiz.quizId === quizId);

  if (!quiz && !user) {
    return { error: "invalid userID & quizID" };
  }
  if (!user) {
    return { error: "invalid userID" };
  }
  if (!quiz) {
    return { error: "invalid quizID" };
  }
  if (!quizOwned(database, authUserId, quizId)) {
    return { error: "quizId is not owned by authUserId." };
  }

  return {
    quizId: quiz.quizId,
    name: quiz.name,
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
function adminQuizNameUpdate(authUserId, quizId, name) {
  let data = getData();

  const regex = /^[a-zA-Z0-9 ]{3,30}$/;

  if (!containsUser(data, authUserId)) {
    return { error: "provided authUserId is not a real user." };
  }

  if (!containsQuiz(data, quizId)) {
    return { error: "provided quizId is not a real quiz." };
  }

  if (!quizOwned(data, authUserId, quizId)) {
    return { error: "provided quizId is not owned by current user." };
  }

  if (!regex.test(name)) {
    return { error: "name is invalid." };
  }

  if (!isNameUnique(data, authUserId, quizId, name)) {
    return { error: "name is being used for another quiz." };
  }

  let quiz = data.quizzes.find((element) => element.quizId === quizId);

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
function adminQuizDescriptionUpdate(authUserId, quizId, description) {
  let data = getData();

  const regex = /^.{0,100}$/;

  if (!containsUser(data, authUserId)) {
    return { error: "provided authUserId is not a real user." };
  }

  if (!containsQuiz(data, quizId)) {
    return { error: "provided quizId is not a real quiz." };
  }

  if (!quizOwned(data, authUserId, quizId)) {
    return { error: "provided quizId is not owned by current user." };
  }

  if (!regex.test(description)) {
    return { error: "description is invalid." };
  }

  let quiz = data.quizzes.find((element) => element.quizId === quizId);

  quiz.description = description;
  quiz.timeLastEdited = Date.now();

  setData(data);
  return {};
}

export {
  adminQuizCreate,
  adminQuizList,
  adminQuizDescriptionUpdate,
  adminQuizInfo,
  adminQuizRemove,
  adminQuizNameUpdate,
};
