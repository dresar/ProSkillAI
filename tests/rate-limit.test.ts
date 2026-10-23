import { test, describe, beforeEach } from "node:test";
import assert from "node:assert/strict";
import {
  checkRateLimit,
  getClientIp,
  resetRateLimitStore,
} from "../src/lib/rate-limit";

describe("Rate Limiter & IP Extraction", () => {
  beforeEach(() => {
    resetRateLimitStore();
  });

  test("allows requests under the rate limit", () => {
    const res1 = checkRateLimit("test-key", 3, 1000);
    assert.equal(res1.allowed, true);
    assert.equal(res1.remaining, 2);

    const res2 = checkRateLimit("test-key", 3, 1000);
    assert.equal(res2.allowed, true);
    assert.equal(res2.remaining, 1);

    const res3 = checkRateLimit("test-key", 3, 1000);
    assert.equal(res3.allowed, true);
    assert.equal(res3.remaining, 0);
  });

  test("blocks requests exceeding the limit", () => {
    for (let i = 0; i < 5; i++) {
      checkRateLimit("blocked-key", 5, 1000);
    }
    const blockedRes = checkRateLimit("blocked-key", 5, 1000);
    assert.equal(blockedRes.allowed, false);
    assert.equal(blockedRes.remaining, 0);
    assert.ok(blockedRes.resetMs > 0);
  });

  test("extracts client IP from Cloudflare header", () => {
    const req = new Request("https://example.com", {
      headers: {
        "cf-connecting-ip": "203.0.113.195",
        "x-forwarded-for": "198.51.100.1",
      },
    });
    assert.equal(getClientIp(req), "203.0.113.195");
  });

  test("extracts client IP from forwarded header when cf is absent", () => {
    const req = new Request("https://example.com", {
      headers: {
        "x-forwarded-for": "198.51.100.1, 10.0.0.1",
      },
    });
    assert.equal(getClientIp(req), "198.51.100.1");
  });

  test("falls back to local IP when headers are absent", () => {
    const req = new Request("https://example.com");
    assert.equal(getClientIp(req), "127.0.0.1");
  });
});
