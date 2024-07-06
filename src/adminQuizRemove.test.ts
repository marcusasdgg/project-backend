import { describe, expect, test, beforeEach } from "@jest/globals";
import { clear } from "./other";
import { adminQuizCreate, adminQuizList, adminQuizRemove } from "./quiz";
import { adminAuthRegister } from "./auth";
import { quiz, quizListReturn } from "./interface";

describe("adminQuizRemove", () => {
  let sessionId: number;

  beforeEach(() => {
    clear();
    const registerResponse = adminAuthRegister(
      "user1@tookah.com",
      "Badpasswordbad1",
      "Bat",
      "Batman"
    );

    if ("sessionId" in registerResponse) {
      sessionId = registerResponse.sessionId;
    }
  });

  describe("Successsful Cases", () => {
    test("removed one quiz successfully", () => {
      const quizId = adminQuizCreate(sessionId, "Kelly", "Kelly Kills Keys");

      if ("quizId" in quizId) {
        expect(adminQuizRemove(sessionId, quizId.quizId)).toStrictEqual({});
        const quizList = adminQuizList(sessionId);
        if ("quizzes" in quizList) {
          expect(
            quizList.quizzes.find((quiz: quiz) => quiz.quizId === quizId.quizId)
          ).toStrictEqual(undefined);
        }
      }
    });

    test("removed two quizes successfully", () => {
      const quizId = adminQuizCreate(sessionId, "Kelly", "Kelly Kills Keys");
      const quizId1 = adminQuizCreate(sessionId, "Bill", "Kill Bill Kill");
      if ("quizId" in quizId && "quizId" in quizId1) {
        expect(adminQuizRemove(sessionId, quizId.quizId)).toStrictEqual({});

        const quizList = adminQuizList(sessionId);
        if ("quizzes" in quizList) {
          expect(
            quizList.quizzes.find((quiz: quiz) => quiz.quizId === quizId.quizId)
          ).toStrictEqual(undefined);
        }

        expect(adminQuizRemove(sessionId, quizId1.quizId)).toStrictEqual({});
        const quizList1 = adminQuizList(sessionId);
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
      const quizId = adminQuizCreate(sessionId, "Kelly", "Kelly Kills Keys");
      const quizId1 = adminQuizCreate(sessionId, "Bill", "Kill Bill Kill");
      const quizId2 = adminQuizCreate(sessionId, "Hello", "Hello Bello Bello");

      if ("quizId" in quizId && "quizId" in quizId1 && "quizId" in quizId2) {
        expect(adminQuizRemove(sessionId, quizId.quizId)).toStrictEqual({});
        const quizList = adminQuizList(sessionId);
        if ("quizzes" in quizList) {
          expect(
            quizList.quizzes.find((quiz: quiz) => quiz.quizId === quizId.quizId)
          ).toStrictEqual(undefined);
        }

        expect(adminQuizRemove(sessionId, quizId1.quizId)).toStrictEqual({});
        const quizList1 = adminQuizList(sessionId);
        if ("quizzes" in quizList1) {
          expect(
            quizList1.quizzes.find(
              (quiz: quiz) => quiz.quizId === quizId1.quizId
            )
          ).toStrictEqual(undefined);
        }

        expect(adminQuizRemove(sessionId, quizId2.quizId)).toStrictEqual({});
        const quizList2 = adminQuizList(sessionId);
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
    test("Invalid sessionID, Invalid quizID", () => {
      expect(adminQuizRemove(-1, -1)).toStrictEqual({
        error: expect.any(String),
      });
    });

    test("Invalid sessionID, valid quizID", () => {
      const quizId = adminQuizCreate(sessionId, "Kelly", "Kelly Kills Keys");
      if ("quizId" in quizId) {
        expect(adminQuizRemove(-1, quizId.quizId)).toStrictEqual({
          error: expect.any(String),
        });
      }
    });

    test("Valid sessionID, Invalid quizID", () => {
      expect(adminQuizRemove(sessionId, -1)).toStrictEqual({
        error: expect.any(String),
      });
    });

    test("Valid quizID, not owned by sessionId", () => {
      const quizId = adminQuizCreate(sessionId, "Kelly", "Kelly Kills Keys");
      const sessionId1 = adminAuthRegister(
        "user2@tookah.com",
        "Goodpasswordgood2",
        "Super",
        "Superman"
      );

      if ("sessionId" in sessionId1 && "quizId" in quizId) {
        expect(
          adminQuizRemove(sessionId1.sessionId, quizId.quizId)
        ).toStrictEqual({
          error: expect.any(String),
        });
      }
    });
  });
});
