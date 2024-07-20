import { describe, expect, test, beforeEach } from '@jest/globals';
import { clearHelper, adminAuthRegisterHelper, adminQuizQuestionDeleteV2Helper, adminQuizAddQuestionHelper, adminQuizCreateHelper, adminQuizQuestionDeleteHelper } from './httpHelperFunctions';
import { QuestionBody } from './interface';

describe('AdminQuizQuestionDelete', () => {
  let token : number;
  let invalidToken : number;
  let quizId : number;
  let invalidQuizId : number;
  let questionId : number;
  let invalidQuestionId : number;
  let questionBody : QuestionBody;
  beforeEach(() => {
    clearHelper();
    const boken = adminAuthRegisterHelper('john@gmail.com', 'John123456', 'John', 'Smith');
    if ('sessionId' in boken) {
      token = boken.sessionId;
      invalidToken = token + 1;
      const quiz = adminQuizCreateHelper(token, 'Test Quiz', 'A Test Quiz');
      if ('quizId' in quiz) {
        quizId = quiz.quizId;
        invalidQuizId = quizId + 1;

        const questionBodyOg : QuestionBody = {
          question: 'This is a question?',
          duration: 2,
          points: 3,
          answers: [{ answer: 'Nope', correct: false }, { answer: 'Yes', correct: true }]
        };

        questionBody = {
          question: 'This is a question second edition?',
          duration: 2,
          points: 3,
          answers: [{ answer: 'Nope', correct: false }, { answer: 'Yes', correct: true }]
        };

        const question = adminQuizAddQuestionHelper(token, quizId, questionBodyOg);

        if ('questionId' in question) {
          questionId = question.questionId;
          invalidQuestionId = questionId + 1;
        }
      }
    }
  });

  describe('Success Cases', () => {
    test('Normal usage: delete question of a singular quiz with single question created by user', () => {
      expect(adminQuizQuestionDeleteHelper(quizId, questionId, token)).toStrictEqual({});
    });

    test('Normal usage: delete question of a singular quiz with multiple questions created by user', () => {
      console.log('quizz added: ', adminQuizAddQuestionHelper(token, quizId, questionBody));
      expect(adminQuizQuestionDeleteHelper(quizId, questionId, token)).toStrictEqual({});
    });
  });

  describe('Failure Cases', () => {
    test('Question Id does not refer to a valid question within any quiz', () => {
      expect(adminQuizQuestionDeleteHelper(quizId, invalidQuestionId, token)).toStrictEqual({ error: expect.any(String) });
    });

    test('Question ID refers to a valid question within another quiz but not referenced one', () => {
      const quiz2 = adminQuizCreateHelper(token, 'second quiz', 'descrioption again');
      if ('quizId' in quiz2) {
        const question2 = adminQuizAddQuestionHelper(token, quiz2.quizId, questionBody);
        if ('questionId' in question2) {
          console.log('quiz id 2 is ', quiz2.quizId, ' and question2 is ', question2.questionId);
          console.log('quiz id 1 is ', quizId, ' and questionId is ', questionId);
          expect(adminQuizQuestionDeleteHelper(quizId, question2.questionId, token)).toStrictEqual({ error: expect.any(String) });
        }
      }
    });

    test('Token does not refer to a valid user', () => {
      expect(adminQuizQuestionDeleteHelper(quizId, questionId, invalidToken)).toStrictEqual({ error: expect.any(String) });
    });

    test('Token provided refers to a user who doesnt own the quiz', () => {
      const user2 = adminAuthRegisterHelper('john23@gmail.com', 'John123456', 'John', 'Smith');
      if ('sessionId' in user2) {
        expect(adminQuizQuestionDeleteHelper(quizId, questionId, user2.sessionId)).toStrictEqual({ error: expect.any(String) });
      }
    });

    test('Token provided refers to a user, and quiz doesnt exist', () => {
      expect(adminQuizQuestionDeleteHelper(invalidQuizId, questionId, token)).toStrictEqual({ error: expect.any(String) });
    });
  });
  

  describe('V2 tests', () => {
    test('Token does not refer to a valid user V2', () => {
      expect(adminQuizQuestionDeleteV2Helper(quizId, questionId, invalidToken)).toStrictEqual({ error: expect.any(String) });
    });
    test('Token provided refers to a user who doesnt own the quiz', () => {
      const user2 = adminAuthRegisterHelper('john23@gmail.com', 'John123456', 'John', 'Smith');
      if ('sessionId' in user2) {
        expect(adminQuizQuestionDeleteV2Helper(quizId, questionId, user2.sessionId)).toStrictEqual({ error: expect.any(String) });
      }
    });

    test('Question Id does not refer to a valid question within any quiz', () => {
      expect(adminQuizQuestionDeleteV2Helper(quizId, invalidQuestionId, token)).toStrictEqual({ error: expect.any(String) });
    });

    test('Normal usage: delete question of a singular quiz with single question created by user V2', () => {
      expect(adminQuizQuestionDeleteV2Helper(quizId, questionId, token)).toStrictEqual({});
    });
  });
});
