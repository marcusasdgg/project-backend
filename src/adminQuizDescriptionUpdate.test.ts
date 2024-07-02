import { describe, expect, test, beforeEach } from "@jest/globals";
import { adminAuthRegister } from "./auth";
import { clear } from "./other";
import {
  adminQuizCreate,
  adminQuizDescriptionUpdate,
  adminQuizInfo,
} from "./quiz";

describe("QuizDescriptionUpdate", () => {
  let validAuthUserId1: number;
  let validAuthUserId2: number;
  let validQuizId: number;

  const validDescription: string = "This description is 38 characters long";
  const extremeValidDescription: string =
    "This is a new description for this reeally fun Tookah quiz for" +
    "comp1511 students to start attending.";

  let invalidAuthUserId: number = -134534;
  let invalidQuizId: number = -133753;
  const invalidDescription: string =
    "This is a newer description for this really fun Tookah quiz for students to start attending lectures hahahah.";

  beforeEach(() => {
    clear();

    const registerResponse1 = adminAuthRegister(
      "user1@tookah.com",
      "iL0veT00kah",
      "Brian",
      "Bones"
    );

    if ("authUserId" in registerResponse1) {
      validAuthUserId1 = registerResponse1.authUserId;
    }

    const registerResponse2 = adminAuthRegister(
      "user2@tookah.com",
      "iLHateT00kah",
      "Bob",
      "Jones"
    );

    if ("authUserId" in registerResponse2) {
      validAuthUserId2 = registerResponse2.authUserId;
    }

    const quizCreateResponse = adminQuizCreate(
      validAuthUserId1,
      "Games",
      "Game Trivia!"
    );

    if ("quizId" in quizCreateResponse) {
      validQuizId = quizCreateResponse.quizId;
    }

    invalidAuthUserId = validAuthUserId1 + validAuthUserId2 + 1;
    invalidQuizId = validQuizId + 1;
  });

  describe("Success Cases", () => {
    test("all parameters valid", () => {
      expect(
        adminQuizDescriptionUpdate(
          validAuthUserId1,
          validQuizId,
          validDescription
        )
      ).toStrictEqual({});
    });

    test("description length = 100, all other parementers valid", () => {
      expect(
        adminQuizDescriptionUpdate(
          validAuthUserId1,
          validQuizId,
          extremeValidDescription
        )
      ).toStrictEqual({});
    });

    test("description length = 0, all other parementers valid", () => {
      expect(
        adminQuizDescriptionUpdate(validAuthUserId1, validQuizId, "")
      ).toStrictEqual({});
    });

    test("description changed", () => {
      adminQuizDescriptionUpdate(
        validAuthUserId1,
        validQuizId,
        validDescription
      );

      const info = adminQuizInfo(validAuthUserId1, validQuizId);
      if ("description" in info) {
        expect(info.description).toStrictEqual(validDescription);
      }
    });
  });

  describe("Failure Cases", () => {
    test("authUserId not valid all other parementers valid", () => {
      expect(
        adminQuizDescriptionUpdate(
          invalidAuthUserId,
          validQuizId,
          validDescription
        )
      ).toStrictEqual({ error: "provided authUserId is not a real user." });
    });

    test("quizId not valid all other parementers valid", () => {
      expect(
        adminQuizDescriptionUpdate(
          validAuthUserId1,
          invalidQuizId,
          validDescription
        )
      ).toStrictEqual({ error: "provided quizId is not a real quiz." });
    });

    test("quizId valid but not owned by user provided by authUserId all other parementers valid", () => {
      expect(
        adminQuizDescriptionUpdate(
          validAuthUserId2,
          validQuizId,
          validDescription
        )
      ).toStrictEqual({
        error: "provided quizId is not owned by current user.",
      });
    });

    test("description length > 100, all other parementers valid", () => {
      expect(
        adminQuizDescriptionUpdate(
          validAuthUserId1,
          validQuizId,
          invalidDescription
        )
      ).toStrictEqual({ error: "description is invalid." });
    });

    test("all parameters are invalid", () => {
      expect(
        adminQuizDescriptionUpdate(
          invalidAuthUserId,
          invalidQuizId,
          invalidDescription
        )
      ).toStrictEqual({ error: "provided authUserId is not a real user." });
    });

    test("authUserId is valid, all other parementers invalid", () => {
      expect(
        adminQuizDescriptionUpdate(
          validAuthUserId1,
          invalidQuizId,
          invalidDescription
        )
      ).toStrictEqual({ error: "provided quizId is not a real quiz." });
    });

    test("quizId is valid, all other parementers invalid", () => {
      expect(
        adminQuizDescriptionUpdate(
          invalidAuthUserId,
          validQuizId,
          invalidDescription
        )
      ).toStrictEqual({ error: "provided authUserId is not a real user." });
    });

    test("description is valid, all other parementers invalid", () => {
      expect(
        adminQuizDescriptionUpdate(
          invalidAuthUserId,
          invalidQuizId,
          validDescription
        )
      ).toStrictEqual({ error: "provided authUserId is not a real user." });
    });

    test("description not changed", () => {
      adminQuizDescriptionUpdate(
        validAuthUserId1,
        validQuizId,
        invalidDescription
      );

      const info = adminQuizInfo(validAuthUserId1, validQuizId);
      if ("description" in info) {
        expect(info.description).not.toStrictEqual(invalidDescription);
      }
    });

    test("time not changed", () => {
      const info = adminQuizInfo(validAuthUserId1, validQuizId);

      adminQuizDescriptionUpdate(
        validAuthUserId1,
        validQuizId,
        invalidDescription
      );

      if ("timeLastEdited" in info) {
        const info2 = adminQuizInfo(validAuthUserId1, validQuizId);
        if ("timeLastEdited" in info2) {
          expect(info2.timeLastEdited).toStrictEqual(info.timeLastEdited);
        }
      }
    });
  });
});
