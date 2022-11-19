import {
  Card,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography
} from '@mui/material';
import HeaderTooltip from 'src/components/common/HeaderTooltip';
import { SalesBestseller } from 'src/models/types';

export type BestsellerListProps = {
  bestsellers: SalesBestseller[];
};

const BestsellerList = ({ bestsellers }: BestsellerListProps) => {
  return (
    <Card
      style={{ padding: '0.5em 2em 2em', height: '48vh', overflow: 'auto' }}
    >
      <HeaderTooltip
        title={'Bestsellers'}
        tooltipText={'Bestseller items for TKG'}
      />
      <Divider className='full-divider' />
      {bestsellers.length ? (
        <List>
          {bestsellers.map((bestseller) => (
            <div key={bestseller.productname}>
              <ListItem>
                <ListItemText
                  primary={bestseller.productname}
                  secondary={`${bestseller.quantity} items sold`}
                />
                <Divider />
              </ListItem>
              <Divider variant='middle' component='li' light />
            </div>
          ))}
        </List>
      ) : (
        <Typography sx={{ fontSize: '0.8em', opacity: 0.8, mt: 3 }}>
          No orders placed within current time range.
        </Typography>
      )}
    </Card>
  );
};

export default BestsellerList;
