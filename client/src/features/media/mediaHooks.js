import { createSelector } from "@reduxjs/toolkit";
import { useSelector, useDispatch } from "react-redux";
import { useCallback } from 'react';
import { library, type, filterType, status, sort, filterStatus, selectSort, getMedia, reverseSort, ascending } from './mediaSlice';

export const useLibrarySelect = () => {
    const selectorLibrary = createSelector([library, type, status, sort, ascending], (library, type, status, sort, ascending) => {
        let filtering;
        if (status == 'all') {
            filtering = (media) => media.type == type;
        } else {
            filtering = (media) => media.type == type && media.status == status;
        }
        switch (sort) {
            case 'updated':
                return library.filter(filtering).toSorted((a, b) => new Date(a.user_update) - new Date(b.user_update))[ascending ? 'toSorted' : 'toReversed']();          
            case 'name':
                return library.filter(filtering).toSorted((a, b) => a.title.localeCompare(b.title))[ascending ? 'toSorted' : 'toReversed']();
            case 'rating':
                return library.filter(filtering).toSorted((a, b) => a.rating - b.rating)[ascending ? 'toSorted' : 'toReversed']();
            case 'release':
                return library.filter(filtering).toSorted((a, b) => new Date(a.release_date) - new Date(b.release_date))[ascending ? 'toSorted' : 'toReversed']();
        }
    });
    return useSelector(selectorLibrary);
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

export const useReverseSort = () => {
    const dispatch = useDispatch();
    return useCallback(() => {
        dispatch(reverseSort());
    }, [dispatch, reverseSort])
}