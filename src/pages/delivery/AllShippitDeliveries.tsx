import React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import '../../styles/pages/delivery/delivery.scss';
import '../../styles/common/common.scss';
import { DeliveryOrder } from '../../models/types';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import { getAllShippitDeliveries } from 'src/services/deliveryServices';
import { useNavigate } from 'react-router';
import moment from 'moment';
import ShippitDeliveryCellAction from 'src/components/delivery/ShippitDeliveryCellAction';

const columns: GridColDef[] = [
  { field: 'shippitTrackingNum', headerName: 'Tracking Number', flex: 1 },
  { field: 'deliveryMode', headerName: 'Delivery Mode', flex: 1 },
  {
    field: 'deliveryDate',
    headerName: 'Delivery Date',
    flex: 1,
    valueGetter: (params: GridValueGetterParams) => {
      if (params.value !== null) {
        let date = params.value;
        let valueFormatted = moment(date).format('DD/MM/YYYY');
        return valueFormatted;
      } else {
        return 'Delivery in Progress';
      }
    }
  },
  {
    field: 'action',
    headerName: 'Action',
    headerAlign: 'right',
    align: 'right',
    flex: 1,
    renderCell: ShippitDeliveryCellAction
  }
];

const AllShippitDeliveries = () => {
  const navigate = useNavigate();

  const [deliveryData, setDeliveryData] = React.useState<DeliveryOrder[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    // TODO: implement error callback
    setLoading(true);
    asyncFetchCallback(
      getAllShippitDeliveries(),
      (res) => {
        setLoading(false);
        setDeliveryData(res);
      },
      () => setLoading(false)
    );
  }, []);

  return (
    <div className='delivery-orders'>
      <div className='shippit-deliveries-heading'>
        <h1>All Shippit Deliveries</h1>
      </div>
      <DataGrid
        columns={columns}
        rows={deliveryData}
        autoHeight
        loading={loading}
        getRowId={(row) => row.shippitTrackingNum}
      />
    </div>
  );
};

export default AllShippitDeliveries;
