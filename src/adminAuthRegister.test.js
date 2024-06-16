import { describe, expect, test, beforeEach } from "@jest/globals";
import { adminAuthRegister } from "./auth";
 
beforeEach(()=> {
  clear();
})

// WONT I NEED TO GET INFORMATION OF REGISTERED USERS FROM DATATSTORE? WHERE IS THIS 

describe('testing adminAuthLogin function', () => { 
  describe('testing error case', () => {
    // how to make the password in the below condition right but the email wrong 
    test('test for invalid email', () => {
      const email = 'thisemaildoesnotexist@example.com'; // email is invalid
      const password = 'thispasswordisanexample3'; //password is valid
      expect(adminAuthLogin(email, password)).toStrictEqual({error: expect.any(String)});
    });
    //how to make the email in the below condition a vlid email and only the password wrong
    test('test for invalid password', () => {
      let email = '@example.com'; //email valid
      let password = 'thispassworddoesnotexistatall1'; //password invalid
      expect(adminAuthLogin(email, password)).toStrictEqual({error: expect.any(String)});
    })
    //third test should have incorrect email and password 
    test('test for invalid email and invalid password', () => {
      let email = 'invalidemaildoesnotexist@exist.com';
      let password = 'passwordDoesNotExist12321';
      expect(adminAuthLogin(email, password)).toStrictEqual({error: expect.any(String)});
    })
  })
  describe('success cases', () => {
    // correct email and password in this example
    test('testing for an email that is valid', () => {
      const credentials = AdminAuthRegister(email, password);
      })
    });
})
