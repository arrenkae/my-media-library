import { createSelector } from "@reduxjs/toolkit";
import { useSelector, useDispatch } from "react-redux";
import { useCallback } from 'react';
import {  } from './mediaSlice';

export const useSorter = () => {
    const selectorType = createSelector([], () => {
    });
    return useSelector(selectorType);
};