import { useCallback } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { library, getMedia, type, filterType, status, filterStatus, search, searchLibrary, sort, selectSort, ascending, reverseSort } from './mediaSlice';

export const useLibrarySelect = () => {
    const selectorLibrary = createSelector([library, type, status, search, sort, ascending], (library, type, status, search, sort, ascending) => {
        /* Creates a single filtering function based on different filter parameters */
        const filtering = (media) => {
            return media.type == type && 
            ( search ? media.title.toLowerCase().includes(search.toLowerCase()) : true ) &&
            ( status != 'all' ? media.status == status : true )
        };
        switch (sort) {
            /* Second 'toSorted' when ascending is true returns the normal sorted array */
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

export const useSearchLibrary = () => {
    const dispatch = useDispatch();
    return useCallback((query) => {
        dispatch(searchLibrary(query));
    }, [dispatch, searchLibrary])
}