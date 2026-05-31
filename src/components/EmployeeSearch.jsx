import { useState } from "react";

// Mock employee data simulating API response
const MOCK_EMPLOYEES = [
  { id: 1, name: "Jaynam Sanghvi", department: "Engineering" },
  { id: 2, name: "John Smith", department: "Marketing" },
  { id: 3, name: "Jane Doe", department: "Human Resources" },
  { id: 4, name: "Alice Johnson", department: "Finance" },
  { id: 5, name: "Bob Williams", department: "Engineering" },
];

// Simulated API call with real fetch pattern
export async function fetchEmployee(name) {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  if (!res.ok) throw new Error("API Error");
  const users = await res.json();
  // Map API users to employee structure using mock department data
  const matched = MOCK_EMPLOYEES.find((e) =>
    e.name.toLowerCase().includes(name.toLowerCase())
  );
  if (!matched) throw new Error("Employee not found");
  return matched;
}

function EmployeeSearch({ title }) {
  const [query, setQuery] = useState("");
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    setEmployee(null);
    setError(null);
    try {
      const data = await fetchEmployee(query);
      setEmployee(data);
    } catch {
      setError("Unable to fetch employee data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: 500, margin: "40px auto", padding: "0 20px" }}>
      {title && <h1>{title}</h1>}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <input
          placeholder="Search Employee"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ flex: 1, padding: "8px 12px", fontSize: 16, border: "1px solid #ccc", borderRadius: 4 }}
        />
        <button
          onClick={handleSearch}
          style={{ padding: "8px 16px", fontSize: 16, cursor: "pointer", backgroundColor: "#0078d4", color: "#fff", border: "none", borderRadius: 4 }}
        >
          Search
        </button>
      </div>
      {loading && <p>Loading...</p>}
      {employee && (
        <div style={{ border: "1px solid #ddd", borderRadius: 6, padding: "16px 20px", backgroundColor: "#f9f9f9" }}>
          <p style={{ margin: "0 0 8px", fontSize: 18, fontWeight: "bold" }}>{employee.name}</p>
          <p style={{ margin: 0, color: "#555" }}>{employee.department}</p>
        </div>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default EmployeeSearch;
