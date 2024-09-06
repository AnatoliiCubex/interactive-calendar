import { useCallback, useEffect, useState } from "react";

import { debounce } from "@mui/material";

export const useDebouncedSearchString = () => {
  const [searchString, setSearchString] = useState("");
  const [debouncedSearchString, setDebouncedSearchString] = useState("");

  const debounced = useCallback(
    debounce((searchString) => {
      setDebouncedSearchString(searchString);
    }, 300),
    [setDebouncedSearchString]
  );

  useEffect(() => {
    debounced(searchString);
  }, [searchString]);

  return { searchString, setSearchString, debouncedSearchString };
};
