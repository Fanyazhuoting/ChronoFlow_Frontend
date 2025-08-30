import { render, screen, within } from "@testing-library/react";
import { vi } from "vitest";
import Async from "../Async";

describe("Async (mocked fetch)", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it("renders collections when the request succeeds", async () => {
    const payload = {
      data: {
        collections: [
          {
            collectionId: "1414",
            createdAt: "2016-06-30T11:21:29+08:00",
            description: "Million tonnes of waste incinerated per year",
            name: "test1",
            lastUpdatedAt: "2024-06-06T14:23:36+08:00",
            frequency: "annual",
            sources: ["National Environment Agency"],
            managedByAgencyName: "National Environment Agency",
            childDatasets: ["d_0fefa8455a070b420aed1cb671f379b8"],
          },
          {
            collectionId: "2222",
            createdAt: "2017-01-01T08:00:00+08:00",
            name: "test2",
            description: "Another dataset",
            lastUpdatedAt: "2024-01-01T08:00:00+08:00",
            frequency: "annual",
            sources: ["NEA"],
            managedByAgencyName: "NEA",
            childDatasets: [],
          },
        ],
      },
    };

    const response = new Response(JSON.stringify(payload), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

    vi.spyOn(global, "fetch").mockResolvedValueOnce(response);

    render(<Async />);

    const list = await screen.findByRole("list");
    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent(/incinerated per year/i);
    expect(items[1]).toHaveTextContent(/another dataset/i);
  });

  it("renders an empty list when the response shape is unexpected", async () => {
    const response = new Response(JSON.stringify({ data: {} }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

    vi.spyOn(global, "fetch").mockResolvedValueOnce(response);

    render(<Async />);

    const list = await screen.findByRole("list");
    const items = within(list).queryAllByRole("listitem");
    expect(items).toHaveLength(0);
  });

  it("renders an empty list when the request fails", async () => {
    vi.spyOn(global, "fetch").mockRejectedValueOnce(new Error("network"));

    render(<Async />);

    const list = await screen.findByRole("list");
    const items = within(list).queryAllByRole("listitem");
    expect(items).toHaveLength(0);
  });
});
