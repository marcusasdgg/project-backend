import { describe, expect, test, beforeEach } from '@jest/globals';
import {
  clearHelper,
  adminAuthRegisterHelper,
  adminQuizCreateHelper,
  adminQuizAddQuestionHelper,
  adminQuizQuestionUpdateHelper,
  adminQuizQuestionUpdateV2Helper,
} from './httpHelperFunctions';
import { QuestionBody } from './interface';

describe('AdminQuizQuestionUpdate', () => {
  beforeEach(() => {
    clearHelper();
  });

  describe('Success Cases', () => {
    test('Normal usage: update question of a singular quiz with single question created by user', () => {
      const token = adminAuthRegisterHelper(
        'john@gmail.com',
        'John123456',
        'John',
        'Smith'
      );
      if ('sessionId' in token) {
        const quiz = adminQuizCreateHelper(
          token.sessionId,
          'Test Quiz',
          'A Test Quiz'
        );
        if ('quizId' in quiz) {
          const questionBody: QuestionBody = {
            question: 'This is a question?',
            duration: 10,
            points: 3,
            answers: [
              { answer: 'Nope', correct: false },
              { answer: 'Yes', correct: true },
            ],
          };
          const question = adminQuizAddQuestionHelper(
            token.sessionId,
            quiz.quizId,
            questionBody
          );
          if ('questionId' in question) {
            questionBody.duration = 1;
            expect(
              adminQuizQuestionUpdateHelper(
                quiz.quizId,
                question.questionId,
                token.sessionId,
                questionBody
              )
            ).toStrictEqual({});
          }
        }
      }
    });

    test('Normal usage: update question of a singular quiz with single question created by user V2', () => {
      const token = adminAuthRegisterHelper(
        'john@gmail.com',
        'John123456',
        'John',
        'Smith'
      );
      if ('sessionId' in token) {
        const quiz = adminQuizCreateHelper(
          token.sessionId,
          'Test Quiz',
          'A Test Quiz'
        );
        if ('quizId' in quiz) {
          const questionBody: QuestionBody = {
            question: 'This is a question?',
            duration: 10,
            points: 3,
            answers: [
              { answer: 'Nope', correct: false },
              { answer: 'Yes', correct: true },
            ],
          };
          const question = adminQuizAddQuestionHelper(
            token.sessionId,
            quiz.quizId,
            questionBody
          );
          if ('questionId' in question) {
            questionBody.duration = 1;
            expect(
              adminQuizQuestionUpdateV2Helper(
                quiz.quizId,
                question.questionId,
                token.sessionId,
                questionBody,
                "http://google.com/some/image/path.jpg"
              )
            ).toStrictEqual({});
          }
        }
      }
    });

    test('Normal usage: update question of a singular quiz with multiple questions created by user', () => {
      const token = adminAuthRegisterHelper(
        'john@gmail.com',
        'John123456',
        'John',
        'Smith'
      );
      if ('sessionId' in token) {
        const quiz = adminQuizCreateHelper(
          token.sessionId,
          'Test Quiz',
          'A Test Quiz'
        );
        if ('quizId' in quiz) {
          const questionBody: QuestionBody = {
            question: 'This is a question?',
            duration: 2,
            points: 3,
            answers: [
              { answer: 'Nope', correct: false },
              { answer: 'Yes', correct: true },
            ],
          };
          const questionbqody2: QuestionBody = {
            question: 'This is a question second edition?',
            duration: 1,
            points: 1,
            answers: [
              { answer: 'Nope', correct: false },
              { answer: 'Yes', correct: true },
            ],
          };

          const question = adminQuizAddQuestionHelper(
            token.sessionId,
            quiz.quizId,
            questionBody
          );

          adminQuizAddQuestionHelper(
            token.sessionId,
            quiz.quizId,
            questionbqody2
          );
          if ('questionId' in question) {
            questionBody.duration = 1;
            expect(
              adminQuizQuestionUpdateHelper(
                quiz.quizId,
                question.questionId,
                token.sessionId,
                questionBody
              )
            ).toStrictEqual({});
          }
        }
      }
    });
  });

  describe('Failure Cases', () => {
    let token: number;
    let invalidToken: number;
    let quizId: number;
    let invalidQuizId: number;
    let questionId: number;
    let invalidQuestionId: number;
    let questionBody: QuestionBody;
    beforeEach(() => {
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
          invalidQuizId = quizId + 1;

          const questionBodyOg: QuestionBody = {
            question: 'This is a question?',
            duration: 2,
            points: 3,
            answers: [
              { answer: 'Nope', correct: false },
              { answer: 'Yes', correct: true },
            ],
          };

          questionBody = {
            question: 'This is a question second edition?',
            duration: 2,
            points: 3,
            answers: [
              { answer: 'Nope', correct: false },
              { answer: 'Yes', correct: true },
            ],
          };

          const question = adminQuizAddQuestionHelper(
            token,
            quizId,
            questionBodyOg
          );

          if ('questionId' in question) {
            questionId = question.questionId;
            invalidQuestionId = questionId + 1;
          }
        }
      }
    });

    test('Question Id does not refer to a valid question within any quiz', () => {
      expect(
        adminQuizQuestionUpdateHelper(
          quizId,
          invalidQuestionId,
          token,
          questionBody
        )
      ).toStrictEqual({ error: expect.any(String) });
    });

    test('Question ID refers to a valid question within another quiz but not referenced one', () => {
      const quiz2 = adminQuizCreateHelper(token, 'test quiz 2', 'description');
      if ('quizId' in quiz2) {
        const questionId2 = adminQuizAddQuestionHelper(
          token,
          quiz2.quizId,
          questionBody
        );
        if ('questionId' in questionId2) {
          expect(
            adminQuizQuestionUpdateHelper(
              quizId,
              questionId2.questionId,
              token,
              questionBody
            )
          ).toStrictEqual({ error: expect.any(String) });
        }
      }
    });

    test('Token does not refer to a valid user', () => {
      expect(
        adminQuizQuestionUpdateHelper(
          quizId,
          questionId,
          invalidToken,
          questionBody
        )
      ).toStrictEqual({ error: expect.any(String) });
    });

    test('Token does not refer to a valid user V2', () => {
      expect(
        adminQuizQuestionUpdateV2Helper(
          quizId,
          questionId,
          invalidToken,
          questionBody,
          "http://google.com/some/image/path.jpg"
        )
      ).toStrictEqual({ error: expect.any(String) });
    });

    test('Token provided refers to a user who doesnt own the quiz', () => {
      const user2 = adminAuthRegisterHelper(
        'john23@gmail.com',
        'John123456',
        'John',
        'Smith'
      );
      if ('sessionId' in user2) {
        expect(
          adminQuizQuestionUpdateHelper(
            quizId,
            questionId,
            user2.sessionId,
            questionBody
          )
        ).toStrictEqual({ error: expect.any(String) });
      }
    });

    test('Token provided refers to a user who doesnt own the quiz V2', () => {
      const user2 = adminAuthRegisterHelper(
        'john23@gmail.com',
        'John123456',
        'John',
        'Smith'
      );
      if ('sessionId' in user2) {
        expect(
          adminQuizQuestionUpdateV2Helper(
            quizId,
            questionId,
            user2.sessionId,
            questionBody,
            "http://google.com/some/image/path.jpg"
          )
        ).toStrictEqual({ error: expect.any(String) });
      }
    });

    test('Token provided refers to a user, and quiz doesnt exist', () => {
      expect(
        adminQuizQuestionUpdateHelper(
          invalidQuizId,
          questionId,
          token,
          questionBody,
        )
      ).toStrictEqual({ error: expect.any(String) });
    });

    test('Question string is less than 5 characters in length or greater than 50 characters in length', () => {
      questionBody.question = 'aaa';
      expect(
        adminQuizQuestionUpdateHelper(quizId, questionId, token, questionBody)
      ).toStrictEqual({ error: expect.any(String) });
      questionBody.question =
        'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
      expect(
        adminQuizQuestionUpdateHelper(quizId, questionId, token, questionBody)
      ).toStrictEqual({ error: expect.any(String) });
    });

    test('The question has more than 6 answers or less than 2 answers', () => {
      questionBody.answers = [];
      expect(
        adminQuizQuestionUpdateHelper(quizId, questionId, token, questionBody)
      ).toStrictEqual({ error: expect.any(String) });
      questionBody.answers = [
        { answer: 'abc', correct: true },
        { answer: 'def', correct: false },
        { answer: 'zzz', correct: false },
        { answer: 'tef', correct: false },
        { answer: 'mam', correct: false },
        { answer: 'des', correct: false },
        { answer: 'sss', correct: false },
      ];
      expect(
        adminQuizQuestionUpdateHelper(quizId, questionId, token, questionBody)
      ).toStrictEqual({ error: expect.any(String) });
    });

    test('The question duration is not a positive number', () => {
      questionBody.duration = -1;
      expect(
        adminQuizQuestionUpdateHelper(quizId, questionId, token, questionBody)
      ).toStrictEqual({ error: expect.any(String) });
    });

    test('If this question were to be updated, the sum of the question durations in the quiz exceeds 3 minutes', () => {
      questionBody.duration = 181;
      expect(
        adminQuizQuestionUpdateHelper(quizId, questionId, token, questionBody)
      ).toStrictEqual({ error: expect.any(String) });
    });

    test('The points awarded for the question are less than 1 or greater than 10', () => {
      questionBody.points = 0;
      expect(
        adminQuizQuestionUpdateHelper(quizId, questionId, token, questionBody)
      ).toStrictEqual({ error: expect.any(String) });
      questionBody.points = 11;
      expect(
        adminQuizQuestionUpdateHelper(quizId, questionId, token, questionBody)
      ).toStrictEqual({ error: expect.any(String) });
    });

    test('The length of any answer is shorter than 1 character long, or longer than 30 characters long', () => {
      questionBody.answers[0].answer = '';
      expect(
        adminQuizQuestionUpdateHelper(quizId, questionId, token, questionBody)
      ).toStrictEqual({ error: expect.any(String) });
      questionBody.answers[0].answer =
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
      expect(
        adminQuizQuestionUpdateHelper(quizId, questionId, token, questionBody)
      ).toStrictEqual({ error: expect.any(String) });
    });

    test('Any answer strings are duplicates of one another (within the same question)', () => {
      questionBody.answers.push({ answer: 'Nope', correct: false });
      expect(
        adminQuizQuestionUpdateHelper(quizId, questionId, token, questionBody)
      ).toStrictEqual({ error: expect.any(String) });
    });

    test('There are no correct answers', () => {
      questionBody.answers[1].correct = false;
      expect(
        adminQuizQuestionUpdateHelper(quizId, questionId, token, questionBody)
      ).toStrictEqual({ error: expect.any(String) });
    });

    test('There are no correct answers V2', () => {
      questionBody.answers[1].correct = false;
      expect(
        adminQuizQuestionUpdateV2Helper(quizId, questionId, token, questionBody,"http://google.com/some/image/path.jpg")
      ).toStrictEqual({ error: expect.any(String) });
    });

    test('The thumbnailUrl is an empty string', () => {
      expect(adminQuizQuestionUpdateV2Helper(quizId, questionId, token, questionBody,"")).toStrictEqual({error: expect.any(String)})
    })
    test('The thumbnailUrl does not end in jpg etc', () => {
      expect(adminQuizQuestionUpdateV2Helper(quizId, questionId, token, questionBody,"http://google.com/some/image/path.poo")).toStrictEqual({error: expect.any(String)})
    })
    test('The thumbnailUrl dopes not begin with http  etc', () => {
      expect(adminQuizQuestionUpdateV2Helper(quizId, questionId, token, questionBody,"h://google.com/some/image/path.jpg")).toStrictEqual({error: expect.any(String)})
    })

  });
});
