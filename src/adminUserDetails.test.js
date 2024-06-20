import { describe, expect, test, beforeEach } from "@jest/globals";
import { adminAuthLogin, adminAuthRegister, adminUserDetails} from "./auth";
import { clear } from "./other";

describe('testing adminUserDetails function', () => {
  beforeEach(() => {
    clear();
  });

  describe('testing error case', () => {
    test('testing invalid userId case', () => {
      const authUserId = adminAuthRegister("abcd@gmail.com","abcdefgh1","asd","abcde");
      let invalidUserId = 99999;
      expect(adminUserDetails(invalidUserId)).toStrictEqual({error: expect.any(String)});
    });
  });

  describe('testing success cases', () => {
    test('testing successful case upon registration', () => {
      const authUserId = adminAuthRegister("validemail@gmail.com","abcdefgh1","John","Doe");
      expect(adminUserDetails(authUserId)).toStrictEqual({
      user: {
        userId: authUserId,
        name: 'John Doe',
        email: 'validemail@gmail.com',
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0,
      }
    });
  });
  test('testing initial registration details', () => {
    const authUserId = adminAuthRegister("validemaill@gmail.com","abcdefgh1","John","Dae");
    //initial registration details
    expect(adminUserDetails(authUserId)).toStrictEqual({
      user: {
        userId: authUserId,
        name: 'John Dae',
        email: 'validemaill@gmail.com',
        numSuccessfulLogins: 1, 
        numFailedPasswordsSinceLastLogin: 0,
        }
      });
  })
  test('testing the numSuccessfulLogins with multiple successful logins', () => {
    const authUserId = adminAuthRegister("validemaill@gmail.com","abcdefgh1","John","Dae");

      //perform multiple login after registration
      adminAuthLogin("validemaill@gmail.com", "abcdefgh1");
      adminAuthLogin("validemaill@gmail.com", "abcdefgh1");
      adminAuthLogin("validemaill@gmail.com", "abcdefgh1");
  
      //check details after multiple logins
      expect(adminUserDetails(authUserId)).toStrictEqual({
        user: {
          userId: authUserId,
          name: 'John Dae',
          email: 'validemaill@gmail.com',
          numSuccessfulLogins: 4, 
          numFailedPasswordsSinceLastLogin: 0,
        }
      });
    });

    test.only('testing the counter of numFailedPasswordsSinceLastLogin', () => {
      const authUserId = adminAuthRegister("validemail@gmail.com","abcdefgh1","Bob","Jones");
  
      //attempt to login with incorrect password 
      adminAuthLogin("validemail@gmail.com", "incorrectPassword1");
      adminAuthLogin("validemail@gmail.com", "incorrectPassword2");
  
      //check details after failed password attempts
      expect(adminUserDetails(authUserId)).toStrictEqual({
        user: {
          userId: authUserId,
          name: 'Bob Jones',
          email: 'validemail@gmail.com',
          numSuccessfulLogins: 1, 
          numFailedPasswordsSinceLastLogin: 2,
        }
      });
      
      //perform a successful login
      adminAuthLogin("validemail@gmail.com", "abcdefgh1");
  
      //check that the numFailedPasswordsSinceLastLogin has reset
      expect(adminUserDetails(authUserId)).toStrictEqual({
        user: {
          userId: authUserId,
          name: 'Bob Jones',
          email: 'validemail@gmail.com',
          numSuccessfulLogins: 2, 
          numFailedPasswordsSinceLastLogin: 0,
        }
      });
  
      //perform a failed login
      adminAuthLogin("validemail@gmail.com", "incorrectPassword3");
  
      //check numFailedPasswordsSinceLastLogin has updated, but successful logins has stayed the same
      expect(adminUserDetails(authUserId)).toStrictEqual({
        user: {
          userId: authUserId,
          name: 'Bob Jones',
          email: 'validemail@gmail.com',
          numSuccessfulLogins: 2, 
          numFailedPasswordsSinceLastLogin: 1,
        }
      });
    });
  });
});