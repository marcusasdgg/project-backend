
import { adminAuthRegisterHelper, adminQuizAddQuestionHelper, adminQuizCreateHelper, adminQuizSessionStartHelper, adminQuizSessionUpdateHelper } from "./httpHelperFunctions";
import { QuestionBody } from "./interface";
import { string } from "yaml/dist/schema/common/string";
import { adminQuizRemove } from "./quiz";
import {Action, error} from "./interface"


describe.skip('adminQuizSessionUpdate', () => {
    let token: number;
    let quizId: number;
    let questionId: number;
    let invalidToken: number;
    let invalidQuizId: number;
    let invalidQuestionId: number;
    let sessionId: number;
    let invalidSessionId: number;
    
    beforeEach(()=> {
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
  
  
            const question = adminQuizAddQuestionHelper(
              token,
              quizId,
              questionBodyOg
            );
  
            if ('questionId' in question) {
              questionId = question.questionId;
              invalidQuestionId = questionId + 1;

              let session = adminQuizSessionStartHelper(quizId, token, 5);
              if ('sessionId' in session) {
                sessionId = session.sessionId
                invalidSessionId = session.sessionId + 1;
              }
            }
          }
        }
      });

     describe('success cases', () => {
        test('updated freshstarted quiz session to End state', () => {
          expect(adminQuizSessionUpdateHelper(quizId, token, sessionId, Action.END)).not.toStrictEqual({error: expect.any(String)});
        });

        test('updated freshstarted quiz session to next question', () => {
          expect(adminQuizSessionUpdateHelper(quizId, token, sessionId, Action.NEXT_QUESTION)).not.toStrictEqual({error: expect.any(String)});
        });
     });

    describe('failure cases', () => {
      test('Token is empty or invalid (does not refer to valid logged in user session)', () => {
        expect(adminQuizSessionUpdateHelper(quizId, invalidToken, sessionId, Action.NEXT_QUESTION)).toStrictEqual({error: expect.any(String)});
      });

      test(`Valid token is provided, but user is not an owner of this quiz or quiz doesn't exist`, () => {
        let token21 = adminAuthRegisterHelper('john@icloud.com', 'password123A1', 'john','smith');
        if ('sessionId' in token21) {
          const token2 = token21.sessionId;
          expect(adminQuizSessionUpdateHelper(quizId, invalidToken, sessionId, Action.NEXT_QUESTION)).toStrictEqual({error: expect.any(String)});
        }
      });

      test('Session Id does not refer to a valid session within this quiz', () => {
        expect(adminQuizSessionUpdateHelper(quizId, token, invalidSessionId, Action.NEXT_QUESTION)).toStrictEqual({error: expect.any(String)});
      });

      test('Action provided is not a valid Action enum', () => {
        expect(adminQuizSessionUpdateHelper(quizId, token, invalidSessionId, Action.INVALID)).toStrictEqual({error: expect.any(String)});
      });

      test('Action enum cannot be applied in the current state, doing skipcountdown in lobby ', () => {
        expect(adminQuizSessionUpdateHelper(quizId, token, sessionId, Action.SKIP_COUNTDOWN)).toStrictEqual({error: expect.any(String)});
      });

    });
     

});