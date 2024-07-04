import { clear } from "./other";
import {
  adminAuthRegister,
  adminUserDetails,
  adminUserDetailsUpdate,
} from "./auth";
import { expect, test, describe, beforeEach } from "@jest/globals";

describe("admin UserDetailsUpdate", () => {
  beforeEach(() => {
    clear();
  });

  describe("success cases", () => {
    test("general checking if authid has fields changed.", () => {
      const registerResponse = adminAuthRegister(
        "john@gmail.com",
        "John12345678910",
        "John",
        "Smith"
      );

      if ("sessionId" in registerResponse) {
        const userId = registerResponse.sessionId;
        console.log(userId);
        expect(
          adminUserDetailsUpdate(userId, "john@gmail.com", "John", "Smith")
        ).not.toStrictEqual({ error: expect.any(String) });
        const user = adminUserDetails(userId);

        if ("user" in user) {
          const fullName: string = user.user.name;
          const email: string = user.user.email;
          expect(fullName).toStrictEqual("John Smith");
          expect(email).toStrictEqual("john@gmail.com");
        }
      }
    });

    test("update details but do not change anything.", () => {
      const registerResponse = adminAuthRegister(
        "john@gmail.com",
        "John12345678910",
        "John",
        "Smith"
      );

      if ("sessionId" in registerResponse) {
        const userId = registerResponse.sessionId;
        expect(
          adminUserDetailsUpdate(userId, "john@gmail.com", "John", "Smith")
        ).not.toStrictEqual({ error: expect.any(String) });

        const user = adminUserDetails(userId);

        if ("user" in user) {
          const fullName: string = user.user.name;
          const email: string = user.user.email;
          expect(fullName).toStrictEqual("John Smith");
          expect(email).toStrictEqual("john@gmail.com");
        }
      }
    });
  });

  describe("failure cases", () => {
    test("AuthId is not valid", () => {
      adminAuthRegister("john@gmail.com", "John12345678", "John", "Smith");
      expect(
        adminUserDetailsUpdate(-1, "john@gmail.com", "John", "Smith")
      ).toStrictEqual({ error: expect.any(String) });
    });

    test("email is not valid", () => {
      const registerResponse = adminAuthRegister(
        "john@gmail.com",
        "John12345678",
        "John",
        "Smith"
      );

      if ("sessionId" in registerResponse) {
        expect(
          adminUserDetailsUpdate(
            registerResponse.sessionId,
            "a@.com",
            "John",
            "Smith"
          )
        ).toStrictEqual({ error: expect.any(String) });
      }
    });

    test("email is used by other user", () => {
      const registerResponse = adminAuthRegister(
        "john@gmail.com",
        "John12345678",
        "John",
        "Smith"
      );

      if ("sessionId" in registerResponse) {
        adminAuthRegister("lowJ@gmail.com", "John12345678", "John", "Smoth");
        expect(
          adminUserDetailsUpdate(
            registerResponse.sessionId,
            "lowJ@gmail.com",
            "John",
            "Smith"
          )
        ).toStrictEqual({ error: expect.any(String) });
      }
    });

    test("namefirst contains invalid characters", () => {
      const registerResponse = adminAuthRegister(
        "john@gmail.com",
        "John12345678",
        "John",
        "Smith"
      );
      if ("sessionId" in registerResponse) {
        expect(
          adminUserDetailsUpdate(
            registerResponse.sessionId,
            "john@gmail.com",
            "John1",
            "Smith"
          )
        ).toStrictEqual({ error: expect.any(String) });
      }
    });

    test("namelast contains invalid characters", () => {
      const registerResponse = adminAuthRegister(
        "john@gmail.com",
        "John12345678",
        "John",
        "Smith1"
      );
      if ("sessionId" in registerResponse) {
        expect(
          adminUserDetailsUpdate(
            registerResponse.sessionId,
            "john@gmail.com",
            "John1",
            "Smith"
          )
        ).toStrictEqual({ error: expect.any(String) });
      }
    });

    test("namefirst is 1 character", () => {
      const registerResponse = adminAuthRegister(
        "john@gmail.com",
        "John12345678",
        "J",
        "Smith"
      );
      if ("sessionId" in registerResponse) {
        expect(
          adminUserDetailsUpdate(
            registerResponse.sessionId,
            "john@gmail.com",
            "John1",
            "Smith"
          )
        ).toStrictEqual({ error: expect.any(String) });
      }
    });

    test("namefirst is more than 20 characters", () => {
      const registerResponse = adminAuthRegister(
        "john@gmail.com",
        "John12345678",
        "abcdefghijklmnopqrstuvwxyz",
        "Smith"
      );
      if ("sessionId" in registerResponse) {
        expect(
          adminUserDetailsUpdate(
            registerResponse.sessionId,
            "john@gmail.com",
            "John1",
            "Smith"
          )
        ).toStrictEqual({ error: expect.any(String) });
      }
    });

    test("namelast is more than 20 characters", () => {
      const registerResponse = adminAuthRegister(
        "john@gmail.com",
        "John12345678",
        "John",
        "abcdefghijklmnopqrstuvwxyz"
      );
      if ("sessionId" in registerResponse) {
        expect(
          adminUserDetailsUpdate(
            registerResponse.sessionId,
            "john@gmail.com",
            "John1",
            "Smith"
          )
        ).toStrictEqual({ error: expect.any(String) });
      }
    });

    test("namelast is less than 2 character", () => {
      const registerResponse = adminAuthRegister(
        "john@gmail.com",
        "John12345678",
        "John",
        "a"
      );
      if ("sessionId" in registerResponse) {
        expect(
          adminUserDetailsUpdate(
            registerResponse.sessionId,
            "john@gmail.com",
            "John1",
            "Smith"
          )
        ).toStrictEqual({ error: expect.any(String) });
      }
    });
  });
});
