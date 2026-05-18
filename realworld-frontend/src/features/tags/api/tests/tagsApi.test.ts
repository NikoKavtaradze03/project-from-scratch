import { beforeEach, describe, expect, it } from "vitest";
import AxiosMockAdapter from "axios-mock-adapter";

import { api } from "@/lib/axios-api";
import { getTags } from "../tagsApi";

const mock = new AxiosMockAdapter(api);

describe("getTags", () => {
  beforeEach(() => {
    mock.reset();
  });

  it("fetches tags from the tags endpoint", async () => {
    mock.onGet("/tags").reply(200, {
      tags: ["react", "typescript", "frontend"],
    });

    const result = await getTags();

    expect(result).toEqual({
      tags: ["react", "typescript", "frontend"],
    });
  });
});
