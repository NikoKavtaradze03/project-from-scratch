import { beforeEach, describe, expect, it } from "vitest";
import AxiosMockAdapter from "axios-mock-adapter";

import { api, axiosFetch } from "../axios-api";
import { setToken } from "../auth";

const mock = new AxiosMockAdapter(api);

describe("axios api client", () => {
  beforeEach(() => {
    mock.reset();
    localStorage.clear();
  });

  it("adds authorization header when token exists", async () => {
    setToken("abc123");

    mock.onGet("/user").reply((config) => {
      expect(config.headers?.Authorization).toBe("Token abc123");

      return [200, { user: { username: "niko" } }];
    });

    const data = await axiosFetch<{ user: { username: string } }>("/user");

    expect(data.user.username).toBe("niko");
  });

  it("removes token when backend returns 401", async () => {
    setToken("abc123");

    mock.onGet("/user").reply(401, {
      errors: {
        user: ["unauthorized"],
      },
    });

    await expect(axiosFetch("/user")).rejects.toThrow("unauthorized");

    expect(localStorage.getItem("token")).toBeNull();
  });

  it("passes query params correctly", async () => {
    mock.onGet("/articles").reply((config) => {
      expect(config.params).toEqual({
        limit: 10,
        offset: 0,
        tag: "react",
      });

      return [200, { articles: [], articlesCount: 0 }];
    });

    const data = await axiosFetch<{
      articles: [];
      articlesCount: number;
    }>("/articles", {
      params: {
        limit: 10,
        offset: 0,
        tag: "react",
      },
    });

    expect(data.articlesCount).toBe(0);
  });
});
