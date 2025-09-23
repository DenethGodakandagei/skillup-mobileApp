import { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

const initialState = {
  cvData: null,
  jobSuggestions: [],
  loading: false,
  error: null,
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload, error: null };
    case 'SET_CV_DATA':
      return { ...state, cvData: action.payload, loading: false };
    case 'SET_JOB_SUGGESTIONS':
      return { ...state, jobSuggestions: action.payload, loading: false };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_DATA':
      return { ...state, cvData: null, jobSuggestions: [], error: null };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};