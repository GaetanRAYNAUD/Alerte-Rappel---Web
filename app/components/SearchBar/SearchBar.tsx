import ClearIcon from '@mui/icons-material/Clear';
import HistoryIcon from '@mui/icons-material/History';
import SearchIcon from '@mui/icons-material/Search';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
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
import type { SearchSuggestion } from '~/store/alertesApi';
import { useLazySuggestAlertesQuery } from '~/store/alertesApi';
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
}

export function SearchBar({ onSearch, defaultValue = '' }: SearchBarProps) {
  const intl = useIntl();
  const [value, setValue] = useState(defaultValue);
  const [history, setHistory] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const suggestTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const [triggerSuggest] = useLazySuggestAlertesQuery();

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

  const fetchSuggestions = useCallback(
    (query: string) => {
      if (suggestTimerRef.current) {
        clearTimeout(suggestTimerRef.current);
      }
      const trimmed = query.trim();
      if (trimmed.length < 2) {
        setSuggestions([]);
        return;
      }
      suggestTimerRef.current = setTimeout(async () => {
        try {
          const result = await triggerSuggest(trimmed).unwrap();
          setSuggestions(result);
        } catch {
          setSuggestions([]);
        }
      }, 300);
    },
    [triggerSuggest]
  );

  useEffect(() => {
    return () => {
      if (suggestTimerRef.current) {
        clearTimeout(suggestTimerRef.current);
      }
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    fetchSuggestions(newValue);
  };

  const handleFocus = () => {
    loadHistory();
    setOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      submitSearch(value);
    }
  };

  const hasItems = history.length > 0 || suggestions.length > 0;

  return (
    <Search ref={ anchorRef }>
      <InputBase
        value={ value }
        onChange={ handleChange }
        onFocus={ handleFocus }
        onBlur={ () => setTimeout(() => setOpen(false), 200) }
        onKeyDown={ handleKeyDown }
        placeholder={ intl.formatMessage({ id: 'search.placeholder' }) }
        sx={ { color: 'inherit', width: '100%', pl: 1.5, pr: 0.5, py: 0.5 } }
        endAdornment={
          <InputAdornment position="end">
            { value && (
              <IconButton
                size="small"
                sx={ { color: 'inherit' } }
                onClick={ () => {
                  setValue('');
                  setSuggestions([]);
                } }
                aria-label={ intl.formatMessage({ id: 'search.clear' }) }
              >
                <ClearIcon fontSize="small"/>
              </IconButton>
            ) }
            <IconButton
              size="small"
              sx={ { color: 'inherit' } }
              onClick={ () => submitSearch(value) }
            >
              <SearchIcon/>
            </IconButton>
          </InputAdornment>
        }
      />

      <Popper open={ open && hasItems } anchorEl={ anchorRef.current }
              sx={ { zIndex: 1200, width: anchorRef.current?.offsetWidth } }>
        <Paper elevation={ 3 } sx={ { mt: 1 } }>
          <List dense>
            { history.map((item) => (
              <ListItemButton key={ item } onClick={ () => {
                setValue(item);
                submitSearch(item);
              } }>
                <ListItemIcon><HistoryIcon fontSize="small"/></ListItemIcon>
                <ListItemText primary={ item }/>
              </ListItemButton>
            )) }
            { history.length > 0 && suggestions.length > 0 && <Divider/> }
            { suggestions.map((s) => (
              <ListItemButton key={ `${ s.type }-${ s.text }` } onClick={ () => {
                setValue(s.text);
                submitSearch(s.text);
              } }>
                <ListItemIcon><SearchIcon fontSize="small"/></ListItemIcon>
                <ListItemText primary={ s.text }/>
                <Chip label={ s.count } size="small" variant="outlined"/>
              </ListItemButton>
            )) }
          </List>
        </Paper>
      </Popper>
    </Search>
  );
}
