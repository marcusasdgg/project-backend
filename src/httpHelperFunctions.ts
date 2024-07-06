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
  return JSON.parse(res.body as string);
}



export {adminAuthRegisterHelper};

