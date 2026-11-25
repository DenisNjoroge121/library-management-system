import React, { createContext, useContext, useEffect, useReducer } from 'react';

const ReadingListContext = createContext();

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_BOOK': {
      if (!action.payload || action.payload.id === undefined) return state;
      if (state.some((b) => String(b.id) === String(action.payload.id))) {
        return state;
      }
      return [...state, action.payload];
    }
    case 'REMOVE_BOOK':
      return state.filter((b) => String(b.id) !== String(action.payload));
    case 'CLEAR_LIST':
      return [];
    default:
      return state;
  }
}

export function ReadingListProvider({ children }) {
  const [readingList, dispatch] = useReducer(
    reducer,
    [],
    () => {
      try {
        const saved = JSON.parse(localStorage.getItem('readingList'));
        return Array.isArray(saved) ? saved : [];
      } catch {
        return [];
      }
    },
  );

  useEffect(() => {
    try {
      localStorage.setItem('readingList', JSON.stringify(readingList));
    } catch {
      // Ignore storage errors
    }
  }, [readingList]);

  const addBook = (book) => dispatch({ type: 'ADD_BOOK', payload: book });
  const removeBook = (id) => dispatch({ type: 'REMOVE_BOOK', payload: id });
  const clearList = () => dispatch({ type: 'CLEAR_LIST' });

  return (
    <ReadingListContext.Provider
      value={{
        readingList,
        items: readingList,
        count: readingList.length,
        dispatch,
        addBook,
        removeBook,
        clearList,
      }}
    >
      {children}
    </ReadingListContext.Provider>
  );
}

export const useReadingList = () => useContext(ReadingListContext);