import React, { useState, useEffect, useRef, useCallback } from "react";
import { List } from "react-window";
import { Row } from "../components/Row";
import { debounce } from "lodash";

export interface Record {
  id: number;
  name: string;
  email: string;
  phone: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  officeAddress: string;
  officePhone: string;
  department: string;
  designation: string;
  employeeId: string;
  dateOfJoining: string;
  manager: string;
  salary: string;
  status: string;
  notes: string;
  lastUpdated: string;
}

interface Progress {
  current: number;
  total: number;
  percentage: number;
}

interface PaginationInfo {
  batchIndex: number;
  batchSize: number;
  totalRecords: number;
  currentBatch: number;
  totalBatches: number;
  hasMore: boolean;
  progress: Progress;
}

interface ApiResponse {
  success: boolean;
  data: Record[];
  pagination: PaginationInfo;
}

const TelephoneDirectory: React.FC = () => {
  const [filteredRecords, setFilteredRecords] = useState<Record[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const abortControllerRef = useRef<AbortController | null>(null);

  const [progress, setProgress] = useState<Progress>({
    current: 0,
    total: 0,
    percentage: 0,
  });

  const API_BASE_URL = "http://localhost:3001/api";

  const fetchDataInBatches = async (
    onBatchReceived: (batchRecords: Record[]) => void,
    onProgress: (progressData: Progress) => void,
    search = ""
  ): Promise<void> => {
    const BATCH_SIZE = 20000;
    let batchIndex = 0;
    let hasMore = true;

    while (hasMore) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/records/batch?batchIndex=${batchIndex}&batchSize=${BATCH_SIZE}&search=${encodeURIComponent(
            search
          )}`,
          { signal: abortControllerRef.current?.signal }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: ApiResponse = await response.json();

        if (result.success && result.data.length > 0) {
          onBatchReceived(result.data);

          onProgress({
            current: result.pagination.progress.current,
            total: result.pagination.progress.total,
            percentage: result.pagination.progress.percentage,
          });

          hasMore = result.pagination.hasMore;
          batchIndex++;
        } else {
          hasMore = false;
        }
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          console.log("Fetch aborted");
        }
        throw error;
      }
    }
  };

  // Load initial data on mount
  useEffect(() => {
    abortControllerRef.current = new AbortController();

    const loadData = async () => {
      try {
        setIsLoading(true);
        await fetchDataInBatches(
          (batchRecords: Record[]) => {
            setFilteredRecords((prevFiltered) => [
              ...prevFiltered,
              ...batchRecords,
            ]);
          },
          (progressData: Progress) => {
            setProgress(progressData);
          }
        );
        setIsLoading(false);
      } catch (err) {
        console.error("Error loading data:", err);
        setIsLoading(false);
      }
    };

    loadData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const performSearch = useCallback(
    async (searchValue: string) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      try {
        setIsLoading(true);
        setFilteredRecords([]);
        setProgress({ current: 0, total: 0, percentage: 0 });

        await fetchDataInBatches(
          (batchRecords: Record[]) => {
            setFilteredRecords((prev) => [...prev, ...batchRecords]);
          },
          (progressData: Progress) => {
            setProgress(progressData);
          },
          searchValue
        );
        setIsLoading(false);
      } catch (err) {
        console.error("Error searching data:", err);
      }
    },
    [filteredRecords]
  );

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchValue: string) => {
      performSearch(searchValue);
    }, 500),
    [performSearch]
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  return (
    <div>
      <div
        style={{
          padding: "20px",
          background: "#f5f5f5",
        }}
      >
        <input
          type="text"
          placeholder="Search by name, email, phone, employee ID, or city..."
          value={searchTerm}
          onChange={handleSearch}
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <div style={{ marginTop: "10px", color: "#666" }}>
          Showing {filteredRecords.length.toLocaleString()} records
          {isLoading && (
            <span
              style={{
                marginLeft: "15px",
                color: "#4CAF50",
                fontWeight: "bold",
              }}
            >
              {progress.percentage}% complete
            </span>
          )}
        </div>
      </div>

      <div>
        {filteredRecords.length === 0 && isLoading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "#666",
              fontSize: "18px",
            }}
          >
            Connecting to server and fetching data...
          </div>
        ) : (
          <div>
            <List
              rowComponent={Row}
              rowCount={filteredRecords.length}
              rowHeight={35}
              rowProps={{ records: filteredRecords }}
              style={{ height: "80vh", margin: "10px 0" }}
            />
            {isLoading && (
              <div style={{ textAlign: "center", padding: "10px" }}>
                Loading lattest...
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TelephoneDirectory;
