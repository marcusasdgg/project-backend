import { describe, expect, test, beforeEach } from "@jest/globals"
import { clearHelper, adminQuizNameUpdateHelper, adminAuthRegisterHelper, adminQuizInfoHelper, adminQuizCreateHelper } from "./httpHelperFunctions";
import { error } from "./interface";

describe("AdminQuizQuestionDelete", () => {
    beforeEach(() => {
        clearHelper();
    });

    describe("Success Cases", () => {
        test("Normal usage: delete question of a singular quiz with single question created by user", () => {
            let token = adminAuthRegisterHelper("john@gmail.com", "John123456", "John", "Smith");
            if ("sessionId" in token){
                const quiz = adminQuizCreateHelper(token.sessionId, "Test Quiz", "A Test Quiz");
                if ("quizId" in quiz){
                    
                }

            }
        });

        test("Normal usage: delete question of a singular quiz with multiple questions created by user", () => {
            let token = adminAuthRegisterHelper("john@gmail.com", "John123456", "John", "Smith");
            if ("sessionId" in token){
                const quiz = adminQuizCreateHelper(token.sessionId, "Test Quiz", "A Test Quiz");
                if ("quizId" in quiz){
                    
                }

            }
        });
    });

    describe("Failure Cases", () => {
        test("Question Id does not refer to a valid question within this quiz", () => {

        });

        test("Token does not refer to a valid user", () => {

        });

        test("Token provided refers to a user who doesnt own the quiz", () => {

        });

        test("Token provided refers to a user, and quiz doesnt exist", () => {

        });
    });

});