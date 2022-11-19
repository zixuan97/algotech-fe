import { HelpOutline } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import '../../styles/common/common.scss';

type HeaderTooltipProps = {
  title: string;
  tooltipText: string;
};

const HeaderTooltip = ({ title, tooltipText }: HeaderTooltipProps) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%'
      }}
    >
      <h3>{title}</h3>
      <Tooltip
        title={tooltipText}
        enterDelay={100}
        placement="right-start" 
        style={{marginLeft: '0.5%'}}
      >
        <HelpOutline fontSize='small' />
      </Tooltip>
    </div>
  );
};

export default HeaderTooltip;
