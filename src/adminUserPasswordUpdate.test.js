import {clear} from "./other.js";
import {adminUserPasswordUpdate, adminAuthRegister} from "./auth";
import {expect, test} from '@jest/globals';

describe("adminUserPasswordUpdate", () => {
  let userId;
  const email = "john@gmail.com";
  const nameFirst = "John";
  const nameLast = "Smith";
  const originalPassword = "Brooklyn99";
  const invalidId = -1;

  beforeEach(() => {
    clear();
    userId = adminAuthRegister(email, originalPassword, nameFirst, nameLast);
    console.log(userId, email, nameFirst, nameLast, originalPassword);
  });

  describe('success cases', () => {
    test('changed password to another password.',() => {
      expect(adminUserPasswordUpdate(userId, originalPassword, "AnotherTvShow1")).toStrictEqual({});
    });

    test('changed password to a similar password', () => {
      expect(adminUserPasswordUpdate(userId, originalPassword, "Brooklyn98")).toStrictEqual({});
    });
  });
    
  describe('failure cases', () =>{
    test('authUserId is not valid.', () => {
      expect(adminUserPasswordUpdate(invalidId, originalPassword, "Brooklyn98")).not.toStrictEqual({});
    });

    test('Old Password is not the correct old password', () => {
      expect(adminUserPasswordUpdate(invalidId, "Brooklyn981", "Brooklyn98")).not.toStrictEqual({});
    });

    test('Old Password and New Password match exactly', () => {
      expect(adminUserPasswordUpdate(invalidId, originalPassword, "Brooklyn99")).not.toStrictEqual({});
    });

    test('New Password has already been used before by this user', () => {
      adminUserPasswordUpdate(userId, originalPassword, "AnotherTvShow1");
      expect(adminUserPasswordUpdate(userId, "AnotherTvShow1", originalPassword)).not.toStrictEqual({});
    });

    test('New Password is less than 8 characters', () => {
      expect(adminUserPasswordUpdate(invalidId, originalPassword, "boo1")).not.toStrictEqual({});
    });

    test('New Password does not contain at least one number and at least one letter', () => {
      expect(adminUserPasswordUpdate(invalidId, originalPassword, "Brooklynninenien")).not.toStrictEqual({});
    });
  });  
});