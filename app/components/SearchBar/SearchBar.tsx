import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputBase from '@mui/material/InputBase';
import { alpha, styled } from '@mui/material/styles';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25)
  },
  width: '100%'
}));

interface SearchBarProps {
  onSearch: (query: string) => void;
  defaultValue?: string;
  debounceMs?: number;
}

export function SearchBar({ onSearch, defaultValue = '', debounceMs = 600 }: SearchBarProps) {
  const intl = useIntl();
  const [value, setValue] = useState(defaultValue);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const submitSearch = useCallback((query: string) => {
    const trimmed = query.trim();
    if (trimmed) {
      onSearch(trimmed);
    }
  }, [onSearch]);

  const debouncedSearch = useCallback(
    (query: string) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        submitSearch(query);
      }, debounceMs);
    },
    [submitSearch, debounceMs]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    debouncedSearch(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      submitSearch(value);
    }
  };

  return (
    <Search>
      <InputBase
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={intl.formatMessage({ id: 'search.placeholder' })}
        sx={{ color: 'inherit', width: '100%', pl: 1.5, pr: 0.5, py: 0.5 }}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              size="small"
              sx={{ color: 'inherit' }}
              onClick={() => submitSearch(value)}
            >
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        }
      />
    </Search>
  );
}
