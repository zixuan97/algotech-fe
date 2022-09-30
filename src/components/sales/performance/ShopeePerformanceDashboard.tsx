import {
  ExpandMore,
  LocalShipping,
  ReportProblem,
  SentimentSatisfiedAlt,
  SupportAgent
} from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
  Divider,
  Typography
} from '@mui/material';
import { Stack } from '@mui/system';
import {
  ShopeePerformance,
  SHOPEE_OVERALL_PERFORMANCE
} from 'src/services/shopPerformanceService';
import '../../../styles/common/common.scss';
import ShopeePerformanceCard from './ShopeePerformanceCard';

type ShopeePerformanceDashboardProps = {
  shopeePerformance: ShopeePerformance | null;
};

type OverallPerfColor = 'success' | 'info' | 'warning' | 'error';

const ShopeePerformanceDashboard = ({
  shopeePerformance
}: ShopeePerformanceDashboardProps) => {
  if (shopeePerformance === null) return null;
  const {
    overallPerformance,
    listingViolations,
    fulfilment,
    customerSatisfaction,
    customerService
  } = shopeePerformance;
  const overallPerfColor = {
    1: 'success' as OverallPerfColor,
    2: 'info' as OverallPerfColor,
    3: 'warning' as OverallPerfColor,
    4: 'error' as OverallPerfColor
  };
  return (
    <div style={{ width: '100%' }}>
      <Stack
        direction='row'
        gap={3}
        alignItems='center'
        sx={{ padding: '1em 0' }}
      >
        <Typography sx={{ fontSize: 18 }}>Overall Performance:</Typography>
        <Chip
          label={SHOPEE_OVERALL_PERFORMANCE[overallPerformance]}
          variant='filled'
          color={overallPerfColor[overallPerformance]}
          sx={{ padding: '0 1.5em' }}
        />
      </Stack>
      <Divider variant='middle' sx={{ mb: 3 }} />
      <Accordion defaultExpanded={true}>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls='panel1a-content'
          id='panel1a-header'
        >
          <Stack
            direction='row'
            gap={2}
            alignItems='center'
            sx={{ padding: '0 1em' }}
          >
            <LocalShipping color='primary' />
            <h3>Fulfilment</h3>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <ShopeePerformanceCard performanceCategory={fulfilment} />
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded={true}>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls='panel2a-content'
          id='panel2a-header'
        >
          <Stack
            direction='row'
            gap={2}
            alignItems='center'
            sx={{ padding: '0 1em' }}
          >
            <SentimentSatisfiedAlt color='secondary' />
            <h3>Customer Satisfaction</h3>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <ShopeePerformanceCard performanceCategory={customerSatisfaction} />
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded={true}>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls='panel3a-content'
          id='panel3a-header'
        >
          <Stack
            direction='row'
            gap={2}
            alignItems='center'
            sx={{ padding: '0 1em' }}
          >
            <SupportAgent color='info' />
            <h3>Customer Service</h3>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <ShopeePerformanceCard performanceCategory={customerService} />
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded={true}>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls='panel4a-content'
          id='panel4a-header'
        >
          <Stack
            direction='row'
            gap={2}
            alignItems='center'
            sx={{ padding: '0 1em' }}
          >
            <ReportProblem color='error' />
            <h3>Listing Violations</h3>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <ShopeePerformanceCard performanceCategory={listingViolations} />
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default ShopeePerformanceDashboard;
