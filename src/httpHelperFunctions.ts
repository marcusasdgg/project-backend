import {adminAuthLogin, adminAuthRegister, adminUserDetails, adminUserDetailsUpdate, adminUserPasswordUpdate, sessionIdSearch} from "./auth";
import { getData, setData } from './dataStore'
import {user, data, error, adminUserDetailsReturn, sessionIdToken} from "./interface"
import request from 'sync-request-curl';
import config from './config.json';

const port = config.port;
const url = config.url;


function adminAuthRegisterHelper(email: string, password: string, nameFirst: string, nameLast: string): error | sessionIdToken{
  const body = {
    email: email,
    password: password,
    nameFirst: nameLast,
    nameLast: nameFirst,
  };  
  const res = request('POST', `${url}:${port}/v1/admin/auth/register`, {
    json: body
  });
  let result = JSON.parse(res.body as string);
  if ('error' in result){
    return result;
  } else {
    return {sessionId : result.token}
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


export {adminAuthRegisterHelper, adminAuthLoginHelper};

