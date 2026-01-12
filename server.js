import express from "express";
import cors from "cors";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// data-store variable instead of real db
let dataStore = [];

function initializeDataStore() {
  console.log("Initializing data store with 200,000 records...");
  const TOTAL_RECORDS = 200000;

  for (let i = 0; i < TOTAL_RECORDS; i++) {
    dataStore.push({
      id: i + 1,
      name: `Person ${i + 1}`,
      email: `person${i + 1}@company${Math.floor(i / 1000)}.com`,
      phone: `+91-${String(9000000000 + i).slice(0, 10)}`,
      mobile: `+91-${String(8000000000 + i).slice(0, 10)}`,
      address: `${i + 1}, Street ${Math.floor(i / 100)}, City ${Math.floor(
        i / 10000
      )}`,
      city: `City ${Math.floor(i / 10000)}`,
      state: `State ${Math.floor(i / 50000)}`,
      pincode: `${100000 + (i % 900000)}`,
      country: "India",
      officeAddress: `Office ${Math.floor(i / 500)}, Business Park ${Math.floor(
        i / 5000
      )}`,
      officePhone: `+91-${String(4000000000 + i).slice(0, 10)}`,
      department: `Dept ${i % 20}`,
      designation: `Position ${i % 50}`,
      employeeId: `EMP${String(i + 1).padStart(6, "0")}`,
      dateOfJoining: new Date(2020 + (i % 5), i % 12, (i % 28) + 1)
        .toISOString()
        .split("T")[0],
      manager: `Manager ${Math.floor(i / 100)}`,
      salary: `${50000 + (i % 150000)}`,
      status: i % 10 === 0 ? "Inactive" : "Active",
      notes: `Additional notes for record ${i + 1}`,
      lastUpdated: new Date(2024, i % 12, (i % 28) + 1)
        .toISOString()
        .split("T")[0],
    });
  }
  console.log("Data store initialized successfully!");
}

initializeDataStore();

app.get("/api/records/batch", async (req, res) => {
  const batchIndex = parseInt(req.query.batchIndex) || 0;
  const batchSize = parseInt(req.query.batchSize) || 5000;
  const search = req.query.search || "";

  // Simulate delay (since there is nosql query)
  const DELAY = 3000;
  await new Promise((resolve) => setTimeout(resolve, DELAY));

  let filteredData = dataStore;

  // Apply search filter if provided
  if (search.trim()) {
    const searchLower = search.toLowerCase();
    filteredData = dataStore.filter(
      (record) =>
        record.name.toLowerCase().includes(searchLower) ||
        record.email.toLowerCase().includes(searchLower) ||
        record.phone.includes(search) ||
        record.employeeId.toLowerCase().includes(searchLower) ||
        record.city.toLowerCase().includes(searchLower) ||
        record.department.toLowerCase().includes(searchLower)
    );
  }

  const start = batchIndex * batchSize;
  const end = Math.min(start + batchSize, filteredData.length);
  const batchRecords = filteredData.slice(start, end);

  const totalBatches = Math.ceil(filteredData.length / batchSize);
  const hasMore = end < filteredData.length;

  res.json({
    success: true,
    data: batchRecords,
    pagination: {
      batchIndex,
      batchSize,
      totalRecords: filteredData.length,
      currentBatch: batchRecords.length,
      totalBatches,
      hasMore,
      progress: {
        current: end,
        total: filteredData.length,
        percentage: Math.floor((end / filteredData.length) * 100),
      },
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API Endpoints:`);
  console.log(`GET /api/records/batch?batchIndex=0&batchSize=5000`);
});
