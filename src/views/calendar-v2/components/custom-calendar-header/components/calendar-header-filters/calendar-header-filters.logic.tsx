import type React from "react";
import { useRef, useState } from "react";

import {
  calendarV2Filters,
  slotRanges,
} from "~/views/calendar-v2/calendar-v2.mock";

import type { CalendarFilterCheckbox } from "../../../../../../basics/types/calendar.type";

type Props = {
  anchorEl: HTMLButtonElement | null;
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
};

export const useCalendarHeaderFiltersLogic = (props: Props) => {
  const { anchorEl, setAnchorEl } = props;

  const [params, setParams] = useState<{ [key: string]: string }>({});

  const firstRender = useRef(false);

  const enabledFiltersCounter = Object.values(params)
    .filter(Boolean)
    .map((f) => f.split(","))
    .flat().length;

  const filters = calendarV2Filters(slotRanges.data || []);

  const updateParams = (
    newSearchParams = {},
    clearSearchParams: string[] = []
  ) => {
    const searchParamsObject: { [key: string]: string } = params;

    clearSearchParams.forEach((key) => delete searchParamsObject[key]);

    setParams((prev) => ({
      ...prev,
      ...searchParamsObject,
      ...newSearchParams,
    }));
  };

  const handleFilterCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    checkbox: CalendarFilterCheckbox
  ) => {
    const checked = e.target.checked;
    let query = params[checkbox.query as keyof typeof params]?.split(",") || [];

    if (checked) {
      query.push(checkbox.value);
    } else {
      const index = query.indexOf(checkbox.value);
      if (index !== -1) {
        query.splice(index, 1);
      }
      if (checkbox.withInput) {
        query = [];
      }
    }

    const updatedParams =
      query.length > 0 ? { [checkbox.query]: query.join(",") } : null;

    updateParams(updatedParams || {}, [checkbox.query]);
  };

  const handleFilterInputChange = (
    value: string,
    checkbox: CalendarFilterCheckbox
  ) => {
    const updatedParams =
      value.trim() !== "" ? { [checkbox.query]: value } : null;

    updateParams(updatedParams || {}, [checkbox.query]);
  };

  const handleApplyFilters = () => {
    const keysLength = Object.keys(params).length;

    setAnchorEl(null);
  };

  const handleClearFilters = () => {
    setParams({});
    setAnchorEl(null);
  };

  return {
    data: { enabledFiltersCounter, params, filters },
    state: {},
    setState: {},
    handlers: {
      handleFilterCheckboxChange,
      handleFilterInputChange,
      handleApplyFilters,
      handleClearFilters,
    },
  };
};
