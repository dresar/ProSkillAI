import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { hashPassword, verifyPassword } from "../src/lib/auth";

describe("Password Hashing & Verification", () => {
  test("generates unique salted hashes for the same password", async () => {
    const pass = "SuperSecret123!";
    const hash1 = await hashPassword(pass);
    const hash2 = await hashPassword(pass);

    assert.notEqual(hash1, hash2);
    assert.equal(hash1.split(":").length, 2);
    assert.equal(hash2.split(":").length, 2);
  });

  test("verifies valid password against its hash", async () => {
    const pass = "AntigravityP@ss2026";
    const hash = await hashPassword(pass);
    const isValid = await verifyPassword(pass, hash);
    assert.equal(isValid, true);
  });

  test("rejects invalid password", async () => {
    const pass = "CorrectPassword123";
    const hash = await hashPassword(pass);
    const isValid = await verifyPassword("WrongPassword456", hash);
    assert.equal(isValid, false);
  });

  test("rejects malformed hash formats gracefully", async () => {
    const isValid1 = await verifyPassword("password", "invalid_format");
    const isValid2 = await verifyPassword("password", "salt:not_a_valid_hex");
    assert.equal(isValid1, false);
    assert.equal(isValid2, false);
  });
});
