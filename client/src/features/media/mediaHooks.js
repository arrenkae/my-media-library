import { createSelector } from "@reduxjs/toolkit";
import { useSelector, useDispatch } from "react-redux";
import { useCallback } from 'react';
import { library, type, filterType } from './mediaSlice';

export const useTypeSelect = () => {
    const selectorType = createSelector([library, type], (library, type) => {
        return library.filter(media => media.type == type);
    });
    return useSelector(selectorType);
};

export const useFilterType = () => {
    const dispatch = useDispatch();
    return useCallback((type) => {
        dispatch(filterType(type));
    }, [dispatch, filterType])
  }