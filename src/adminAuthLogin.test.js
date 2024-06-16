import { describe, expect, test, beforeEach } from "@jest/globals";
 
beforeEach(()=> {
  clear();
})

// WONT I NEED TO GET INFORMATION OF REGISTERED USERS FROM DATATSTORE? WHERE IS THIS 
// is it database.users.email??

describe('testing adminAuthLogin function', () => { 
  describe('testing error case', () => {
    // how to make the password in the below condition right but the email wrong 
    test('test for invalid email', () => {
      const email = 'thisemaildoesnotexist@example.com'; // email is invalid
      const password = ; //password is valid, i.e. it is in the datastore
      expect(adminAuthLogin(email, password)).toEqual({error: expect.any(String)});
    });
    //how to make the email in the below condition a valid email and only the password wrong
    test('test for invalid password', () => {
      let email = ; //email valid i.e. it is in the datastore
      let password = 'thispassworddoesnotexistatall1'; //password invalid
      expect(adminAuthLogin(email, password)).toEqual({error: expect.any(String)});
    })
    //third test should have incorrect email and password 
    test('test for invalid email and invalid password', () => {
      let email = 'invalidemaildoesnotexist@exist.com';
      let password = 'passwordDoesNotExist12321';
      expect(adminAuthLogin(email, password)).toEqual({error: expect.any(String)});
    })
  })

  describe('success case', () => {
    // correct email and password in this example, it would have returned a user ID value if success
    test('testing for an email that is valid', () => {
      const credentials = adminAuthRegister(email, password); //database.users.email? 
      expect(adminAuthLogin(email, password)).toEqual(expect.any(Number));
      })
    });
})

import {clear} from "./other.js"
import {adminAuthLogin, adminAuthRegister, adminUserDetails} from "./auth.js"


