import {
  user,
  data,
  error,
  adminUserDetailsReturn,
  sessionIdToken,
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
    nameFirst: nameLast,
    nameLast: nameFirst,
  };
  const res = request("POST", `${url}:${port}/v1/admin/auth/register`, {
    json: body,
  });
  let result = JSON.parse(res.body as string);
  if ("error" in result) {
    return result;
  } else {
    return { sessionId: result.token };
  }
}

function clearHelper(): {} {
  const res = request('DELETE',`${url}:${port}/v1/clear`);
  return JSON.parse(res.body as string);
}

function adminUserDetailsUpdateHelper(sessionId: number, email : string, nameFirst : string, nameLast : string): error | {} {
  const body = {
    token: sessionId,
    email: email,
    nameFirst: nameFirst,
    nameLast: nameLast
  }
  const resd = request('PUT', `${url}:${port}/v1/admin/user/details`, {
    json: body
  });

  const res = JSON.parse(resd.body as string);

  if ('error' in res){
    return res;
  } else {
    return {};
  }
}

function adminUserPasswordUpdateHelper(sessionId : number, oldPassword : string, newPassword : string){
  const body = {
    token: sessionId,
    oldPassword: oldPassword,
    newPassword: newPassword,
  }

  const resd = request('PUT', `${url}:${port}/v1/admin/user/password`, {
    json: body
  });

  const res = JSON.parse(resd.body as string);

  if ('error' in res){
    return res;
  } else {
    return {};
  }
}

function adminAuthLoginHelper(email: string, password: string): {sessionId: number} | error {
  const body = {
    email: email,
    password: password,
  };

  const res = request('POST', `${url}:${port}/v1/admin/auth/login`, {json: body });
  let response = JSON.parse(res.body as string);
  if ('error' in response) {
    return response;
  } else {
    return {sessionId : response.token}
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

  const res = request("PUT", `${url}:${port}/v1/admin/quiz/${quizId}/name`, {
    json: body,
  });

  let result = JSON.parse(res.body as string);
  console.log(result);
  if ("error" in result) {
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
    "PUT",
    `${url}:${port}/v1/admin/quiz/${quizId}/description`,
    {
      json: body,
    }
  );

  let result = JSON.parse(res.body as string);

  if ("error" in result) {
    return result;
  } else {
    return {};
  }
 }

function adminUserDetailsHelper(sessionId: number): adminUserDetailsReturn | error {
  const body = {
    sessionId: sessionId,
  };
  const res = request('PUT', `${url}:${port}/v1/admin/user/details`, {
    json: body
  });
  let result = JSON.parse(res.body as string);
  if ('error' in result) {
    return result;
  } else {
    return result;
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
};
