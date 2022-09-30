import { Card, List, ListItem, Stack, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import { startCase, toPairs } from 'lodash';
import { ShopeePerformanceCategory } from 'src/services/shopPerformanceService';

type ShopeePerformanceCardProps = {
  performanceCategory: ShopeePerformanceCategory;
};

const columns: GridColDef[] = [
  {
    field: 'dataType',
    headerName: 'Data Type',
    flex: 2,
    valueFormatter: (params) => startCase(params.value)
  },
  { field: 'my_shop_performance', headerName: 'My Performance', flex: 1 },
  { field: 'target', headerName: 'Target', flex: 1 },
  {
    field: 'penalty_points',
    headerName: 'Penalty Points',
    flex: 1,
    valueGetter: (params) => (params.value === 'null' ? 'NA' : params.value)
  }
];

const ShopeePerformanceCard = ({
  performanceCategory
}: ShopeePerformanceCardProps) => {
  return (
    <Card className='card'>
      <div>
        <List sx={{ width: 1 }}>
          {toPairs(performanceCategory).map((cat) => (
            <ListItem key={cat[0]} sx={{ mb: 1 }}>
              <Stack sx={{ width: 1 }}>
                <Typography sx={{ fontSize: 16, mb: 2 }}>
                  {startCase(cat[0])}
                </Typography>
                <DataGrid
                  columns={columns}
                  rows={toPairs(cat[1]).map((data) => ({
                    ...data[1],
                    dataType: data[0]
                  }))}
                  getRowId={(row) => row.dataType}
                  autoHeight
                  hideFooter
                />
              </Stack>
            </ListItem>
          ))}
        </List>
      </div>
    </Card>
  );
};

export default ShopeePerformanceCard;
