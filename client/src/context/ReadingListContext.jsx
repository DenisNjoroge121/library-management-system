import React, { createContext, useContext, useEffect, useReducer } from 'react';

const ReadingListContext = createContext(null);

const STORAGE_KEY_PREFIX = 'library_reading_list';

function getStorageKey(userEmail) {
  return userEmail ? `${STORAGE_KEY_PREFIX}_${userEmail.toLowerCase()}` : `${STORAGE_KEY_PREFIX}_guest`;
}

function loadInitialItems(userEmail = null) {
  try {
    const raw = localStorage.getItem(getStorageKey(userEmail));
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function readingListReducer(state, action) {
  switch (action.type) {
    case 'ADD_BOOK': {
      const book = action.payload;
      if (!book || book.id === undefined || book.id === null) return state;
      const exists = state.some((item) => String(item.id) === String(book.id));
      if (exists) return state;
      return [...state, book];
    }

    case 'REMOVE_BOOK': {
      const targetId = action.payload;
      return state.filter((item) => String(item.id) !== String(targetId));
    }

    case 'CLEAR_LIST': {
      return [];
    }

    case 'SET_LIST': {
      return Array.isArray(action.payload) ? action.payload : [];
    }

    default:
      return state;
  }
}

export function ReadingListProvider({ children }) {
  const [items, dispatch] = useReducer(readingListReducer, undefined, () =>
    loadInitialItems(null),
  );

  useEffect(() => {
    try {
      const userRaw = localStorage.getItem('user');
      const user = userRaw ? JSON.parse(userRaw) : null;
      localStorage.setItem(getStorageKey(user?.email), JSON.stringify(items));
    } catch {
      // Ignore storage quota or access errors
    }
  }, [items]);

  const addBook = (book) => dispatch({ type: 'ADD_BOOK', payload: book });
  const removeBook = (bookId) => dispatch({ type: 'REMOVE_BOOK', payload: bookId });
  const clearList = () => dispatch({ type: 'CLEAR_LIST' });

  // Stretch: merge guest reading list into the logged-in user's list on login
  const mergeGuestListOnLogin = (userEmail) => {
    try {
      const guestRaw = localStorage.getItem(getStorageKey(null));
      const guestItems = guestRaw ? JSON.parse(guestRaw) : [];

      const accountRaw = localStorage.getItem(getStorageKey(userEmail));
      const accountItems = accountRaw ? JSON.parse(accountRaw) : [];

      const mergedMap = new Map();
      for (const item of Array.isArray(accountItems) ? accountItems : []) {
        if (item?.id !== undefined) mergedMap.set(String(item.id), item);
      }
      for (const item of Array.isArray(guestItems) ? guestItems : []) {
        if (item?.id !== undefined) mergedMap.set(String(item.id), item);
      }

      const merged = Array.from(mergedMap.values());
      localStorage.setItem(getStorageKey(userEmail), JSON.stringify(merged));
      localStorage.removeItem(getStorageKey(null));
      dispatch({ type: 'SET_LIST', payload: merged });
    } catch {
      dispatch({ type: 'SET_LIST', payload: loadInitialItems(userEmail) });
    }
  };

  return (
    <ReadingListContext.Provider
      value={{
        items,
        count: items.length,
        dispatch,
        addBook,
        removeBook,
        clearList,
        mergeGuestListOnLogin,
      }}
    >
      {children}
    </ReadingListContext.Provider>
  );
}

export function useReadingList() {
  const context = useContext(ReadingListContext);
  if (!context) {
    throw new Error('useReadingList must be used within a ReadingListProvider');
  }
  return context;
}