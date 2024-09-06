import React from 'react';

import styled from '@emotion/styled';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import {
  Box,
  Button,
  FormGroup,
  FormLabel,
  Checkbox as MuiCheckbox,
  FormControlLabel as MuiFormControlLabel,
  Popover,
  TextField,
  Typography,
} from '@mui/material';

import { useCalendarHeaderFiltersLogic } from './calendar-header-filters.logic';

const Checkbox = styled(MuiCheckbox)`
  padding: 0;
`;

const FormControlLabel = styled(MuiFormControlLabel)`
  border: none;
  padding-left: 0;
`;

type Props = {
  anchorEl: HTMLButtonElement | null;
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
};

const CalendarHeaderFilters = (props: Props) => {
  const { anchorEl, setAnchorEl } = props;

  const { data, handlers } = useCalendarHeaderFiltersLogic(props);

  return (
    <>
      <Box>
        <Button
          color="primary"
          variant="contained"
          size="small"
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          <FilterAltOutlinedIcon />
          Filters{' '}
          {data.enabledFiltersCounter > 0 ? (
            <>({data.enabledFiltersCounter})</>
          ) : null}
        </Button>
      </Box>

      <Popover
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        open={!!anchorEl}
      >
        <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Box sx={{ display: 'flex', gap: 8 }}>
            {data.filters.map((filter) => (
              <FormGroup sx={{ gap: 2 }} key={filter.title}>
                <FormLabel>
                  <Typography variant="h4" color={'text.primary'}>
                    {filter.title}
                  </Typography>
                </FormLabel>

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    maxHeight: '125px',
                    flexWrap: 'wrap',
                    gap: 1,
                  }}
                >
                  {filter.checkboxes.map((checkbox) => (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                      key={checkbox.title}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={
                              data.params[checkbox.query]?.includes(
                                checkbox.value
                              ) || false
                            }
                            onChange={(e) =>
                              handlers.handleFilterCheckboxChange(e, checkbox)
                            }
                          />
                        }
                        label={checkbox.title}
                      />
                      {checkbox.withInput ? (
                        <TextField
                          sx={{ width: 'fit-content', maxWidth: 100 }}
                          size="small"
                          onChange={(e) =>
                            handlers.handleFilterInputChange(
                              e.target.value,
                              checkbox
                            )
                          }
                        />
                      ) : null}
                    </Box>
                  ))}
                </Box>
              </FormGroup>
            ))}
          </Box>

          <Box>
            <Button
              variant="contained"
              size="small"
              onClick={handlers.handleApplyFilters}
              sx={{ mr: 3 }}
            >
              Apply
            </Button>
            <Button
              variant="contained"
              size="small"
              color="error"
              onClick={handlers.handleClearFilters}
            >
              Clear all
            </Button>
          </Box>
        </Box>
      </Popover>
    </>
  );
};

export default CalendarHeaderFilters;
