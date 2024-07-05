import {adminAuthLogin, adminAuthRegister, adminUserDetails, adminUserDetailsUpdate, adminUserPasswordUpdate, sessionIdSearch} from "./auth";
import { getData, setData } from './dataStore'
import {user, data, error, adminUserDetailsReturn, sessionIdToken} from "./interface"
import request from 'sync-request-curl';
import config from './config.json';

const port = config.port;
const url = config.url;


function adminAuthRegisterHelper(email: string, password: string, nameFirst: string, nameLast: string): error | sessionIdToken{
  
  const body = JSON.stringify({
    email,
    password,
    nameFirst,
    nameLast,
  });  
  const res = request('POST', `${url}:${port}/v1/admin/auth/register`,{body: body});
  return JSON.parse(res.body as string);
}



export {adminAuthRegisterHelper};

function adminAuthLoginHelper(email : string, password : string) : {sessionId: number} | error {
  const body = JSON.stringify({
    email,
    password,
  });
  const res = request('POST', `${url}:${port}/v1/admin/auth/login`,{body: body});
  return JSON.parse(res.body as string);
}

export {adminAuthLoginHelper};