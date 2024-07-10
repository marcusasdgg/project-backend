import { describe, expect, test, beforeEach } from "@jest/globals"
import { clearHelper, adminQuizNameUpdateHelper, adminAuthRegisterHelper, adminQuizInfoHelper, adminQuizCreateHelper } from "./httpHelperFunctions";
import { error } from "./interface";

describe("AdminQuizQuestionDelete", () => {
    beforeEach(() => {
        clearHelper();
    });

    describe("Success Cases", () => {
        test("Normal usage: update question of a singular quiz with single question created by user", () => {
            let token = adminAuthRegisterHelper("john@gmail.com", "John123456", "John", "Smith");
            if ("sessionId" in token){
                const quiz = adminQuizCreateHelper(token.sessionId, "Test Quiz", "A Test Quiz");
                if ("quizId" in quiz){
                    
                }

            }
        });

        test("Normal usage: update question of a singular quiz with multiple questions created by user", () => {
            let token = adminAuthRegisterHelper("john@gmail.com", "John123456", "John", "Smith");
            if ("sessionId" in token){
                const quiz = adminQuizCreateHelper(token.sessionId, "Test Quiz", "A Test Quiz");
                if ("quizId" in quiz){
                    
                }

            }
        });
    });

    describe("Failure Cases", () => {
        test("Question Id does not refer to a valid question within any quiz", () => {

        });
        

        test("Question ID refers to a valid question within another quiz but not referenced one", () => {

        });

        test("Token does not refer to a valid user", () => {

        });

        test("Token provided refers to a user who doesnt own the quiz", () => {

        });

        test("Token provided refers to a user, and quiz doesnt exist", () => {

        });

        test("Question string is less than 5 characters in length or greater than 50 characters in length", () => {

        });

        test("The question has more than 6 answers or less than 2 answers", () => {

        });

        test("The question duration is not a positive number", () => {

        });

        test("If this question were to be updated, the sum of the question durations in the quiz exceeds 3 minutes", () => {

        });

        test("The points awarded for the question are less than 1 or greater than 10", () => {

        });

        test("The length of any answer is shorter than 1 character long, or longer than 30 characters long", () => {

        });

        test("Any answer strings are duplicates of one another (within the same question)", () => {

        });

        test("There are no correct answers", () => {

        });
    });

});