import "tui-grid/dist/tui-grid.css";
import Grid from "@toast-ui/react-grid";

const data = [
  { id: 1, name: "Editor" },
  { id: 2, name: "Grid" },
  { id: 3, name: "Chart" },
];

const columns = [
  { name: "id", header: "ID" },
  { name: "name", header: "Name" },
];

export default function TmpGrid() {
  return (
    <Grid
      data={data}
      columns={columns}
      rowHeight={25}
      bodyHeight={100}
      rowHeaders={["rowNum"]}
      onEditingStart={() => console.log("aaaaa")}
    />
  );
}
