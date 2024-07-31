import {
  error,
  adminUserDetailsReturn,
  quizInfoReturn,
  sessionIdToken,
  QuestionBody,
  quizTrashListReturn,
  Action,
  quizSessionFinalResult,
  sessionStatusReturn,
} from './interface';
import request from 'sync-request-curl';
import config from './config.json';

const port = config.port;
const url = config.url;

function adminAuthRegisterHelper(
  email: string,
  password: string,
  nameFirst: string,
  nameLast: string
): error | sessionIdToken {
  const body = {
    email: email,
    password: password,
    nameFirst: nameFirst,
    nameLast: nameLast,
  };
  const res = request('POST', `${url}:${port}/v1/admin/auth/register`, {
    json: body,
  });
  const result = JSON.parse(res.body as string);
  if ('error' in result) {
    return result;
  } else {
    return { sessionId: parseInt(result.token) };
  }
}

function clearHelper(): object {
  const res = request('DELETE', `${url}:${port}/v1/clear`);
  return JSON.parse(res.body as string);
}

function adminUserDetailsUpdateHelper(
  sessionId: number,
  email: string,
  nameFirst: string,
  nameLast: string
): error | object {
  const body = {
    token: sessionId,
    email: email,
    nameFirst: nameFirst,
    nameLast: nameLast,
  };
  const resd = request('PUT', `${url}:${port}/v1/admin/user/details`, {
    json: body,
  });

  const res = JSON.parse(resd.body as string);

  if ('error' in res) {
    return res;
  } else {
    return {};
  }
}

export function adminUserDetailsUpdateV2Helper(
  sessionId: number,
  email: string,
  nameFirst: string,
  nameLast: string
): error | object {
  const body = {
    email: email,
    nameFirst: nameFirst,
    nameLast: nameLast,
  };
  const resd = request('PUT', `${url}:${port}/v2/admin/user/details`, {
    json: body,
    headers: { token: sessionId.toString() }
  });

  const res = JSON.parse(resd.body as string);

  if ('error' in res) {
    return res;
  } else {
    return {};
  }
}

function adminUserPasswordUpdateHelper(
  sessionId: number,
  oldPassword: string,
  newPassword: string
) {
  const body = {
    token: sessionId,
    oldPassword: oldPassword,
    newPassword: newPassword,
  };

  const resd = request('PUT', `${url}:${port}/v1/admin/user/password`, {
    json: body,
  });

  const res = JSON.parse(resd.body as string);

  if ('error' in res) {
    return res;
  } else {
    return {};
  }
}

export function adminUserPasswordUpdateV2Helper(
  sessionId: number,
  oldPassword: string,
  newPassword: string
) {
  const body = {
    oldPassword: oldPassword,
    newPassword: newPassword,
  };

  const resd = request('PUT', `${url}:${port}/v2/admin/user/password`, {
    json: body,
    headers: { token: sessionId.toString() }
  });

  const res = JSON.parse(resd.body as string);

  if ('error' in res) {
    return res;
  } else {
    return {};
  }
}

function adminAuthLoginHelper(
  email: string,
  password: string
): { sessionId: number } | error {
  const body = {
    email: email,
    password: password,
  };

  const res = request('POST', `${url}:${port}/v1/admin/auth/login`, {
    json: body,
  });
  const response = JSON.parse(res.body as string);
  if ('error' in response) {
    return response;
  } else {
    return { sessionId: parseInt(response.token) };
  }
  //  const response: error | {sessionId: number} = JSON.parse(res.body as string)
}

/**
 * Updates the name of a specified quiz using version 1 of the API.
 * @param {*} sessionId The ID of the admin session making the request.
 * @param {*} quizId The ID of the quiz to be updated.
 * @param {*} name The new name for the quiz.
 * @returns {*} An empty object if successful.
 * @throws {Error} If the API returns an error.
 */
function adminQuizNameUpdateHelper(
  sessionId: number,
  quizId: number,
  name: string
): object {
  const body = {
    token: sessionId,
    name: name,
  };

  const res = request('PUT', `${url}:${port}/v1/admin/quiz/${quizId}/name`, {
    json: body,
  });

  const result = JSON.parse(res.body as string);

  if ('error' in result) {
    throw new Error(result.error);
  } else {
    return {};
  }
}

/**
 * Updates the name of a specified quiz using version 2 of the API.
 * @param {*} sessionId The ID of the admin session making the request.
 * @param {*} quizId The ID of the quiz to be updated.
 * @param {*} name The new name for the quiz.
 * @returns {*} An empty object if successful.
 * @throws {Error} If the API returns an error.
 */
function adminQuizNameUpdateV2Helper(
  sessionId: number,
  quizId: number,
  name: string
): object {
  const body = {
    name: name,
  };

  const res = request('PUT', `${url}:${port}/v2/admin/quiz/${quizId}/name`, {
    json: body, headers: { token: sessionId.toString() }
  });

  const result = JSON.parse(res.body as string);

  if ('error' in result) {
    throw new Error(result.error);
  } else {
    return {};
  }
}

/**
 * Updates the description of a specified quiz using version 1 of the API.
 * @param {*} sessionId The ID of the admin session making the request.
 * @param {*} quizId The ID of the quiz to be updated.
 * @param {*} description The new description for the quiz.
 * @returns {*} An empty object if successful.
 * @throws {Error} If the API returns an error.
 */
function adminQuizDescriptionUpdateHelper(
  sessionId: number,
  quizId: number,
  description: string
): object {
  const body = {
    token: sessionId,
    description: description,
  };

  const res = request(
    'PUT',
    `${url}:${port}/v1/admin/quiz/${quizId}/description`,
    {
      json: body,
    }
  );

  const result = JSON.parse(res.body as string);

  if ('error' in result) {
    throw new Error(result.error);
  } else {
    return {};
  }
}

/**
 * Updates the description of a specified quiz using version 2 of the API.
 * @param {*} sessionId The ID of the admin session making the request.
 * @param {*} quizId The ID of the quiz to be updated.
 * @param {*} description The new description for the quiz.
 * @returns {*} An empty object if successful.
 * @throws {Error} If the API returns an error.
 */
function adminQuizDescriptionUpdateV2Helper(
  sessionId: number,
  quizId: number,
  description: string
): object {
  const body = {
    description: description,
  };

  const res = request(
    'PUT',
    `${url}:${port}/v2/admin/quiz/${quizId}/description`,
    {
      json: body, headers: { token: sessionId.toString() }
    }
  );

  const result = JSON.parse(res.body as string);

  if ('error' in result) {
    throw new Error(result.error);
  } else {
    return {};
  }
}

function adminUserDetailsHelper(
  sessionId: number
): adminUserDetailsReturn | error {
  const res = request('GET', `${url}:${port}/v1/admin/user/details`, {
    qs: { token: sessionId.toString() },
  });

  const result = JSON.parse(res.body as string);
  if ('error' in result) {
    return result;
  } else {
    return result;
  }
}

function adminUserDetailsV2Helper(
  sessionId: number
): adminUserDetailsReturn | error {
  const res = request('GET', `${url}:${port}/v2/admin/user/details`, {
    headers: { token: sessionId.toString() }
  });

  const result = JSON.parse(res.body as string);

  if ('error' in result) {
    return result;
  } else {
    return result;
  }
}

function adminQuizTrashListHelper(sessionId : number): quizTrashListReturn | error {
  const res = request('GET', `${url}:${port}/v1/admin/quiz/trash`, {
    qs: { token: sessionId.toString() }
  });

  const result = JSON.parse(res.body as string);

  if ('error' in result) {
    return result;
  } else {
    return result;
  }
}

function adminQuizTrashListV2Helper(sessionId : number): quizTrashListReturn | error {
  const res = request('GET', `${url}:${port}/v2/admin/quiz/trash`, {
    headers: { token: sessionId.toString() }
  });

  const result = JSON.parse(res.body as string);

  if ('error' in result) {
    return result;
  } else {
    return result;
  }
}

function adminQuizInfoHelper(
  sessionId: number,
  quizId: number
): quizInfoReturn | error {
  const res = request('GET', `${url}:${port}/v1/admin/quiz/${quizId}`, {
    qs: { token: sessionId.toString() },
  });
  const result = JSON.parse(res.body as string);

  if ('error' in result) {
    return result;
  } else {
    return result;
  }
}

function adminQuizInfoV2Helper(
  sessionId: number,
  quizId: number
): quizInfoReturn | error {
  const res = request('GET', `${url}:${port}/v2/admin/quiz/${quizId}`, {
    headers: { token: sessionId.toString() },
  });
  const result = JSON.parse(res.body as string);

  if ('error' in result) {
    return result;
  } else {
    return result;
  }
}

function adminQuizRestoreHelper(sessionId: number, quizId: number): object | error {
  const body = {
    token: sessionId,
  };

  const res = request('POST', `${url}:${port}/v1/admin/quiz/${quizId}/restore`, {
    json: body,
  });
  const result = JSON.parse(res.body as string);
  if ('error' in result) {
    return result;
  } else {
    return {};
  }
}

function adminQuizRestoreV2Helper(
  sessionId: number,
  quizId: number
): object | error {
  const res = request('POST', `${url}:${port}/v2/admin/quiz/${quizId}/restore`, {
    json: { token: sessionId },
    headers: { token: sessionId.toString() }
  });

  const result = JSON.parse(res.body as string);

  if ('error' in result) {
    return result;
  } else {
    return {};
  }
}

function adminQuizRemoveHelper(sessionId: number, quizId: number): object | error {
  const res = request('DELETE', `${url}:${port}/v1/admin/quiz/${quizId}`, {
    qs: { token: sessionId.toString() },
  });
  const result = JSON.parse(res.body as string);

  if ('error' in result) {
    return result;
  } else {
    return {};
  }
}

function adminQuizRemoveV2Helper(sessionId: number, quizId: number): object | error {
  const res = request('DELETE', `${url}:${port}/v2/admin/quiz/${quizId}`, {
    headers: { token: sessionId.toString() },
  });
  const result = JSON.parse(res.body as string);

  if ('error' in result) {
    return result;
  } else {
    return {};
  }
}

function adminQuizCreateHelper(
  token: number,
  name: string,
  description: string
): error | { quizId: number } {
  const body = {
    token,
    name,
    description,
  };
  const res = request('POST', `${url}:${port}/v1/admin/quiz`, {
    json: body,
  });
  return JSON.parse(res.body as string);
}

function adminQuizCreateV2Helper(
  token: number,
  name: string,
  description: string
): error | { quizId: number } {
  const body = {
    name,
    description,
  };

  const res = request('POST', `${url}:${port}/v2/admin/quiz`, {
    json: body,
    headers: { token: token.toString() }
  });

  const result = JSON.parse(res.body as string);

  if ('error' in result) {
    return result;
  } else {
    return { quizId: result.quizId };
  }
}

function adminQuizListHelper(
  token: number
): error | { quizzes: { quizId: number; name: string }[] } {
  const res = request('GET', `${url}:${port}/v1/admin/quiz/list`, {
    qs: { token: token.toString() },
  });
  return JSON.parse(res.body as string);
}

function adminQuizListV2Helper(token: number): error | { quizzes: { quizId: number; name: string }[] } {
  const res = request('GET', `${url}:${port}/v2/admin/quiz/list`, {
    headers: { token: token.toString() }
  });
  return JSON.parse(res.body as string);
}

function adminQuizTrashEmptyHelper(token: number, quizIds: number[]): error | object {
  const res = request('DELETE', `${url}:${port}/v1/admin/quiz/trash/empty`, {
    qs: {
      token: token.toString(),
      quizIds: JSON.stringify(quizIds),
    }
  });
  return JSON.parse(res.body as string);
}
function adminQuizTrashEmptyV2Helper(token: number, quizIds: number[]): error | object {
  const res = request('DELETE', `${url}:${port}/v2/admin/quiz/trash/empty`, {
    qs: {
      quizIds: JSON.stringify(quizIds),
    },
    headers: {
      token: token.toString(),
    }
  });
  return JSON.parse(res.body as string);
}

function adminQuizQuestionMoveHelper(token: number, quizId: number, questionId: number, newPosition: number): error | object {
  const body = {
    token: token,
    newPosition: newPosition
  };

  const res = request('PUT', `${url}:${port}/v1/admin/quiz/${quizId}/question/${questionId}/move`, {
    json: body
  });

  const parsedResponse = JSON.parse(res.body as string);
  if (res.statusCode === 200) {
    return parsedResponse;
  } else {
    return parsedResponse;
  }
}

function adminQuizQuestionMoveV2Helper(token: number, quizId: number, questionId: number, newPosition: number): error | object {
  const body = {
    newPosition: newPosition
  };

  const res = request('PUT', `${url}:${port}/v2/admin/quiz/${quizId}/question/${questionId}/move`, {
    json: body,
    headers: { token: token.toString() }
  });

  const parsedResponse = JSON.parse(res.body as string);
  if ('error' in parsedResponse) {
    return parsedResponse;
  } else {
    return parsedResponse;
  }
}

function adminQuizQuestionDeleteHelper(quizId: number, questionId: number, token: number) : object | error {
  const res = request('DELETE', `${url}:${port}/v1/admin/quiz/${quizId}/question/${questionId}`, {
    qs: { token: token }
  });

  const result = JSON.parse(res.body as string);

  if ('error' in result) {
    return result;
  } else {
    return {};
  }
}

export function adminQuizQuestionDeleteV2Helper(quizId: number, questionId: number, token: number) : object | error {
  const res = request('DELETE', `${url}:${port}/v2/admin/quiz/${quizId}/question/${questionId}`, {
    headers: { token: token.toString() }
  });

  const result = JSON.parse(res.body as string);

  if ('error' in result) {
    return result;
  } else {
    return {};
  }
}

function adminQuizQuestionUpdateHelper(quizId: number, questionId: number, token: number, questionBody: QuestionBody) : object | error {
  const res = request('PUT', `${url}:${port}/v1/admin/quiz/${quizId}/question/${questionId}`, {
    json: {
      token: token,
      questionBody: questionBody
    }
  });

  const result = JSON.parse(res.body as string);

  if ('error' in result) {
    return result;
  } else {
    return {};
  }
}

export function adminQuizQuestionUpdateV2Helper(quizId: number, questionId: number, token: number, questionBody: QuestionBody, thumbnailUrl: string) : object | error {
  questionBody.thumbnailUrl = thumbnailUrl;
  const res = request('PUT', `${url}:${port}/v2/admin/quiz/${quizId}/question/${questionId}`, {
    json: {
      questionBody: questionBody,
    },
    headers: { token: token.toString() }
  });

  const result = JSON.parse(res.body as string);

  if ('error' in result) {
    return result;
  } else {
    return {};
  }
}

function adminAuthLogoutHelper(token: number): object | error {
  const body = {
    token
  };

  const res = request('POST', `${url}:${port}/v1/admin/auth/logout`, {
    json: body
  });

  const result = JSON.parse(res.body as string);

  if ('error' in result) {
    return result;
  } else {
    return {};
  }
}

function adminAuthLogoutV2Helper(token: number): object | error {
  const body = {
    token
  };

  const res = request('POST', `${url}:${port}/v2/admin/auth/logout`, {
    json: body,
    headers: { token: token.toString() }
  });

  const result = JSON.parse(res.body as string);

  if ('error' in result) {
    return result;
  } else {
    return {};
  }
}

function adminQuizTransferHelper(sessionId: number, quizId: number, userEmail: string): object | error {
  const body = {
    token: sessionId,
    userEmail: userEmail,
  };
  const res = request('POST', `${url}:${port}/v1/admin/quiz/${quizId}/transfer`, {
    json: body
  });
  const response = JSON.parse(res.body as string);
  if ('error' in response) {
    return response;
  } else {
    return {};
  }
}

function adminQuizTransferV2Helper(
  sessionId: number,
  quizId: number,
  userEmail: string
): object | error {
  const body = {
    userEmail: userEmail,
  };

  const res = request('POST', `${url}:${port}/v2/admin/quiz/${quizId}/transfer`, {
    json: body,
    headers: { token: sessionId.toString() }
  });

  const response = JSON.parse(res.body as string);

  if ('error' in response) {
    return response;
  } else {
    return {};
  }
}

/**
 * Sends a request to add a new question to a specified quiz using version 1 of the API.
 * @param {*} sessionId The ID of the admin session making the request
 * @param {*} quizId The ID of the quiz to which the question will be added
 * @param {*} questionBody An object containing the details of the question to be added
 * @returns {*} An object with the ID of the newly added question if successful.
  * @throws {Error} If the API returns an error.
 */
function adminQuizAddQuestionHelper(
  sessionId: number,
  quizId: number,
  questionBody: QuestionBody
): { questionId: number } {
  const body = { token: sessionId, questionBody: questionBody };

  const res = request('POST', `${url}:${port}/v1/admin/quiz/${quizId}/question`,
    { json: body }
  );

  const result = JSON.parse(res.body as string);

  if ('error' in result) {
    throw new Error(result.error);
  } else {
    return { questionId: result.questionId };
  }
}

/**
 * Sends a request to add a new question to a specified quiz using version 2 of the API.
 * @param {*} sessionId The ID of the admin session making the request
 * @param {*} quizId The ID of the quiz to which the question will be added
 * @param {*} questionBody An object containing the details of the question to be added
 * @returns {*} An object with the ID of the newly added question if successful.
 * @throws {Error} If the API returns an error.
 */
function adminQuizAddQuestionV2Helper(
  sessionId: number,
  quizId: number,
  questionBody: QuestionBody
): { questionId: number } {
  const body = { questionBody: questionBody };

  const res = request('POST', `${url}:${port}/v2/admin/quiz/${quizId}/question`,
    { json: body, headers: { token: sessionId.toString() } }
  );

  const result = JSON.parse(res.body as string);

  if ('error' in result) {
    throw new Error(result.error);
  } else {
    return { questionId: result.questionId };
  }
}

/**
 * Sends a request to duplicate a question in a specified quiz.
 * @param {*} sessionId The ID of the admin session making the request.
 * @param {*} quizId The ID of the quiz containing the question to be duplicated.
 * @param {*} questionId The ID of the question to be duplicated.
 * @returns {*} An object containing the ID of the newly duplicated question if successful.
 * @throws {Error} If the API returns an error.
 */
function adminQuizDuplicateQuestionHelper(
  sessionId: number,
  quizId: number,
  questionId: number
): { questionId: number } {
  const res = request(
    'POST', `${url}:${port}/v1/admin/quiz/${quizId}/question/${questionId}/duplicate`,
    { qs: { token: sessionId } }
  );

  const result = JSON.parse(res.body as string);

  if ('error' in result) {
    throw new Error(result.error);
  } else {
    return { questionId: result.questionId };
  }
}

/**
 * Sends a request to duplicate a question in a specified quiz using version 2 of the API.
 * @param {*} sessionId The ID of the admin session making the request.
 * @param {*} quizId The ID of the quiz containing the question to be duplicated.
 * @param {*} questionId The ID of the question to be duplicated.
 * @returns {*} An object containing the ID of the newly duplicated question if successful.
 * @throws {Error} If the API returns an error.
 */
function adminQuizDuplicateQuestionV2Helper(
  sessionId: number,
  quizId: number,
  questionId: number
): { questionId: number } {
  const res = request(
    'POST', `${url}:${port}/v2/admin/quiz/${quizId}/question/${questionId}/duplicate`,
    { headers: { token: sessionId.toString() } }
  );

  const result = JSON.parse(res.body as string);

  if ('error' in result) {
    throw new Error(result.error);
  } else {
    return { questionId: result.questionId };
  }
}

function adminQuizSessionStartHelper(quizId: number, token: number, autoStartNum: number) : {sessionId: number} | error {
  const res = request('POST', `${url}:${port}/v1/admin/quiz/${quizId}/session/start`,
    { headers: { token: token.toString() }, json: { autoStartNum: autoStartNum.toString() } }
  );

  const result = JSON.parse(res.body as string);

  if ('error' in result) {
    return result;
  } else {
    return { sessionId: result.sessionId };
  }
}

function adminQuizSessionUpdateHelper(quizId: number, token: number, sessionId: number, action: Action) : Record<string, never> | error {
  const res = request('PUT', `${url}:${port}/v1/admin/quiz/${quizId}/session/${sessionId}`,
    { headers: { token: token.toString() }, json: { action: action } }
  );

  const result = JSON.parse(res.body as string);

  if ('error' in result) {
    return result;
  } else {
    return {};
  }
}

function adminQuizUpdateThumnailHelper(quizId: number, token: number, ubrl: string) {
  const res = request('PUT', `${url}:${port}/v1/admin/quiz/${quizId}/thumbnail`,
    { headers: { token: token.toString() }, json: { imgUrl: ubrl } }
  );

  const result = JSON.parse(res.body as string);

  if ('error' in result) {
    return result;
  } else {
    return {};
  }
}

/**
 * Sends a request to get the final results for a game session.
 * @param {*} token The session of a logged in user.
 * @param {*} sessionId The ID of the session to get the final results for.
 * @param {*} quizId The ID of the quiz to get the final results for.
 * @returns {*} An object to the with the final results.
 * @throws {Error} If the API returns an error.
 */
function adminQuizFinalResultsHelper(
  token: number,
  sessionId: number,
  quizId: number
): quizSessionFinalResult {
  const res = request(
    'GET', `${url}:${port}/v1/admin/quiz/${quizId}/session/${sessionId}/results`,
    { headers: { token: token.toString() } }
  );

  const result = JSON.parse(res.body as string);

  if ('error' in result) {
    throw new Error(result.error);
  } else {
    return result;
  }
}

/**
 * Sends a request to get the final results for a game session in CSV format.
 * @param {*} token The session of a logged in user.
 * @param {*} sessionId The ID of the session to get the final results for.
 * @param {*} quizId The ID of the quiz to get the final results for.
 * @returns {*} A url object to the CSV file containing the final results.
 * @throws {Error} If the API returns an error.
 */
function adminQuizFinalResultsCSVHelper(
  token: number,
  sessionId: number,
  quizId: number
): { url: string } {
  const res = request(
    'GET', `${url}:${port}/v1/admin/quiz/${quizId}/session/${sessionId}/results/csv`,
    { headers: { token: token.toString() } }
  );

  const result = JSON.parse(res.body as string);

  if ('error' in result) {
    throw new Error(result.error);
  } else {
    return result;
  }
}

/**
 * Sends a request to add a guest player to a specific session.
 * @param {*} sessionId The sessionId of the session to join.
 * @param {*} name The name of the guest to join the session.
 * @returns {*} An object containing the ID of the player who is joining the session.
 * @throws {Error} If the API returns an error.
 */
function adminPlayerGuestJoinHelper(
  sessionId: number,
  name: string
): { playetId: string } {
  const res = request(
    'POST', `${url}:${port}/v1/player/join`,
    { json: { sessionId: sessionId, name: name } }
  );

  const result = JSON.parse(res.body as string);

  if ('error' in result) {
    throw new Error(result.error);
  } else {
    return result;
  }
}

function adminQuizSessionStatusHelper(
  sessionId: number,
  quizId: number,
  token: number
): sessionStatusReturn | error {
  const res = request('GET', `${url}:${port}/v1/admin/quiz/${quizId}/session/${sessionId}/status`, {
    headers: { token: token.toString() },
  });

  const result = JSON.parse(res.body as string);

  if ('error' in result) {
    return result;
  } else {
    return result;
  }
}

function adminPlayerStatusHelper(playerId: number): Record<string, never> | error {
  const res = request('GET', `${url}:${port}/v1/player/${playerId}`, {
    headers: {},
  });

  const result = JSON.parse(res.body as string);

  if ('error' in result) {
    return result;
  } else {
    return {};
  }
}
export {
  clearHelper,
  adminAuthLoginHelper,
  adminUserPasswordUpdateHelper,
  adminAuthRegisterHelper,
  adminQuizNameUpdateHelper,
  adminQuizNameUpdateV2Helper,
  adminQuizDescriptionUpdateHelper,
  adminQuizDescriptionUpdateV2Helper,
  adminUserDetailsUpdateHelper,
  adminUserDetailsHelper,
  adminQuizInfoHelper,
  adminQuizRemoveHelper,
  adminQuizCreateHelper,
  adminQuizListHelper,
  adminQuizTrashEmptyHelper,
  adminQuizQuestionMoveHelper,
  adminQuizQuestionDeleteHelper,
  adminAuthLogoutHelper,
  adminQuizTrashListHelper,
  adminQuizAddQuestionHelper,
  adminQuizAddQuestionV2Helper,
  adminQuizDuplicateQuestionHelper,
  adminQuizDuplicateQuestionV2Helper,
  adminQuizQuestionUpdateHelper,
  adminQuizTransferHelper,
  adminQuizRestoreHelper,
  adminAuthLogoutV2Helper,
  adminQuizRemoveV2Helper,
  adminQuizInfoV2Helper,
  adminQuizTrashListV2Helper,
  adminUserDetailsV2Helper,
  adminQuizRestoreV2Helper,
  adminQuizTransferV2Helper,
  adminQuizSessionStartHelper,
  adminQuizSessionUpdateHelper,
  adminQuizTrashEmptyV2Helper,
  adminQuizQuestionMoveV2Helper,
  adminQuizCreateV2Helper,
  adminQuizListV2Helper,
  adminQuizFinalResultsHelper,
  adminQuizFinalResultsCSVHelper,
  adminPlayerGuestJoinHelper,
  adminQuizUpdateThumnailHelper,
  adminQuizSessionStatusHelper,
  adminPlayerStatusHelper
};
