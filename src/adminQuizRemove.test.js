import { describe, expect, test, beforeEach } from '@jest/globals';
import { clear } from "./other.js";
import { adminQuizCreate, adminQuizList, adminQuizRemove } from "./quiz.js";
import { adminAuthRegister } from "./auth.js";

describe("adminQuizRemove", () => {
  let userId;

  beforeEach(() => {
    clear();
    userId = adminAuthRegister(
      "user1@tookah.com",
      "Badpasswordbad1",
      "Bat",
      "Batman"
    );
  });

  describe("Successsful Cases", () => {
    test("removed one quiz successfully", () => {
      let quizId = adminQuizCreate(userId.authUserId, "Kelly", "Kelly Kills Keys");
      expect(adminQuizRemove(userId.authUserId, quizId.quizId)).toStrictEqual({});
      let quizList = adminQuizList(userId.authUserId);
      expect(quizList.quizzes.find(quiz => quiz.quizId === quizId.quizId)).toStrictEqual(undefined);
    });

    test("removed two quizes successfully", () => {
      let quizId = adminQuizCreate(userId.authUserId, "Kelly", "Kelly Kills Keys");
      let quizId1 = adminQuizCreate(userId.authUserId, "Bill", "Kill Bill Kill");

      expect(adminQuizRemove(userId.authUserId, quizId.quizId)).toStrictEqual({});
      let quizList = adminQuizList(userId.authUserId);
      expect(quizList.quizzes.find(quiz => quiz.quizId === quizId.quizId)).toStrictEqual(undefined);

      expect(adminQuizRemove(userId.authUserId, quizId1.quizId)).toStrictEqual({});
      let quizList1 = adminQuizList(userId.authUserId);
      expect(quizList1.quizzes.find(quiz => quiz.quizId === quizId1.quizId)).toStrictEqual(undefined);
    });

    test("removed three quizes successfully", () => {
      let quizId = adminQuizCreate(userId.authUserId, "Kelly", "Kelly Kills Keys");
      let quizId1 = adminQuizCreate(userId.authUserId, "Bill", "Kill Bill Kill");
      let quizId2 = adminQuizCreate(userId.authUserId, "Hello", "Hello Bello Bello");
      
      expect(adminQuizRemove(userId.authUserId, quizId.quizId)).toStrictEqual({});
      let quizList = adminQuizList(userId.authUserId);
      expect(quizList.quizzes.find(quiz => quiz.quizId === quizId.quizId)).toStrictEqual(undefined);

      expect(adminQuizRemove(userId.authUserId, quizId1.quizId)).toStrictEqual({});
      let quizList1 = adminQuizList(userId.authUserId);
      expect(quizList1.quizzes.find(quiz => quiz.quizId === quizId1.quizId)).toStrictEqual(undefined);

      expect(adminQuizRemove(userId.authUserId, quizId2.quizId)).toStrictEqual({});
      let quizList2 = adminQuizList(userId.authUserId);
      expect(quizList2.quizzes.find(quiz => quiz.quizId === quizId2.quizId)).toStrictEqual(undefined);
    });
  });

  describe("Failure Cases", () => {
    test("Invalid userID, Invalid quizID", () => {
      expect(adminQuizRemove(-1, -1)).toStrictEqual({ error: "invalid userID & quizID" });
    });

    test("Invalid userID, valid quizID", () => {
      let quizId = adminQuizCreate(userId.authUserId, "Kelly", "Kelly Kills Keys");
      expect(adminQuizRemove(-1, quizId.quizId)).toStrictEqual({ error: "invalid userID" }); 
    });

    test("Valid userID, Invalid quizID", () => {
      expect(adminQuizRemove(userId.userId, -1)).toStrictEqual({ error: "invalid quizID" }); 
    });

    test("Valid quizID, not owned by authUserId", () => {
      let quizId = adminQuizCreate(userId.authUserId, "Kelly", "Kelly Kills Keys");
      let userId1 = adminAuthRegister(
        "user2@tookah.com",
        "Goodpasswordgood2",
        "Super",
        "Superman"
      )
      expect(adminQuizRemove(userId1.userId, quizId.quizId)).toStrictEqual({ error: "quizId is not owned by authUserId" }); 
    });
  });
});