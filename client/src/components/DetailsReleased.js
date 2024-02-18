import { useState, useEffect, useContext, memo } from "react";
import { useSelector } from "react-redux";
import { Typography, FormControl, Rating, Slider, Stack, InputAdornment, OutlinedInput, FormHelperText, InputLabel, Select, MenuItem } from '@mui/material';
import { types, statusNames, LibraryContext } from "./Library";

const DetailsReleased = ({media, status, setStatus, progress, setProgress, rating, setRating}) => {
    const { type } = useContext(LibraryContext);
    const [progressSeasons, setProgressSeasons] = useState(0);
    const [tempProgress, setTempProgress] = useState();

    useEffect(()=>{
        if (media.progress) setTempProgress(media.progress);
        if (media.seasons) {
            const currentSeason = media.seasons.findLast(season => {
                return season[1] <= progress;
            })
            setProgressSeasons(currentSeason ? currentSeason[0] : 0);
        }
    }, [])

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
        if (e.target.value === 'completed') {
            setProgress(media.progress_max);
            if (media.seasons) {
                setProgressSeasons(media?.seasons.length);
            }
        } else if (e.target.value === 'backlog') {
            setProgress(0);
            if (media.seasons) {
                setProgressSeasons(0);
            }
        } else {
            setProgress(tempProgress);
        }
    };

    const handleProgressChange = (e) => {
        /* Prevents non-numeric input */
        setProgress(e.target.value === '' ? 0 : Number(e.target.value));
        if (media.seasons) {
            const currentSeason = media.seasons.findLast(season => {
                return season[1] <= progress;
            })
            setProgressSeasons(currentSeason ? currentSeason[0] : 0);
        }
        if (e.target.value == media?.progress_max) {
            setStatus('completed');
        } else if (e.target.value == 0) {
            setStatus('backlog');
        } else {
            setStatus(media.status ? (media.status != 'backlog' && media.status != 'completed') ? media.status : 'active' : 'active');
            setTempProgress(progress);
        }
    }

    const handleSeasonChange = (e) => {
        setProgressSeasons(e.target.value);
        setProgress(e.target.value != 0 ? media.seasons.find(season => season[0] == e.target.value)[1] : 0);
        if (e.target.value == media.seasons.length) {
            setProgress(media.progress_max);
            setStatus('completed');
        } else if (e.target.value == 0) {
            setStatus('backlog');
        } else {
            setStatus(media.status ? (media.status != 'backlog' && media.status != 'completed') ? media.status : 'active' : 'active');
            setTempProgress(progress);
        }
    }

    return (
        <>
            <FormControl sx={{ m: 1, mt: 2, minWidth: 120 }} size="small">
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                    labelId="status-select-label"
                    id="status-select"
                    value={status}
                    label="Status"
                    onChange={handleStatusChange}
                    >
                { Object.keys(statusNames).map(status => <MenuItem key={status} value={status}>{statusNames[status].replace('verb', types[type].verb)}</MenuItem>) }
                </Select>
            </FormControl>
            <Rating
                sx={{ m: 3 }}
                name="rating"
                value={rating}
                precision={0.5}
                onChange={(e, newValue) => {
                    setRating(newValue);
                }}
            />
            <Typography id="input-slider" gutterBottom>
                    Progress: {Math.round(progress / media.progress_max * 100)}%
            </Typography>
            {/* Slider and the number input form display the same value and if one changes the other changes as well */}
            <Slider
                value={progress}
                onChange={handleProgressChange}
                max={media.progress_max}
                valueLabelDisplay="auto"
                aria-labelledby="progress-slider"
                sx={{ mb: 4, display: { xs: 'none', sm: 'flex' }}}
                marks={
                    media.seasons ?
                    media.seasons.map(season => {
                        return {
                            value: season[1],
                            label: 'S' + season[0]
                        }
                    })
                    : null
                }
            />
            <Stack spacing={1} direction={{ sm: 'column', md: 'row' }} flexDirection="flex-start" >
                <FormControl variant="outlined">
                    <OutlinedInput
                        id="progress-number-input"
                        value={progress}
                        onChange={handleProgressChange}
                        endAdornment={<InputAdornment position="end"> / {media.progress_max}</InputAdornment>}
                        inputProps={{
                        min: 0,
                        max: media.progress_max,
                        type: 'number',
                        'aria-labelledby': 'input-slider',
                        }}
                        sx={{ maxWidth: '14ch' }}
                    />
                    <FormHelperText id="season-helper-text">{types[type]?.progress}</FormHelperText>
                </FormControl>
                {
                    media.seasons ?
                        <FormControl variant="outlined">
                            <OutlinedInput
                                id="season-number-input"
                                type="number"
                                inputProps={{ min: 0, max: media.seasons.length }}
                                value={progressSeasons}
                                endAdornment={<InputAdornment position="end"> / {media.seasons.length}</InputAdornment>}
                                onChange={handleSeasonChange}
                                sx={{ maxWidth: '12ch' }}
                            />
                            <FormHelperText id="season-helper-text">seasons</FormHelperText>
                        </FormControl>
                    : null
                }
            </Stack>
        </>
    )
};

export default memo(DetailsReleased);