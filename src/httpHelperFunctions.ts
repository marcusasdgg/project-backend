import {
  error,
  adminUserDetailsReturn,
  quizInfoReturn,
  sessionIdToken,
  QuestionBody,
  quizTrashListReturn,
  Action,
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

function adminQuizNameUpdateHelper(
  sessionId: number,
  quizId: number,
  name: string
): error | object {
  const body = {
    token: sessionId,
    name: name,
  };

  const res = request('PUT', `${url}:${port}/v1/admin/quiz/${quizId}/name`, {
    json: body,
  });

  const result = JSON.parse(res.body as string);

  if ('error' in result) {
    return result;
  } else {
    return result;
  }
}

function adminQuizNameUpdateHelperV2(
  sessionId: number,
  quizId: number,
  name: string
): error | object {
  const body = {
    name: name,
  };

  const res = request('PUT', `${url}:${port}/v2/admin/quiz/${quizId}/name`, {
    json: body, headers: { token: sessionId.toString() },
  });

  const result = JSON.parse(res.body as string);

  if ('error' in result) {
    return result;
  } else {
    return result;
  }
}

function adminQuizDescriptionUpdateHelper(
  sessionId: number,
  quizId: number,
  description: string
) {
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
    return result;
  } else {
    return {};
  }
}

function adminQuizDescriptionUpdateHelperV2(
  sessionId: number,
  quizId: number,
  description: string
) {
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
    return result;
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

function adminQuizListHelper(
  token: number
): error | { quizzes: { quizId: number; name: string }[] } {
  const res = request('GET', `${url}:${port}/v1/admin/quiz/list`, {
    qs: { token: token.toString() },
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

  // Check the status code to see if it was a successful request
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

  // Handle different status codes
  if (res.statusCode === 200) {
    return parsedResponse; // Successful move
  } else {
    return parsedResponse;
  } // Return the error response directly
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
  const res = request('PUT', `${url}:${port}/v2/admin/quiz/${quizId}/question/${questionId}`, {
    json: {
      questionBody: questionBody,
      thumbnailUrl: thumbnailUrl
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

function adminQuizAddQuestionHelper(
  sessionId: number,
  quizId: number,
  questionBody: QuestionBody
): { questionId: number } | error {
  const body = { token: sessionId, questionBody: questionBody };

  const res = request('POST', `${url}:${port}/v1/admin/quiz/${quizId}/question`,
    { json: body }
  );

  const result = JSON.parse(res.body as string);

  if ('error' in result) {
    return result;
  } else {
    return { questionId: result.questionId };
  }
}

function adminQuizAddQuestionHelperV2(
  sessionId: number,
  quizId: number,
  questionBody: QuestionBody
): { questionId: number } | error {
  const body = { questionBody: questionBody };

  const res = request('POST', `${url}:${port}/v2/admin/quiz/${quizId}/question`,
    { json: body, headers: { token: sessionId.toString() } }
  );

  const result = JSON.parse(res.body as string);

  if ('error' in result) {
    return result;
  } else {
    return { questionId: result.questionId };
  }
}

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
    return result;
  } else {
    return { questionId: result.questionId };
  }
}

function adminQuizDuplicateQuestionHelperV2(
  sessionId: number,
  quizId: number,
  questionId: number
): { questionId: number } | error {
  const res = request(
    'POST', `${url}:${port}/v2/admin/quiz/${quizId}/question/${questionId}/duplicate`,
    { headers: { token: sessionId.toString() } }
  );

  const result = JSON.parse(res.body as string);

  if ('error' in result) {
    return result;
  } else {
    return { questionId: result.questionId };
  }
}

function adminQuizSessionStartHelper(quizId: number, token: number, autoStartNum: number) : {sessionId: number} | error {
  const res = request('POST', `${url}:${port}/v2/admin/quiz/${quizId}/session/start`, 
    {headers: {token: token.toString()}, json: {autoStartNum : autoStartNum.toString()}}
  );

  const result = JSON.parse(res.body as string);

  if ('error' in result) {
    return result;
  } else {
    return { sessionId: result.sessionId };
  }
}

function adminQuizSessionUpdateHelper(quizId: number, token: number, sessionId: number, action: Action) : {} | error {
  const res = request('PUT', `${url}:${port}/v2/admin/quiz/${quizId}/session/${sessionId}`, 
    {headers: {token: token.toString()}, json: {action : action}}
  );

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
  adminQuizNameUpdateHelperV2,
  adminQuizDescriptionUpdateHelper,
  adminQuizDescriptionUpdateHelperV2,
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
  adminQuizAddQuestionHelperV2,
  adminQuizDuplicateQuestionHelper,
  adminQuizDuplicateQuestionHelperV2,
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
};
