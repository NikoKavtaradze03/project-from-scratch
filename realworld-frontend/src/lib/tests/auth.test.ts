import { beforeEach, describe, expect, it } from "vitest";
import { getToken, removeToken, setToken } from "../auth";

describe("auth token helpers", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("stores and reads token", () => {
    setToken("abc123");

    expect(getToken()).toBe("abc123");
  });

  it("removes token", () => {
    setToken("abc123");

    removeToken();

    expect(getToken()).toBeNull();
  });
});
