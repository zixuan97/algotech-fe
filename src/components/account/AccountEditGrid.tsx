import { Grid, MenuItem, TextField } from '@mui/material';
import { User, UserRole } from 'src/models/types';
import validator from 'validator';

interface props {
  editUser: User;
  setEditUser: (user: any) => void;
}

const AccountEditGrid = ({ editUser, setEditUser }: props) => {
  const roles = Object.keys(UserRole).filter((v) => isNaN(Number(v)));

  const userFieldOnChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    setEditUser((paramUser: any) => {
      return {
        ...paramUser!,
        [key]: event.target.value
      };
    });
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={6}>
        <TextField
          fullWidth
          required
          id='outlined-quantity'
          label='First Name'
          name='firstName'
          placeholder='eg.: John'
          error={!editUser?.firstName}
          helperText={!editUser?.firstName ? 'First Name is empty!' : ''}
          value={editUser?.firstName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            userFieldOnChange(e, 'firstName')
          }
        />
      </Grid>

      <Grid item xs={6}>
        <TextField
          fullWidth
          required
          id='outlined-quantity'
          label='Last Name'
          name='lastName'
          placeholder='eg.: Tan'
          error={!editUser?.lastName}
          helperText={!editUser?.lastName ? 'Last Name is empty!' : ''}
          value={editUser?.lastName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            userFieldOnChange(e, 'lastName')
          }
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          id='outlined-quantity'
          label='Email'
          name='email'
          placeholder='eg.: johntan@gmail.com'
          helperText={
            validator.isEmail(editUser?.email!)
              ? ''
              : 'Enter a valid email: example@email.com'
          }
          error={!validator.isEmail(editUser?.email!)}
          value={editUser?.email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            userFieldOnChange(e, 'email')
          }
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          id='outlined-field'
          select
          label='Role'
          value={editUser?.role}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            userFieldOnChange(e, 'role')
          }
        >
          {roles.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
    </Grid>
  );
};

export default AccountEditGrid;
