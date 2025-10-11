import { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

const initialState = {
  cvData: null,
  jobSuggestions: [],
  loading: false,
  error: null,
  // Add caching and optimization states
  cache: new Map(),
  processingStage: null, // 'ocr', 'analysis', 'complete'
  partialResults: null, // For progressive loading
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload, error: null };
    case 'SET_PROCESSING_STAGE':
      return { ...state, processingStage: action.payload };
    case 'SET_CV_DATA':
      return { ...state, cvData: action.payload };
    case 'SET_JOB_SUGGESTIONS':
      return { ...state, jobSuggestions: action.payload, processingStage: 'complete' };
    case 'SET_PARTIAL_RESULTS':
      return { ...state, partialResults: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false, processingStage: null };
    case 'CACHE_RESULT':
      const newCache = new Map(state.cache);
      newCache.set(action.payload.key, action.payload.data);
      return { ...state, cache: newCache };
    case 'CLEAR_DATA':
      return { ...state, cvData: null, jobSuggestions: [], error: null, processingStage: null, partialResults: null };
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