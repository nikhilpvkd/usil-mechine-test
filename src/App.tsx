import { useMemo, useState } from "react";
import "./App.css";
import { List } from "react-window";
import debounce from "lodash/debounce";
import { Row } from "./components/Row";

export type PhoneRecord = {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  office: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  department: string;
  designation: string;
  company: string;
  website: string;
  dob: string;
  gender: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

function generateDummyData(count: number): PhoneRecord[] {
  const data = new Array<PhoneRecord>(count);

  for (let i = 0; i < count; i++) {
    data[i] = {
      id: i,
      name: `User ${i}`,
      phone: `+91-90000${String(i).padStart(5, "0")}`,
      email: `user${i}@example.com`,
      address: `Street ${i}`,
      office: `Office ${i % 50}`,
      city: "Bangalore",
      state: "Karnataka",
      country: "India",
      zip: "560001",
      department: `Dept ${i % 10}`,
      designation: "Engineer",
      company: "Demo Corp",
      website: "example.com",
      dob: "1990-01-01",
      gender: "Male",
      notes: "N/A",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  return data;
}

export default function App() {
  const DATA_COUNT = 200000;
  const data = useMemo(() => generateDummyData(DATA_COUNT), []);

  const [filteredData, setFilteredData] = useState<PhoneRecord[]>(data);

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        if (!value) {
          setFilteredData(data);
          return;
        }

        const q = value.toLowerCase();
        setFilteredData(
          data.filter(
            (item) =>
              item.name.toLowerCase().includes(q) ||
              item.phone.includes(q) ||
              item.email.toLowerCase().includes(q)
          )
        );
      }, 300),
    [data]
  );

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    debouncedSearch(value);
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <input
        placeholder="Search by name / phone / email"
        onChange={onSearch}
        style={{ width: "100%", padding: 10 }}
      />

      <div style={{ flex: 1 }}>
        <List
          rowCount={filteredData.length}
          rowHeight={20}
          rowComponent={Row}
          rowProps={{ records: filteredData }}
          style={{
            height: "80vh",
          }}
        />
      </div>
    </div>
  );
}
