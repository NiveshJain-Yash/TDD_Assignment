import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EmployeeSearch from "../components/EmployeeSearch";
import * as api from "../components/EmployeeSearch";

const mockEmployee = { id: 1, name: "Jaynam Sanghvi", department: "Engineering" };

// Task 2 – Verify component renders
test("renders input and search button", () => {
  render(<EmployeeSearch />);
  expect(screen.getByPlaceholderText("Search Employee")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
});

// Task 3 – Event testing
test("input accepts value and button is clickable", () => {
  render(<EmployeeSearch />);
  const input = screen.getByPlaceholderText("Search Employee");
  fireEvent.change(input, { target: { value: "John" } });
  expect(input.value).toBe("John");
  fireEvent.click(screen.getByRole("button", { name: "Search" }));
});

// Task 4 – API success mock
test("displays employee name and department on API success", async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: jest.fn().mockResolvedValue([]),
  });
  jest.spyOn(api, "fetchEmployee").mockResolvedValue(mockEmployee);

  render(<EmployeeSearch />);
  fireEvent.click(screen.getByRole("button", { name: "Search" }));

  expect(await screen.findByText("Jaynam Sanghvi")).toBeInTheDocument();
  expect(await screen.findByText("Engineering")).toBeInTheDocument();
});

// Task 5 – API failure mock
test("displays error message on API failure", async () => {
  jest.spyOn(api, "fetchEmployee").mockRejectedValue(new Error("API Error"));

  render(<EmployeeSearch />);
  fireEvent.click(screen.getByRole("button", { name: "Search" }));

  expect(await screen.findByText("Unable to fetch employee data")).toBeInTheDocument();
});

// Task 6 – Loading state test
test("shows Loading... immediately after search click", async () => {
  jest.spyOn(api, "fetchEmployee").mockResolvedValue(mockEmployee);

  render(<EmployeeSearch />);
  fireEvent.click(screen.getByRole("button", { name: "Search" }));

  expect(screen.getByText("Loading...")).toBeInTheDocument();
  await waitFor(() => expect(screen.queryByText("Loading...")).not.toBeInTheDocument());
});

// Task 6 – Prop validation test
test("renders title prop correctly", () => {
  render(<EmployeeSearch title="Employee Directory" />);
  expect(screen.getByText("Employee Directory")).toBeInTheDocument();
});
