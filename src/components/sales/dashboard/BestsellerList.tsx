import { Card, Divider, List, ListItem, ListItemText } from '@mui/material';

export interface BestSeller {
  productName: string;
  quantity: number;
}

export type BestsellerListProps = {
  bestsellers: BestSeller[];
};

const BestsellerList = ({ bestsellers }: BestsellerListProps) => {
  return (
    <Card style={{ padding: '0.5em 2em 2em', height: '48vh' }}>
      <h3>Bestsellers</h3>
      <Divider className='full-divider' sx={{ mb: 3 }} />
      <List>
        {bestsellers.map((bestseller) => (
          <div key={bestseller.productName}>
            <ListItem>
              <ListItemText
                primary={bestseller.productName}
                secondary={`${bestseller.quantity} items sold`}
              />
              <Divider />
            </ListItem>
            <Divider variant='middle' component='li' light />
          </div>
        ))}
      </List>
    </Card>
  );
};

export default BestsellerList;
