import { useState, useEffect, useContext, memo } from "react";
import { Typography, FormControl, Rating, Slider, Stack, InputAdornment, OutlinedInput, FormHelperText, InputLabel, Select, MenuItem } from '@mui/material';
import { types, statusNames, LibraryContext } from "./Library";

const DetailsReleased = ({media, status, setStatus, progress, setProgress, rating, setRating}) => {
    const { type } = useContext(LibraryContext);
    const [progressSeasons, setProgressSeasons] = useState(0);
    /* tempProgress allows to go back to previous progress after it got automatically change on completed/backlog state */
    const [tempProgress, setTempProgress] = useState(media.progress || 0);
    /* Prevents completed and backlog media from being stuck on progress change */
    const [tempStatus, setTempStatus] = useState(media.status ? ((media.status != 'completed') && (media.status != 'backlog')) ? media.status : 'active' : 'active');

    useEffect(()=>{
        /* media.seasons is stored as an integer array, season[0] is season number, season[1] is the number (total) of the last episode of the season
        * Finding the last episode count <= than current progress we get the number of completed seasons */
        if (media.seasons) {
            const currentSeason = media.seasons.findLast(season => {
                return season[1] <= progress;
            })
            setProgressSeasons(currentSeason ? currentSeason[0] : 0);
        }
    }, [])

    const handleStatusChange = (e) => {
        /* On completed progress automatically sets to maximum, on backlog to 0; then, if the user decides to switch back, progress is restored to its previous value */
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
            if (media.seasons) {
                const currentSeason = media.seasons.findLast(season => {
                    return season[1] <= tempProgress;
                })
                setProgressSeasons(currentSeason ? currentSeason[0] : 0);
            }
            setTempStatus(e.target.value);
        }
    };

    const handleProgressChange = (e) => {
        /* Same as handleStatusChange but sets appropriate statuses on min and max progress */
        /* Prevents non-numeric input */
        setProgress(e.target.value === '' ? 0 : Number(e.target.value));
        if (media.seasons) {
            const currentSeason = media.seasons.findLast(season => {
                return season[1] <= e.target.value;
            })
            setProgressSeasons(currentSeason ? currentSeason[0] : 0);
        }
        if (e.target.value == media?.progress_max) {
            setStatus('completed');
        } else if (e.target.value == 0) {
            setStatus('backlog');
        } else {
            setStatus(tempStatus);
            setTempProgress(e.target.value);
        }
    }

    const handleSeasonChange = (e) => {
        /* On season change, progress is set to exact number of episodes from the beginning to the end of the season */
        setProgressSeasons(e.target.value);
        setProgress(e.target.value != 0 ? media.seasons.find(season => season[0] == e.target.value)[1] : 0);
        if (e.target.value == media.seasons.length) {
            setProgress(media.progress_max);
            setStatus('completed');
        } else if (e.target.value == 0) {
            setStatus('backlog');
        } else {
            setStatus(tempStatus);
            setTempProgress(e.target.value != 0 ? media.seasons.find(season => season[0] == e.target.value)[1] : 0);
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
                {/* Replaces the status verb depending on the current media type */}
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
            {/* Displays progress percentage */}
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
                    {/* Only tv shows have seasons, also not displayed for shows with only 1 season since they don't need to split progress between seasons*/}
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