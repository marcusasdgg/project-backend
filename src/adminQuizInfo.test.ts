import { describe, expect, test, beforeEach } from "@jest/globals";
import { clear } from "./other";
import {
  adminQuizCreate,
  adminQuizRemove,
  adminQuizInfo,
  adminQuizNameUpdate,
  adminQuizDescriptionUpdate,
} from "./quiz";
import { adminAuthRegister } from "./auth";

describe("adminQuizInfo", () => {
  let userId: number;
  let quizId: number;
  let userId1: number;
  let quizMinId: number;
  let quizMaxId: number;

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

    const quizCreateResponse = adminQuizCreate(
      userId,
      "Cards",
      "Good game of thirteen"
    );

    if ("quizId" in quizCreateResponse) {
      quizId = quizCreateResponse.quizId;
    }

    const quizCreateResponse1 = adminQuizCreate(userId, "Hue", "i");

    if ("quizId" in quizCreateResponse1) {
      quizMinId = quizCreateResponse1.quizId;
    }
    const quizCreateResponse2 = adminQuizCreate(
      userId,
      "Legend of the Ancient Kingdoms",
      "Embark on an epic adventure to uncover ancient secrets and save the kingdom from impending darkness."
    );

    if ("quizId" in quizCreateResponse2) {
      quizMaxId = quizCreateResponse2.quizId;
    }

    const registerResponse1 = adminAuthRegister(
      "user2@tookah.com",
      "Goodpasswordgood2",
      "Super",
      "Superman"
    );

    if ("authUserId" in registerResponse1) {
      userId1 = registerResponse1.authUserId;
    }
  });

  describe("Successsful Cases", () => {
    test("valid userId, valid quizId", () => {
      expect(adminQuizInfo(userId, quizId)).toStrictEqual({
        quizId: quizId,
        name: expect.any(String),
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: "Good game of thirteen",
      });
    });

    test("min values", () => {
      expect(adminQuizInfo(userId, quizMinId)).toStrictEqual({
        quizId: quizMinId,
        name: expect.any(String),
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: "i",
      });
    });

    test("max values", () => {
      expect(adminQuizInfo(userId, quizMaxId)).toStrictEqual({
        quizId: quizMaxId,
        name: expect.any(String),
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description:
          "Embark on an epic adventure to uncover ancient secrets and save the kingdom from impending darkness.",
      });
    });

    test("quiz info on removed quiz", () => {
      adminQuizRemove(userId, quizId);
      expect(adminQuizInfo(userId, quizId)).toStrictEqual({
        error: expect.any(String),
      });
    });

    test("check if quizEdit is working properly with adminQuizDescriptionUpdate", () => {
      adminQuizDescriptionUpdate(userId, quizId, "im not happy :(");
      adminQuizDescriptionUpdate(userId, quizId, "im happy now :)");
      expect(adminQuizInfo(userId, quizId)).toStrictEqual({
        quizId: quizId,
        name: expect.any(String),
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: "im happy now :)",
      });
    });

    test("check if quizEdit is working properly with adminQuizNameUpdate", () => {
      adminQuizNameUpdate(userId, quizId, "no");
      adminQuizNameUpdate(userId, quizId, "yes");
      expect(adminQuizInfo(userId, quizId)).toStrictEqual({
        quizId: quizId,
        name: expect.any(String),
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: "Good game of thirteen",
      });
    });
  });

  describe("Failure Cases", () => {
    test("Invalid userID, Invalid quizID", () => {
      expect(adminQuizInfo(-1, -1)).toStrictEqual({
        error: expect.any(String),
      });
    });

    test("Invalid userID, valid quizID", () => {
      expect(adminQuizInfo(-1, quizId)).toStrictEqual({
        error: expect.any(String),
      });
    });

    test("Valid userID, Invalid quizID", () => {
      expect(adminQuizInfo(userId, -1)).toStrictEqual({
        error: expect.any(String),
      });
    });

    test("Valid quizID, not owned by authUserId", () => {
      expect(adminQuizInfo(userId1, quizId)).toStrictEqual({
        error: expect.any(String),
      });
    });
  });
});
