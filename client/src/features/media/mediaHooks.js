import { createSelector } from "@reduxjs/toolkit";
import { useSelector, useDispatch } from "react-redux";
import { useCallback } from 'react';
import { library, type, filterType, status, sort, filterStatus, selectSort, getMedia, reverseSort, reverse } from './mediaSlice';

export const useLibrarySelect = () => {
    const sellectorLibrary = createSelector([library, type, status, sort], (library, type, status, sort) => {
        let filtering;
        if (status == 'All') {
            filtering = (media) => media.type == type;
        } else {
            filtering = (media) => media.type == type && media.status == status;
        }
        switch (sort) {
            case 'updated':
                return library.filter(filtering).toReversed();            
            case 'name':
                return library.filter(filtering).toSorted((a, b) => a.title.localeCompare(b.title));
            case 'rating':
                return library.filter(filtering).toSorted((a, b) => b.rating - a.rating);
            case 'release':
                return library.filter(filtering).toSorted((a, b) => new Date(b.release_date) - new Date(a.release_date));
        }
    });
    return useSelector(sellectorLibrary);
};

export const useGetMedia = () => {
    const dispatch = useDispatch();
    return useCallback(() => {
        dispatch(getMedia());
    }, [dispatch, getMedia])
}

export const useFilterType = () => {
    const dispatch = useDispatch();
    return useCallback((type) => {
        dispatch(filterType(type));
    }, [dispatch, filterType])
  }

export const useFilterStatus = () => {
    const dispatch = useDispatch();
    return useCallback((status) => {
        dispatch(filterStatus(status));
    }, [dispatch, filterStatus])
}

export const useSelectSort = () => {
    const dispatch = useDispatch();
    return useCallback((sort) => {
        dispatch(selectSort(sort));
    }, [dispatch, selectSort])
}