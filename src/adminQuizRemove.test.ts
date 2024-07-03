import { describe, expect, test, beforeEach } from "@jest/globals";
import { clear } from "./other";
import { adminQuizCreate, adminQuizList, adminQuizRemove } from "./quiz";
import { adminAuthRegister } from "./auth";
import { quiz, quizListReturn } from "./interface";

describe("adminQuizRemove", () => {
  let userId: number;

  beforeEach(() => {
    clear();
    const registerResponse = adminAuthRegister(
      "user1@tookah.com",
      "Badpasswordbad1",
      "Bat",
      "Batman"
    );

    if ("authUserId" in registerResponse) {
      userId = registerResponse.authUserId;
    }
  });

  describe("Successsful Cases", () => {
    test("removed one quiz successfully", () => {
      const quizId = adminQuizCreate(userId, "Kelly", "Kelly Kills Keys");

      if ("quizId" in quizId) {
        expect(adminQuizRemove(userId, quizId.quizId)).toStrictEqual({});
        const quizList = adminQuizList(userId);
        if ("quizzes" in quizList) {
          expect(
            quizList.quizzes.find((quiz: quiz) => quiz.quizId === quizId.quizId)
          ).toStrictEqual(undefined);
        }
      }
    });

    test("removed two quizes successfully", () => {
      const quizId = adminQuizCreate(userId, "Kelly", "Kelly Kills Keys");
      const quizId1 = adminQuizCreate(userId, "Bill", "Kill Bill Kill");
      if ("quizId" in quizId && "quizId" in quizId1) {
        expect(adminQuizRemove(userId, quizId.quizId)).toStrictEqual({});

        const quizList = adminQuizList(userId);
        if ("quizzes" in quizList) {
          expect(
            quizList.quizzes.find((quiz: quiz) => quiz.quizId === quizId.quizId)
          ).toStrictEqual(undefined);
        }

        expect(adminQuizRemove(userId, quizId1.quizId)).toStrictEqual({});
        const quizList1 = adminQuizList(userId);
        if ("quizzes" in quizList1) {
          expect(
            quizList1.quizzes.find(
              (quiz: quiz) => quiz.quizId === quizId1.quizId
            )
          ).toStrictEqual(undefined);
        }
      }
    });

    test("removed three quizes successfully", () => {
      const quizId = adminQuizCreate(userId, "Kelly", "Kelly Kills Keys");
      const quizId1 = adminQuizCreate(userId, "Bill", "Kill Bill Kill");
      const quizId2 = adminQuizCreate(userId, "Hello", "Hello Bello Bello");

      if ("quizId" in quizId && "quizId" in quizId1 && "quizId" in quizId2) {
        expect(adminQuizRemove(userId, quizId.quizId)).toStrictEqual({});
        const quizList = adminQuizList(userId);
        if ("quizzes" in quizList) {
          expect(
            quizList.quizzes.find((quiz: quiz) => quiz.quizId === quizId.quizId)
          ).toStrictEqual(undefined);
        }

        expect(adminQuizRemove(userId, quizId1.quizId)).toStrictEqual({});
        const quizList1 = adminQuizList(userId);
        if ("quizzes" in quizList1) {
          expect(
            quizList1.quizzes.find(
              (quiz: quiz) => quiz.quizId === quizId1.quizId
            )
          ).toStrictEqual(undefined);
        }

        expect(adminQuizRemove(userId, quizId2.quizId)).toStrictEqual({});
        const quizList2 = adminQuizList(userId);
        if ("quizzes" in quizList2) {
          expect(
            quizList2.quizzes.find(
              (quiz: quiz) => quiz.quizId === quizId2.quizId
            )
          ).toStrictEqual(undefined);
        }
      }
    });
  });

  describe("Failure Cases", () => {
    test("Invalid userID, Invalid quizID", () => {
      expect(adminQuizRemove(-1, -1)).toStrictEqual({
        error: expect.any(String),
      });
    });

    test("Invalid userID, valid quizID", () => {
      const quizId = adminQuizCreate(userId, "Kelly", "Kelly Kills Keys");
      if ("quizId" in quizId) {
        expect(adminQuizRemove(-1, quizId.quizId)).toStrictEqual({
          error: expect.any(String),
        });
      }
    });

    test("Valid userID, Invalid quizID", () => {
      expect(adminQuizRemove(userId, -1)).toStrictEqual({
        error: expect.any(String),
      });
    });

    test("Valid quizID, not owned by authUserId", () => {
      const quizId = adminQuizCreate(userId, "Kelly", "Kelly Kills Keys");
      const userId1 = adminAuthRegister(
        "user2@tookah.com",
        "Goodpasswordgood2",
        "Super",
        "Superman"
      );

      if ("authUserId" in userId1 && "quizId" in quizId) {
        expect(
          adminQuizRemove(userId1.authUserId, quizId.quizId)
        ).toStrictEqual({
          error: expect.any(String),
        });
      }
    });
  });
});
