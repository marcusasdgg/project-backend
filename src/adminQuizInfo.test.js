import { describe, expect, test, beforeEach } from '@jest/globals';
import { clear } from "./other.js";
import { adminQuizCreate, adminQuizRemove, adminQuizInfo, adminQuizNameUpdate, adminQuizDescriptionUpdate } from "./quiz.js";
import { adminAuthRegister } from "./auth.js";

describe("adminQuizInfo", () => {
  let userId;
  let quizId;
  let userId2;
  let quizMinId;
  let quizMaxId;

  beforeEach(() => {
    clear();
    userId = adminAuthRegister(
      "user1@tookah.com",
      "Badpasswordbad1",
      "Bat",
      "Batman"
    );
    quizId = adminQuizCreate(
      userId.authUserId, 
      "Cards", 
      "Good game of thirteen"
    );
    quizMinId = adminQuizCreate(
      userId.authUserId, 
      "Hue", 
      "i"
    );
    quizMaxId = adminQuizCreate(
      userId.authUserId, 
      "Legend of the Ancient Kingdoms", 
      "Embark on an epic adventure to uncover ancient secrets and save the kingdom from impending darkness."
    );
    userId2 = adminAuthRegister(
      "user2@tookah.com",
      "Goodpasswordgood2",
      "Super",
      "Superman"
    );
  });

  describe('Successsful Cases', () => {
    test('valid userId, valid quizId', () => {
      expect(adminQuizInfo(userId.authUserId, quizId.quizId)).toStrictEqual({
        quizId: quizId.quizId,
        name: 'Cards',
        timeCreated: quizId.timeCreated,
        timeLastEdited: quizId.timeLastEdited,
        description: 'Good game of thirteen',
      });
    });

    test('min values', () => {
      expect(adminQuizInfo(userId.authUserId, quizMinId.quizId)).toStrictEqual({
        quizId: quizMinId.quizId,
        name: 'Hue',
        timeCreated: quizMinId.timeCreated,
        timeLastEdited: quizMinId.timeLastEdited,
        description: 'i',
      });
    });


    test('max values', () => {
      expect(adminQuizInfo(userId.authUserId, quizMaxId.quizId)).toStrictEqual({
        quizId: quizMaxId.quizId,
        name: 'Legend of the Ancient Kingdoms',
        timeCreated: quizMaxId.timeCreated,
        timeLastEdited: quizMaxId.timeLastEdited,
        description: 'Embark on an epic adventure to uncover ancient secrets and save the kingdom from impending darkness.',
      });
    });

    test('quiz info on removed quiz', () => {
      adminQuizRemove(userId.authUserId, quizId.quizId);
      expect(adminQuizInfo(userId.authUserId, quizId.quizId)).toStrictEqual({ error: "quiz has been deleted :p" });
    });

    test('check if quizEdit is working properly with adminQuizDescriptionUpdate', () => {
      const edit1 = adminQuizDescriptionUpdate(userId.authUserId, quizId.quizId, 'im not happy :(');
      const edit2 = adminQuizDescriptionUpdate(userId.authUserId, quizId.quizId, 'im happy now :)');
      expect(adminQuizInfo(userId.authUserId, quizId.quizId)).toStrictEqual({ 
        quizId: quizId.quizId,
        name: 'Cards',
        timeCreated: quizId.timeCreated,
        timeLastEdited: quizId.timeLastEdited,
        description: 'im happy now :)',
      });
    });

    test('check if quizEdit is working properly with adminQuizNameUpdate', () => {
      const edit1 = adminQuizNameUpdate(userId.authUserId, quizId.quizId, 'no');
      const edit2 = adminQuizNameUpdate(userId.authUserId, quizId.quizId, 'yes');
      expect(adminQuizInfo(userId.authUserId, quizId.quizId)).toStrictEqual({ 
        quizId: quizId.quizId,
        name: 'yes',
        timeCreated: quizId.timeCreated,
        timeLastEdited: quizId.timeLastEdited,
        description: 'Good game of thirteen',
      });
    });
  });

  describe('Failure Cases', () => {
    test('Invalid userID, Invalid quizID', () => {
      expect(adminQuizInfo(-1, -1)).toStrictEqual({ error: "invalid userID & quizID" });
    });

    test('Invalid userID, valid quizID', () => {
      expect(adminQuizInfo(-1, quizId.quizId)).toStrictEqual({ error: "invalid userID" }); 
    });

    test('Valid userID, Invalid quizID', () => {
      expect(adminQuizInfo(userId.authUserId, -1)).toStrictEqual({ error: "invalid quizID" }); 
    });

    test('Valid quizID, not owned by authUserId', () => {
      expect(adminQuizInfo(userId2.authUserId, quizId.quizId)).toStrictEqual({ error: "quizId not owned by authUserId" }); 
    });
  });
});