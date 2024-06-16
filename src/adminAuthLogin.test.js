import { describe, expect, test, beforeEach } from "@jest/globals";
import { adminAuthLogin, adminAuthRegister} from "./auth";
import { clear } from "./other";

describe('testing adminAuthLogin function', () => {
  let validEmail;
  let validPassword;
  let invalidEmail = 'invalidemaildoesnotexistanywhereatalllll@exist.com';
  let invalidPassword = 'passwordDoesNotExistInTheDatabase12321';

  beforeEach(() => {
    clear();
    // Register a user to get a valid email and password in the datastore
    const { email, password } = adminAuthRegister(
      "validuser@example.com",
      "ValidPassword123",
      "Bob",
      "Jones"
    );
    validEmail = email;
    validPassword = password;
  });

  describe('testing failure case', () => {
    test('test for invalid email with valid password', () => {
      let email = 'thisemaildoesnotexistatallanywhere@invalidemail.com';
      let password = validPassword;
      expect(adminAuthLogin(email, password)).toEqual({ error: expect.any(String) });
    });

    test('test for valid email with invalid password', () => {
      let email = validEmail;
      let password = 'thispassworddoesnotexistatall1';
      expect(adminAuthLogin(email, password)).toEqual({ error: expect.any(String) });
    });

    test('test for invalid email and invalid password', () => {
      let email = invalidEmail;
      let password = invalidPassword;
      expect(adminAuthLogin(email, password)).toEqual({ error: expect.any(String) });
    });
  });

  describe('testing success case', () => {
    test('testing for an email that is valid', () => {
      let email = validEmail;
      let password = validPassword;
      expect(adminAuthLogin(email, password)).toEqual(expect.any(Number));
    });
  });
});