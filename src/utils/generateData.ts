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

export function generateDummyData(count: number): PhoneRecord[] {
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
