//this is the test suite for admin auth register functionality located from auth.js
describe("AdminAuthRegister", () => {
  beforeEach(() => {
    clear();
  });

  describe("success Cases", () => {
    test("registering twice with the same email but separated by clear", () => {
      adminAuthRegister("a@gmail.com","abcdefgh1","asd","abcde");
      const retcondition = clear();
      expect(retcondition).toStrictEqual({});
      const ifError = adminAuthRegister("a@gmail.com","abcdefgh1","asd","abcde");
      console.log(ifError)
      expect(ifError).toStrictEqual({authUserId: expect.any(Number)});
    });
    
    test("normal test case with normal inputs.", () => {
      const id = adminAuthRegister("a@gmail.com","abcdefg1","asd a","abcde");
      expect(id).not.toStrictEqual({error: expect.any(String)})
      expect(adminUserDetails(id)).not.toStrictEqual({error: expect.any(String)})
    });
    
  });
  describe("failure Cases", () => {
    test("failure case with everything good but invalid email.", () => {
      const id = adminAuthRegister("a@.com","abcdefgh1","asd","abcde");
      expect(id).toStrictEqual({error: expect.any(String)});
    });

    test("failure case with everything good but email used by different user.", () => {
      const id = adminAuthRegister("a@gmail.com","abcdefgh1","asd","abcde");
      expect(id).not.toStrictEqual({error: expect.any(String)});
      expect(adminUserDetails(id)).not.toStrictEqual({error: expect.any(String)});
      const idsecond = adminAuthRegister("a@gmail.com","abcdefgh1","asd","abcde");
      expect(idsecond).toStrictEqual({error: expect.any(String)});
    });

    test("failure case with everything good but name first and last contains symbols.", () => {
      const id = adminAuthRegister("a@gmail.com","abcdefgh1","asd%","abcde%");
      expect(id).toStrictEqual({error: expect.any(String)});
    });

    test("failure case with everything good but name first and last contains symbols.", () => {
      const id = adminAuthRegister("a@gmail.com","abcdefgh1","asd%","abcde%");
      expect(id).toStrictEqual({error: expect.any(String)});
    });

    test("failure case with everything good but name first and last contains less than 2 characters.", () => {
      const id = adminAuthRegister("a@gmail.com","abcdefgh1","a","a");
      expect(id).toStrictEqual({error: expect.any(String)});
    });

    test("failure case with everything good but name first and last contains more than 20 characters.", () => {
      const id = adminAuthRegister("a@gmail.com","abcdefgh1","abcdefghijklmnopqrstuvwxyz","abcdefghijklmnopqrstuvwxyz");
      expect(id).toStrictEqual({error: expect.any(String)});
    });

    test("failure case with everything good but password contains less than 8 characters.", () => {
      const id = adminAuthRegister("a@gmail.com","abc1","abcdefghijklmnopqrstuvwxyz","abcdefghijklmnopqrstuvwxyz");
      expect(id).toStrictEqual({error: expect.any(String)});
    });

    test("failure case with everything good but password doesnt contain a number but just characters.", () => {
      const id = adminAuthRegister("a@gmail.com","abcdefgh","abc1","abcdefghijklmnopqrstuvwxyz");
      expect(id).toStrictEqual({error: expect.any(String)});
    });

    test("failure case with everything good but password doesnt contain a character but just numbers.", () => {
      const id = adminAuthRegister("a@gmail.com","abcdefgh","12345678","abcdefghijklmnopqrstuvwxyz");
      expect(id).toStrictEqual({error: expect.any(String)});
    });
  });
});

