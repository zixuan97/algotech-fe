import { Grid, Typography } from '@mui/material';
import { User } from 'src/models/types';

interface props {
  user: User;
}

const AccountInfoGrid = ({ user }: props) => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={6}>
        <div>
          <h4>First Name</h4>
          <Typography>{user?.firstName}</Typography>
        </div>
      </Grid>
      <Grid item xs={6}>
        <div>
          <h4>Last Name</h4>
          <Typography>{user?.lastName}</Typography>
        </div>
      </Grid>
      <Grid item xs={6}>
        <div>
          <h4>Email</h4>
          <Typography>{user?.email}</Typography>
        </div>
      </Grid>
      <Grid item xs={6}>
        <div>
          <h4>Role</h4>
          <Typography>
            {user?.role} ({user?.status})
          </Typography>
        </div>
      </Grid>
    </Grid>
  );
};

export default AccountInfoGrid;
