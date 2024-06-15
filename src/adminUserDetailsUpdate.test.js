import {clear} from "./other.js"
import {adminAuthRegister} from "./auth.js"
import {expect, test} from '@jest/globals';
import { adminQuizCreate } from "./quiz.js";

describe('admin UserDetailsUpdate', () => {
  beforeEach(() => {
    clear();
  });

  describe('success cases', () => {
    test('general checking if authid has fields changed.', () => {
      const userId = adminAuthRegister("john@gmail.com", "John123", "John", "Smith");
      adminUserDetailsUpdate(userId, "john1@gmail.com","Jorn", "Smoth");
      const user = adminUserDetails(userId);
      const fullName = user.user.name;
      const email = user.user.email;
      expect(fullName).toStrictEqual("Jorn Smoth");
      expect(email).toStrictEqual("john1@gmail.com");
    });

    test('update details but do not change anything.', () => {
        const userId = adminAuthRegister("john@gmail.com", "John123", "John", "Smith");
        adminUserDetailsUpdate(userId, "john@gmail.com","John", "Smith");
        const user = adminUserDetails(userId);
        const fullName = user.user.name;
        const email = user.user.email;
        expect(fullName).toStrictEqual("John Smith");
        expect(email).toStrictEqual("john@gmail.com");
    });
  });

  describe('failure cases', () => {
    test('AuthId is not valid', () => {
      
    });

    test('email is not valid', () => {

    });

    test('namefirst contains invalid characters', () => {

    });

    test('namelast contains invalid characters', () => {

    });

    test('namefirst is not within the valid range of character length', () => {

    });

    test('namelast is not within the valid range of character length', () => {

    });
  })

});