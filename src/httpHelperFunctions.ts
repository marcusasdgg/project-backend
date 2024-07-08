import {
  user,
  data,
  error,
  adminUserDetailsReturn,
  quizInfoReturn,
  sessionIdToken,
  QuestionBody,
  quizTrashReturn,
} from "./interface";
import request from "sync-request-curl";
import config from "./config.json";

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
  let result = JSON.parse(res.body as string);
  if ('error' in result) {
    return result;
  } else {
    return { sessionId: result.token };
  }
}

function clearHelper(): {} {
  const res = request('DELETE', `${url}:${port}/v1/clear`);
  return JSON.parse(res.body as string);
}

function adminUserDetailsUpdateHelper(
  sessionId: number,
  email: string,
  nameFirst: string,
  nameLast: string
): error | {} {
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
  let response = JSON.parse(res.body as string);
  if ('error' in response) {
    return response;
  } else {
    return { sessionId: response.token };
  }
  //  const response: error | {sessionId: number} = JSON.parse(res.body as string)
}

function adminQuizNameUpdateHelper(
  sessionId: number,
  quizId: number,
  name: string
): error | {} {
  const body = {
    token: sessionId,
    name: name,
  };

  const res = request('PUT', `${url}:${port}/v1/admin/quiz/${quizId}/name`, {
    json: body,
  });

  let result = JSON.parse(res.body as string);

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

  let result = JSON.parse(res.body as string);

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

  let result = JSON.parse(res.body as string);
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
  let result = JSON.parse(res.body as string);

  if ('error' in result) {
    return result;
  } else {
    return result;
  }
}

function adminQuizRestoreHelper(sessionId: number, quizId: number): {} | error {
  const body = {
    token: sessionId,
  }

  const res = request('POST', `${url}:${port}/v1/admin/quiz/${quizId}/restore`, {
    json: body,
  });
  let result = JSON.parse(res.body as string);
  if ("error" in result) {
    return result;
  } else {
    return {};
  }
}

function adminQuizRemoveHelper(sessionId: number, quizId: number): {} | error {
  const res = request('DELETE', `${url}:${port}/v1/admin/quiz/${quizId}`, {
    qs: { token: sessionId.toString() },
  });
  let result = JSON.parse(res.body as string);

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

function adminQuizTrashEmptyHelper(token: number, quizIds: number[]): any {
  const body = {
      token: token,
      quizIds: quizIds
  };

  const res = request('DELETE', `${url}:${port}/v1/admin/quiz/trash/empty`, {
      json: body
  });

  return JSON.parse(res.body as string);
}

function adminQuizQuestionMoveHelper(token: string, quizId: number, questionId: number, newPosition: number): any {
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

function adminQuizQuestionDeleteHelper(quizId: number, questionId: number, token: number) : {} | error {
  const res = request('DELETE',`${url}:${port}/v1/admin/quiz/${quizId}/question/${questionId}`, {
    qs: {token: token.toString()}
  })

  const result = JSON.parse(res.body as string);

  if ('error' in result){
    return result;
  } else {
    return {};
  }
}

function adminQuizQuestionUpdateHelper(quizId: number, questionId: number, token: number, questionBody: QuestionBody) : {} | error{
  const res = request('PUT',`${url}:${port}/v1/admin/quiz/${quizId}/question/${questionId}`, {
    json: {
      token: token,
      questionBody: questionBody
    }
  })

  const result = JSON.parse(res.body as string);

  if ('error' in result){
    return result;
  } else {
    return {};
  }
}


function adminAuthLogoutHelper(token: number): {} | error {
  const body = {
    token
  };

  const res = request('POST', `${url}:${port}/v1/admin/auth/logout`, {
    json: body
  });

  let result = JSON.parse(res.body as string);

  if ('error' in result) {
    return result;
  } else {
    return {};
  } 
}

function adminQuizTrashHelper(sessionId : number, quizId: number): quizTrashReturn | error {
  const res = request('GET', `${url}:${port}/v1/admin/quiz/trash`, {
    qs: { token: sessionId.toString() }
  });

  let result = JSON.parse(res.body as string);

  if ('error' in result) {
    return result;
  } else {
    return result;
  } 
}

function adminQuizAddQuestionHelper(
  sessionId: number,
  quizId: number,
  questionBody: QuestionBody
): { questionId: number } | error {
  const body = { token: sessionId, questionBody: questionBody };

  const res = request( 'POST', `${url}:${port}/v1/admin/quiz/${quizId}/question`,
    { json: body }
  );

  let result = JSON.parse(res.body as string);

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
): { questionId: number } | error {
  const res = request(
    'POST', `${url}:${port}/v1/admin/quiz/${quizId}/question/${questionId}/duplicate`,
    { qs: { token: sessionId } }
  );

  let result = JSON.parse(res.body as string);

  if ('error' in result) {
    return result;
  } else {
    return { questionId: result.questionId };
  }
}

export {
  clearHelper,
  adminAuthLoginHelper,
  adminUserPasswordUpdateHelper,
  adminAuthRegisterHelper,
  adminQuizNameUpdateHelper,
  adminQuizDescriptionUpdateHelper,
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
  adminQuizTrashHelper,
  adminQuizAddQuestionHelper,
  adminQuizDuplicateQuestionHelper,
  adminQuizQuestionUpdateHelper,
};
