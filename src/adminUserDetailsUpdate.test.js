import {clear} from "./other.js"
import {adminAuthRegister, adminUserDetails, adminUserDetailsUpdate} from "./auth.js"
import {expect, test} from '@jest/globals';
import { adminQuizCreate } from "./quiz.js";

describe('admin UserDetailsUpdate', () => {
  beforeEach(() => {
    clear();
  });

  describe('success cases', () => {
    test.skip('general checking if authid has fields changed.', () => {
      let userId = adminAuthRegister("john@gmail.com", "John12345678910", "John", "Smith");
      expect(adminUserDetailsUpdate(userId, "john@gmail.com","John", "Smith")).not.toStrictEqual({error: expect.any(String)});
      const user = adminUserDetails(userId);
      const fullName = user.user.name;
      const email = user.user.email;
      expect(fullName).toStrictEqual("Jorn Smoth");
      expect(email).toStrictEqual("john1@gmail.com");
    });

    test.skip('update details but do not change anything.', () => {
        const userId = adminAuthRegister("john@gmail.com", "John12345678910", "John", "Smith");
        expect(adminUserDetailsUpdate(userId, "john@gmail.com","John", "Smith")).not.toStrictEqual({error: expect.any(String)});
        const user = adminUserDetails(userId);
        const fullName = user.user.name;
        const email = user.user.email;
        expect(fullName).toStrictEqual("John Smith");
        expect(email).toStrictEqual("john@gmail.com");
    });
  });

  describe('failure cases', () => {
    test('AuthId is not valid', () => {
      adminAuthRegister("john@gmail.com", "John12345678", "John", "Smith");
      expect(adminUserDetailsUpdate(-1, "john@gmail.com","John", "Smith")).toStrictEqual({error: expect.any(String)});
    });

    test('email is not valid', () => {
      const userId = adminAuthRegister("john@gmail.com", "John12345678", "John", "Smith");
      expect(adminUserDetailsUpdate(userId, "a@.com","John", "Smith")).toStrictEqual({error: expect.any(String)});
    });

    test('email is used by other user', () => {
      const userId = adminAuthRegister("john@gmail.com", "John12345678", "John", "Smith");
      console.log(adminAuthRegister("lowJ@gmail.com", "John12345678", "John", "Smoth"));
      expect(adminUserDetailsUpdate(userId, "lowJ@gmail.com","John", "Smith")).toStrictEqual({error: expect.any(String)});
      
    });

    test('namefirst contains invalid characters', () => {
      const userId = adminAuthRegister("john@gmail.com", "John12345678", "John", "Smith");
      expect(adminUserDetailsUpdate(userId, "john@gmail.com","John1", "Smith")).toStrictEqual({error: expect.any(String)});
    });

    test('namelast contains invalid characters', () => {
      const userId = adminAuthRegister("john@gmail.com", "John12345678", "John", "Smith1");
      expect(adminUserDetailsUpdate(userId, "john@gmail.com","John1", "Smith")).toStrictEqual({error: expect.any(String)});
    });

    test('namefirst is 1 character', () => {
      const userId = adminAuthRegister("john@gmail.com", "John12345678", "J", "Smith");
      expect(adminUserDetailsUpdate(userId, "john@gmail.com","John1", "Smith")).toStrictEqual({error: expect.any(String)});
    });

    test('namefirst is more than 20 characters', () => {
      const userId = adminAuthRegister("john@gmail.com", "John12345678", "abcdefghijklmnopqrstuvwxyz", "Smith");
      expect(adminUserDetailsUpdate(userId, "john@gmail.com","John1", "Smith")).toStrictEqual({error: expect.any(String)});
    });

    test('namelast is more than 20 characters', () => {
      const userId = adminAuthRegister("john@gmail.com", "John12345678", "John", "abcdefghijklmnopqrstuvwxyz");
      expect(adminUserDetailsUpdate(userId, "john@gmail.com","John1", "Smith")).toStrictEqual({error: expect.any(String)});
    });

    test('namelast is less than 2 character', () => {
      const userId = adminAuthRegister("john@gmail.com", "John12345678", "John", "a");
      expect(adminUserDetailsUpdate(userId, "john@gmail.com","John1", "Smith")).toStrictEqual({error: expect.any(String)});
    });
  })

});