import type { RowComponentProps } from "react-window";
import type { Record } from "../views/TelephoneDirectory";

type RowProps = {
  records: Record[];
};

export function Row({ index, style, records }: RowComponentProps<RowProps>) {
  const record = records[index];

  return (
    <div style={style}>
      <div
        key={record.id}
        style={{
          padding: "2px 10px",
          marginBottom: "10px",
          background: "white",
          border: "1px solid #ddd",
          borderRadius: "4px",
        }}
      >
        <div style={{ fontSize: "14px", color: "#555", lineHeight: "1.6" }}>
          <div>
            <strong>ID:</strong> {record.name} | <strong>Phone:</strong>{" "}
            {record.phone} | <strong>Mobile:</strong> {record.mobile}
            <strong>Email:</strong> {record.email}
          </div>
        </div>
      </div>
    </div>
  );
}
