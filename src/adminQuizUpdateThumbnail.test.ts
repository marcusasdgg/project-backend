import { adminAuthRegisterHelper, adminQuizAddQuestionHelper, adminQuizCreateHelper, adminQuizCreateV2Helper, adminQuizUpdateThumnailHelper, clearHelper } from "./httpHelperFunctions";
import { QuestionBody } from "./interface";

describe("adminQUizThumbnailUpdate", () => {
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
        );
      }
    }
    console.log(token)
    console.log(invalidToken)
    console.log(quizId)
  });

  describe('success cases', () => {
    test('changing thumbnail where there was none before', () => {
      expect(adminQuizUpdateThumnailHelper(quizId,token,"http://google.com/some/image/path.jpg" )).toStrictEqual({});
    });
    test('changing to same thumbnail', () => {
      expect(adminQuizUpdateThumnailHelper(quizId,token,"http://google.com/some/image/path.png" )).toStrictEqual({});
      expect(adminQuizUpdateThumnailHelper(quizId,token,"http://google.com/some/image/path.png" )).toStrictEqual({});
    });
    test('changing to different thumbnail', () => {
      expect(adminQuizUpdateThumnailHelper(quizId,token,"http://google.com/some/image/path.jpg" )).toStrictEqual({});
      expect(adminQuizUpdateThumnailHelper(quizId,token,"http://google.com/some/image/path.png" )).toStrictEqual({});
    });
  });

  describe('Failure cases', () => {
    test('invalid token', () => {
      expect(adminQuizUpdateThumnailHelper(quizId,invalidToken,"http://google.com/some/image/path.jpg" )).toStrictEqual({error: expect.any(String)});
    });
    test('Valid token is provided, but user is not an owner of this quiz or quiz doesn\'t exist', () => {
      expect(adminQuizUpdateThumnailHelper(quizId,invalidToken,"http://google.com/some/image/path.jpg" )).toStrictEqual({error: expect.any(String)});
    });
    test('The imgUrl does not end with one of the following filetypes (case insensitive): jpg, jpeg, png', () => {
      expect(adminQuizUpdateThumnailHelper(quizId,invalidToken,"http://google.com/some/image/path.kt" )).toStrictEqual({error: expect.any(String)});
    })
    test('The imgUrl does not begin with http:// or https://', () => {
      expect(adminQuizUpdateThumnailHelper(quizId,invalidToken,"wss://google.com/some/image/path.kt" )).toStrictEqual({error: expect.any(String)});
    })
  });
});