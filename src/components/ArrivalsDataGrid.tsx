import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { Arrival } from "../interfaces/Arrival";

interface ArrivalsDataGridProps {
    arrivals: Arrival[];
}

export default function ArrivalsDataGrid({ arrivals }: ArrivalsDataGridProps) {
    const columns = [
        { field: "id", headerName: "ID", width: 90 },
        { field: "line", headerName: "Line", width: 100 },
        { field: "towards", headerName: "Towards", width: 400 },
        { field: "destination", headerName: "Destination", width: 300 },
    ];

    const rows = arrivals.map((arrival) => ({
        id: arrival.id,
        line: arrival.lineName,
        towards: arrival.towards,
        destination: arrival.destinationName,
    }));

    return (
        <Box py={4}>
            <DataGrid
                columns={columns}
                rows={rows}
                initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
                pageSizeOptions={[5, 10, 25]}
            />
        </Box>
    );
}
