import { adminAuthRegisterHelper, adminQuizAddQuestionHelper, adminQuizCreateHelper, adminQuizSessionStartHelper, clearHelper } from './httpHelperFunctions';
import { QuestionBody } from './interface';
import { adminQuizRemove } from './quiz';

describe.skip('adminQuizSessionStart', () => {
<<<<<<< HEAD
  let token: number;
  let quizId: number;
  let invalidToken: number;

  beforeEach(() => {
    clearHelper();
    const boken = adminAuthRegisterHelper(
      'john@gmail.com',
      'John123456',
      'John',
      'Smith'
    );
    if ('sessionId' in boken) {
      token = boken.sessionId;
      invalidToken = token + 1;
      const quiz = adminQuizCreateHelper(token, 'Test Quiz', 'A Test Quiz');
      if ('quizId' in quiz) {
        quizId = quiz.quizId;

        const questionBodyOg: QuestionBody = {
          question: 'This is a question?',
          duration: 2,
          points: 3,
          answers: [
            { answer: 'Nope', correct: false },
            { answer: 'Yes', correct: true },
          ],
        };

        adminQuizAddQuestionHelper(
          token,
          quizId,
          questionBodyOg
=======
    let token: number;
    let quizId: number;
    let questionId: number;
    let invalidToken: number;
    let invalidQuizId: number;
    let invalidQuestionId: number;
    
    beforeEach(()=> {
      clearHelper();
        const boken = adminAuthRegisterHelper(
          'john@gmail.com',
          'John123456',
          'John',
          'Smith'
>>>>>>> dcae15d2fbaf12805ab69d4855a7e1467822a948
        );
      }
    }
  });

  describe('success cases', () => {
    test('fresh user registering 1 quiz and starting 1 session for the quiz', () => {
      expect(adminQuizSessionStartHelper(quizId, token, 5)).toStrictEqual({ sessionId: expect.any(Number) });
    });

    test('user registerring 9 sessions of the same quiz', () => {
      expect(adminQuizSessionStartHelper(quizId, token, 5)).toStrictEqual({ sessionId: expect.any(Number) });
      expect(adminQuizSessionStartHelper(quizId, token, 5)).toStrictEqual({ sessionId: expect.any(Number) });
      expect(adminQuizSessionStartHelper(quizId, token, 5)).toStrictEqual({ sessionId: expect.any(Number) });
      expect(adminQuizSessionStartHelper(quizId, token, 5)).toStrictEqual({ sessionId: expect.any(Number) });
      expect(adminQuizSessionStartHelper(quizId, token, 5)).toStrictEqual({ sessionId: expect.any(Number) });
      expect(adminQuizSessionStartHelper(quizId, token, 5)).toStrictEqual({ sessionId: expect.any(Number) });
      expect(adminQuizSessionStartHelper(quizId, token, 5)).toStrictEqual({ sessionId: expect.any(Number) });
      expect(adminQuizSessionStartHelper(quizId, token, 5)).toStrictEqual({ sessionId: expect.any(Number) });
      expect(adminQuizSessionStartHelper(quizId, token, 5)).toStrictEqual({ sessionId: expect.any(Number) });
    });
  });

  describe('failure cases', () => {
    test('invalid token', () => {
      expect(adminQuizSessionStartHelper(quizId, invalidToken, 5)).not.toStrictEqual({ sessionId: expect.any(Number) });
    });

    test("Valid token is provided, but user is not an owner of this quiz or quiz doesn't exist", () => {
      const token21 = adminAuthRegisterHelper('john@icloud.com', 'password123A1', 'john', 'smith');
      if ('sessionId' in token21) {
        const token2 = token21.sessionId;
        expect(adminQuizSessionStartHelper(quizId, token2, 5)).not.toStrictEqual({ sessionId: expect.any(Number) });
      }
    });

    test('autoStartNum is a number greater than 50', () => {
      expect(adminQuizSessionStartHelper(quizId, token, 51)).toStrictEqual({ sessionId: expect.any(Number) });
    });

    test('10 sessions that are not in END state currently exist for this quiz', () => {
      expect(adminQuizSessionStartHelper(quizId, token, 5)).toStrictEqual({ sessionId: expect.any(Number) });
      expect(adminQuizSessionStartHelper(quizId, token, 5)).toStrictEqual({ sessionId: expect.any(Number) });
      expect(adminQuizSessionStartHelper(quizId, token, 5)).toStrictEqual({ sessionId: expect.any(Number) });
      expect(adminQuizSessionStartHelper(quizId, token, 5)).toStrictEqual({ sessionId: expect.any(Number) });
      expect(adminQuizSessionStartHelper(quizId, token, 5)).toStrictEqual({ sessionId: expect.any(Number) });
      expect(adminQuizSessionStartHelper(quizId, token, 5)).toStrictEqual({ sessionId: expect.any(Number) });
      expect(adminQuizSessionStartHelper(quizId, token, 5)).toStrictEqual({ sessionId: expect.any(Number) });
      expect(adminQuizSessionStartHelper(quizId, token, 5)).toStrictEqual({ sessionId: expect.any(Number) });
      expect(adminQuizSessionStartHelper(quizId, token, 5)).toStrictEqual({ sessionId: expect.any(Number) });
      expect(adminQuizSessionStartHelper(quizId, token, 5)).toStrictEqual({ sessionId: expect.any(Number) });

      expect(adminQuizSessionStartHelper(quizId, token, 5)).not.toStrictEqual({ sessionId: expect.any(Number) });
    });

    test('The quiz does not have any questions in it', () => {
      const token21 = adminAuthRegisterHelper('john@icloud.com', 'password123A1', 'john', 'smith');
      if ('sessionId' in token21) {
        const token2 = token21.sessionId;
        const bod = adminQuizCreateHelper(token2, 'quiz21', 'desription');
        if ('quizId' in bod) {
          expect(adminQuizSessionStartHelper(bod.quizId, token2, 5)).toStrictEqual({ error: expect.any(String) });
        }
      }
    });

    test('quiz is in the trash', () => {
      adminQuizRemove(token, quizId);
      expect(adminQuizSessionStartHelper(quizId, token, 5)).toStrictEqual({ error: expect.any(String) });
    });
  });
});
