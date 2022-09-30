import { Cancel, CheckCircle, ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  Divider,
  Grid,
  Typography
} from '@mui/material';
import { Stack } from '@mui/system';
import parse from 'html-react-parser';
import React from 'react';
import {
  LazadaPerformance,
  LazadaScoreFormat
} from 'src/services/shopPerformanceService';
import '../../../styles/common/common.scss';

type LazadaPerformanceDashboardProps = {
  lazadaPerformance: LazadaPerformance | null;
};

const LazadaPerformanceDashboard = ({
  lazadaPerformance
}: LazadaPerformanceDashboardProps) => {
  if (lazadaPerformance === null) return null;

  const { sellerId, indicators } = lazadaPerformance;
  return (
    <div>
      <Typography sx={{ fontSize: 18, padding: '1em 0' }}>
        Seller ID: {sellerId}
      </Typography>
      <h2>Summary</h2>
      <div className='container-spread-padding'>
        {indicators.map((indicator) => (
          <React.Fragment key={indicator.name}>
            <div className='container-center-col-padding'>
              {indicator.target_respected ? (
                <CheckCircle color='success' />
              ) : (
                <Cancel color='error' />
              )}
              <Typography sx={{ textAlign: 'center', mt: 2 }}>
                {indicator.name}
              </Typography>
            </div>
          </React.Fragment>
        ))}
      </div>
      <h2>Performance Indicators</h2>
      <Divider variant='middle' sx={{ mb: 3 }} />
      <Grid container spacing={3}>
        {indicators.map((indicator) => {
          const {
            name,
            score,
            score_format,
            formatted_target,
            target_respected,
            tip
          } = indicator;
          const formattedScore =
            score &&
            `${score}${
              score_format === LazadaScoreFormat.PERCENTAGE
                ? '%'
                : score_format === LazadaScoreFormat.MINUTES
                ? 'mins'
                : ''
            }`;
          return (
            <Grid key={name} item xs={6}>
              <Card className='card'>
                <h3>{name}</h3>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls='panel1a-content'
                    id='panel1a-header'
                  >
                    <Typography>Description</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div style={{ padding: '0.5em', fontSize: '0.8em' }}>
                      {parse(tip)}
                    </div>
                  </AccordionDetails>
                </Accordion>
                <Stack
                  direction='row'
                  gap={4}
                  alignItems='center'
                  sx={{ padding: '1.5em 0 0.5em 0' }}
                >
                  <Stack direction='row' gap={1} alignItems='center'>
                    <Typography>Target met:</Typography>
                    {target_respected ? (
                      <CheckCircle color='success' />
                    ) : (
                      <Cancel color='error' />
                    )}
                  </Stack>
                  <Typography>Score: {formattedScore}</Typography>
                  <Typography>Target: {formatted_target}</Typography>
                </Stack>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

export default LazadaPerformanceDashboard;
