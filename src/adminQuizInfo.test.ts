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
  let sessionId: number;
  let quizId: number;
  let sessionId1: number;
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
    if ("sessionId" in registerResponse) {
      sessionId = registerResponse.sessionId;
    }

    const registerResponse1 = adminAuthRegister(
      "user2@tookah.com",
      "Goodpasswordgood2",
      "Super",
      "Superman"
    );

    if ("sessionId" in registerResponse1) {
      sessionId1 = registerResponse1.sessionId;
    }

    const quizCreateResponse = adminQuizCreate(
      sessionId,
      "Cards",
      "Good game of thirteen"
    );

    if ("quizId" in quizCreateResponse) {
      quizId = quizCreateResponse.quizId;
    }

    const quizCreateResponse1 = adminQuizCreate(sessionId, "Hue", "i");

    if ("quizId" in quizCreateResponse1) {
      quizMinId = quizCreateResponse1.quizId;
    }
    const quizCreateResponse2 = adminQuizCreate(
      sessionId,
      "Legend of the Ancient Kingdoms",
      "Embark on an epic adventure to uncover ancient secrets and save the kingdom from impending darkness."
    );

    if ("quizId" in quizCreateResponse2) {
      quizMaxId = quizCreateResponse2.quizId;
    }
  });

  describe("Successsful Cases", () => {
    test("valid sessionId, valid quizId", () => {
      expect(adminQuizInfo(sessionId, quizId)).toStrictEqual({
        quizId: quizId,
        name: expect.any(String),
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: "Good game of thirteen",
      });
    });

    test("min values", () => {
      expect(adminQuizInfo(sessionId, quizMinId)).toStrictEqual({
        quizId: quizMinId,
        name: expect.any(String),
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: "i",
      });
    });

    test("max values", () => {
      expect(adminQuizInfo(sessionId, quizMaxId)).toStrictEqual({
        quizId: quizMaxId,
        name: expect.any(String),
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description:
          "Embark on an epic adventure to uncover ancient secrets and save the kingdom from impending darkness.",
      });
    });

    test("quiz info on removed quiz", () => {
      adminQuizRemove(sessionId, quizId);
      expect(adminQuizInfo(sessionId, quizId)).toStrictEqual({
        error: expect.any(String),
      });
    });

    test("check if quizEdit is working properly with adminQuizDescriptionUpdate", () => {
      adminQuizDescriptionUpdate(sessionId, quizId, "im not happy :(");
      adminQuizDescriptionUpdate(sessionId, quizId, "im happy now :)");
      expect(adminQuizInfo(sessionId, quizId)).toStrictEqual({
        quizId: quizId,
        name: expect.any(String),
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: "im happy now :)",
      });
    });

    test("check if quizEdit is working properly with adminQuizNameUpdate", () => {
      adminQuizNameUpdate(sessionId, quizId, "no");
      adminQuizNameUpdate(sessionId, quizId, "yes");
      expect(adminQuizInfo(sessionId, quizId)).toStrictEqual({
        quizId: quizId,
        name: expect.any(String),
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: "Good game of thirteen",
      });
    });
  });

  describe("Failure Cases", () => {
    test("Invalid sessionID, Invalid quizID", () => {
      let invalidSessionId = sessionId  + sessionId1 + 1;
      let invalidQuizId = quizId  + quizMaxId + 1;
      expect(adminQuizInfo(invalidSessionId, invalidQuizId)).toStrictEqual({
        error: expect.any(String),
      });
    });

    test("Invalid sessionID, valid quizID", () => {
      let invalidSessionId = sessionId  + sessionId1 + 1;
      expect(adminQuizInfo(invalidSessionId, quizId)).toStrictEqual({
        error: expect.any(String),
      });
    });

    test("Valid sessionID, Invalid quizID", () => {
      let invalidQuizId = quizId  + quizMaxId + 1;
      expect(adminQuizInfo(sessionId, invalidQuizId )).toStrictEqual({
        error: expect.any(String),
      });
    });

    test("Valid quizID, not owned by sessionId", () => {
      expect(adminQuizInfo(sessionId1, quizId)).toStrictEqual({
        error: expect.any(String),
      });
    });
  });
});
