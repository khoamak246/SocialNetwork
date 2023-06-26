import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  content: [],
  isStillHavingContent: true,
  pageSortingFetching: {
    dateMinus: 0,
    page: 0,
    size: 3,
  },
};

export const HomePageSlice = createSlice({
  initialState,
  name: "homePage",
  reducers: {
    setContent: (state, action) => {
      return { ...state, content: action.payload };
    },
    setIsStillHavingContent: (state, action) => {
      return { ...state, isStillHavingContent: action.payload };
    },
    setPageSortingFetchingDateMinus: (state, action) => {
      return {
        ...state,
        pageSortingFetching: {
          ...state.pageSortingFetching,
          dateMinus: action.payload,
        },
      };
    },
    setPageSortingFetchingPage: (state, action) => {
      return {
        ...state,
        pageSortingFetching: {
          ...state.pageSortingFetching,
          page: action.payload,
        },
      };
    },
    setPageSortingFetching: (state, action) => {
      return {
        ...state,
        pageSortingFetching: action.payload,
      };
    },
    setResetHomePage: (state, action) => {
      return {
        content: [],
        isStillHavingContent: true,
        pageSortingFetching: {
          dateMinus: 0,
          page: 0,
          size: 3,
        },
      };
    },
  },
});

export const {
  setContent,
  setIsStillHavingContent,
  setPageSortingFetchingDateMinus,
  setPageSortingFetchingPage,
  setPageSortingFetching,
  setResetHomePage,
} = HomePageSlice.actions;
export default HomePageSlice.reducer;
