import type { RowComponentProps } from "react-window";
import type { PhoneRecord } from "../utils/generateData";

type RowProps = {
  records: PhoneRecord[];
};

export function Row({ index, style, records }: RowComponentProps<RowProps>) {
  const item = records[index];

  return (
    <div style={style}>
      <strong>{item.name}</strong> — {item.phone} — {item.email} -{" "}
      {item.createdAt}
    </div>
  );
}
