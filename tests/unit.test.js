const { isValidEmail } = require("../app/service");

test("valid email", () => {
  expect(isValidEmail("test@example.com")).toBe(true);
});

test("missing @", () => {
  expect(isValidEmail("testexample.com")).toBe(false);
});

test("missing domain", () => {
  expect(isValidEmail("test@")).toBe(false);
});

test("missing name", () => {
  expect(isValidEmail("@example.com")).toBe(false);
});

test("missing dot", () => {
  expect(isValidEmail("test@example")).toBe(false);
});