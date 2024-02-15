import { memo } from "react";
import { useSelector } from "react-redux";
import { Typography, FormControl, Rating, Slider, Stack, InputAdornment, OutlinedInput, FormHelperText } from '@mui/material';
import { types } from "./Library";
import _ from 'lodash';

const DetailsReleased = ({media, progress, setProgress, progress_seasons, setProgressSeasons, rating, setRating}) => {
    const type = useSelector(state => state.media.type);

    const handleProgressChange = (e) => {
        setProgress(e.target.value === '' ? 0 : Number(e.target.value));
    }

    const handleSliderChange = (e) => {
        setProgress(e.target.value);
    }

    const handleSeasonChange = (e) => {
        setProgressSeasons(e.target.value === '' ? 0 : Number(e.target.value));
    }

    return (
        <>
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
                    Progress: {progress} / {media.progress_max} {types[type].progress}
            </Typography>
            <Slider
                value={progress}
                onChange={handleSliderChange}
                max={media.progress_max}
                valueLabelDisplay="auto"
                aria-labelledby="input-slider"
                sx={{ mb: 1, display: { xs: 'none', sm: 'flex' }}}
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
                    <FormHelperText id="season-helper-text">{types[type].progress}</FormHelperText>
                </FormControl>
                {
                    type === 'tv' ?
                        <FormControl variant="outlined">
                            <OutlinedInput
                                id="season-number-input"
                                type="number"
                                inputProps={{ min: 0, max: media.progress_seasons_max }}
                                value={progress_seasons}
                                endAdornment={<InputAdornment position="end"> / {media.progress_seasons_max}</InputAdornment>}
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