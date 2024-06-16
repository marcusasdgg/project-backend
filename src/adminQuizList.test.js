import {adminQuizCreate, adminQuizList, adminQuizDescriptionUpdate, adminQuizInfo, adminQuizRemove, adminQuizNameUpdate} from './quiz.js';
import {adminAuthLogin, adminAuthRegister, adminUserDetails} from "./auth.js"
import { getData, setData } from './datastore.js';
import {clear} from "./other.js"

describe("AdminQuizList", () => {
  beforeEach(() => {
    clear();
  });

  describe("success Cases", () => {
    test("retrieving quiz list for a user with quizzes", () => {
      const authUserId = "user123";
      const quizzes = [
        { quizId: 1, name: "Quiz 1" },
        { quizId: 2, name: "Quiz 2" },
      ];
      setData(`quizzes_${authUserId}`, { quizzes });
      const result = adminQuizList(authUserId);
      expect(result.quizzes).toEqual(quizzes);
    });

    test("retrieving quiz list for a user with no quizzes", () => {
      const authUserId = "user456";
      const result = adminQuizList(authUserId);
      expect(result.quizzes).toEqual([]);
    });
  });

  describe("failure Cases", () => {
    test("retrieving quiz list for an invalid user", () => {
      const authUserId = "invalidUser";
      const result = adminQuizList(authUserId);
      expect(result.quizzes).toEqual([]);
    });

    test("retrieving quiz list for a user with invalid quiz data", () => {
      const authUserId = "user789";
      setData(`quizzes_${authUserId}`, { invalidData: "quizData" });
      const result = adminQuizList(authUserId);
      expect(result.quizzes).toEqual([]);
    });

    test("retrieving quiz list after clearing data", () => {
      const authUserId = "user123";
      const quizzes = [
        { quizId: 1, name: "Quiz 1" },
        { quizId: 2, name: "Quiz 2" },
      ];
      setData(`quizzes_${authUserId}`, { quizzes });
      clear();
      const result = adminQuizList(authUserId);
      expect(result.quizzes).toEqual([]);
    });

    test("retrieving quiz list for multiple users", () => {
      const user1 = "user123";
      const user2 = "user456";
      const quizzes1 = [
        { quizId: 1, name: "Quiz 1" },
        { quizId: 2, name: "Quiz 2" },
      ];
      const quizzes2 = [{ quizId: 3, name: "Quiz 3" }];
      setData(`quizzes_${user1}`, { quizzes: quizzes1 });
      setData(`quizzes_${user2}`, { quizzes: quizzes2 });

      const result1 = adminQuizList(user1);
      const result2 = adminQuizList(user2);

      expect(result1.quizzes).toEqual(quizzes1);
      expect(result2.quizzes).toEqual(quizzes2);
    });
  });
});
