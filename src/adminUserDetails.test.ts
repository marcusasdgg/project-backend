import { describe, expect, test, beforeEach } from "@jest/globals";
import { adminAuthLogin, adminAuthRegister, adminUserDetails } from "./auth";
import { clear } from "./other";

describe("testing adminUserDetails function", () => {
  beforeEach(() => {
    clear();
  });

  describe("testing error case", () => {
    test("testing invalid userId case", () => {
      adminAuthRegister("abcd@gmail.com", "abcdefgh1", "asd", "abcde");

      let invalidUserId = 99999;
      expect(adminUserDetails(invalidUserId)).toStrictEqual({
        error: expect.any(String),
      });
    });
  });

  describe("testing success cases", () => {
    test("testing successful case upon registration", () => {
      const registerResponse = adminAuthRegister(
        "validemail@gmail.com",
        "abcdefgh1",
        "John",
        "Doe"
      );

      if ("authUserId" in registerResponse) {
        expect(adminUserDetails(registerResponse.authUserId)).toStrictEqual({
          user: {
            userId: registerResponse.authUserId,
            name: "John Doe",
            email: "validemail@gmail.com",
            numSuccessfulLogins: 1,
            numFailedPasswordsSinceLastLogin: 0,
          },
        });
      }
    });
    test("testing initial value for numSuccessfulLogins", () => {
      const registerResponse = adminAuthRegister(
        "validemaill@gmail.com",
        "abcdefgh1",
        "John",
        "Dae"
      );

      //initial registration details
      if ("authUserId" in registerResponse) {
        expect(adminUserDetails(registerResponse.authUserId)).toStrictEqual({
          user: {
            userId: registerResponse.authUserId,
            name: "John Dae",
            email: "validemaill@gmail.com",
            numSuccessfulLogins: 1,
            numFailedPasswordsSinceLastLogin: 0,
          },
        });
      }
    });
    test("testing the numSuccessfulLogins with multiple successful logins", () => {
      const registerResponse = adminAuthRegister(
        "validemaill@gmail.com",
        "abcdefgh1",
        "John",
        "Dae"
      );

      //perform multiple logins after registration
      adminAuthLogin("validemaill@gmail.com", "abcdefgh1");
      adminAuthLogin("validemaill@gmail.com", "abcdefgh1");
      adminAuthLogin("validemaill@gmail.com", "abcdefgh1");

      //check details after multiple logins
      if ("authUserId" in registerResponse) {
        expect(adminUserDetails(registerResponse.authUserId)).toStrictEqual({
          user: {
            userId: registerResponse.authUserId,
            name: "John Dae",
            email: "validemaill@gmail.com",
            numSuccessfulLogins: 4,
            numFailedPasswordsSinceLastLogin: 0,
          },
        });
      }
    });

    test("testing the counter and reset of numFailedPasswordsSinceLastLogin", () => {
      const registerResponse = adminAuthRegister(
        "validemail@gmail.com",
        "abcdefgh1",
        "Bob",
        "Jones"
      );

      //attempt to login with incorrect password
      if ("authUserId" in registerResponse) {
        adminAuthLogin("validemail@gmail.com", "incorrectPassword1");
        adminAuthLogin("validemail@gmail.com", "incorrectPassword2");

        //check details after failed password attempts
        expect(adminUserDetails(registerResponse.authUserId)).toStrictEqual({
          user: {
            userId: registerResponse.authUserId,
            name: "Bob Jones",
            email: "validemail@gmail.com",
            numSuccessfulLogins: 1,
            numFailedPasswordsSinceLastLogin: 2,
          },
        });

        //perform a successful login
        adminAuthLogin("validemail@gmail.com", "abcdefgh1");

        //check that the numFailedPasswordsSinceLastLogin has reset
        expect(adminUserDetails(registerResponse.authUserId)).toStrictEqual({
          user: {
            userId: registerResponse.authUserId,
            name: "Bob Jones",
            email: "validemail@gmail.com",
            numSuccessfulLogins: 2,
            numFailedPasswordsSinceLastLogin: 0,
          },
        });

        //perform a failed login
        adminAuthLogin("validemail@gmail.com", "incorrectPassword3");

        //check numFailedPasswordsSinceLastLogin has updated, but successful logins has stayed the same
        expect(adminUserDetails(registerResponse.authUserId)).toStrictEqual({
          user: {
            userId: registerResponse.authUserId,
            name: "Bob Jones",
            email: "validemail@gmail.com",
            numSuccessfulLogins: 2,
            numFailedPasswordsSinceLastLogin: 1,
          },
        });
      }
    });
  });
});
