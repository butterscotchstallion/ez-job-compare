import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

export default function JobsDataGrid(props: any) {
    const columns: GridColDef[] = [
        { field: 'title', headerName: 'Title', width: 70 },
        { field: 'description', headerName: 'Description' },
        { field: 'createdAt', headerName: 'Added On', width: 100 },
    ];
    return (
        <div style={{ width: '100%' }}>
          <DataGrid
            rows={props.jobs}
            columns={columns}
            checkboxSelection
          />
        </div>
      );
};