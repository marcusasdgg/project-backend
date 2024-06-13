//This test file is meant to test the clear function in /other.js.

import clear from "./other.js"

test('Test successful clear: 2', () => {
    expect(clear()).toStrictEqual({});
});

test('Test successful clear: 1', () => {
    expect(clear()).tobe({});
});

//this is more or less the only tests we could do due to how simple the clear function is.

