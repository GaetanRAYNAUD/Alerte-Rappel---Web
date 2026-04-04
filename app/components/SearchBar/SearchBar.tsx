import HistoryIcon from '@mui/icons-material/History';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputBase from '@mui/material/InputBase';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import { alpha, styled } from '@mui/material/styles';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { getSearchHistory } from '~/utils/storage';

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
  const [history, setHistory] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const loadHistory = useCallback(() => {
    setHistory(getSearchHistory());
  }, []);

  const submitSearch = useCallback((query: string) => {
    const trimmed = query.trim();
    if (trimmed) {
      setOpen(false);
      onSearch(trimmed);
      loadHistory();
    }
  }, [onSearch, loadHistory]);

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

  const handleFocus = () => {
    loadHistory();
    setOpen(true);
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
    <Search ref={anchorRef}>
      <InputBase
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
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
      <Popper open={open && history.length > 0} anchorEl={anchorRef.current} sx={{ zIndex: 1200, width: anchorRef.current?.offsetWidth }}>
        <Paper elevation={3} sx={{ mt: 1 }}>
          <List dense>
            {history.map((item) => (
              <ListItemButton key={item} onClick={() => {
                setValue(item);
                submitSearch(item);
              }}>
                <ListItemIcon><HistoryIcon fontSize="small" /></ListItemIcon>
                <ListItemText primary={item} />
              </ListItemButton>
            ))}
          </List>
        </Paper>
      </Popper>
    </Search>
  );
}
