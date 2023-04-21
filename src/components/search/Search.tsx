import { Button, ButtonGroup, FormControl, Grid, InputLabel, MenuItem, Paper, Select, TextField } from "@mui/material";
import { debounce } from "lodash";
import { useState } from "react";
import TagPicker from "../tag/TagPicker";
import SalaryRangeSlider from "./SalaryRangeSlider";
import { postDateFilterTypes } from "./post-date-filter-types.enum";
import './search.scss';

export default function Search({    onSearchQueryChanged, 
                                    onSalaryRangeMinChanged,
                                    onSalaryRangeMaxChanged,
                                    onTagPickerChanged,
                                    onPostDateFilterChanged,
                                    tags 
                                }: any) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [postDateFilter, setPostDateFilter] = useState(postDateFilterTypes.LAST_SIX_MONTHS);
    const formattedTags: any = tags.map((tag: any) => {
        tag.label = tag.name;
        tag.value = tag.id;
        return tag;
    });
    const postDateFilterOptions = [
        {
            value: postDateFilterTypes.LAST_WEEK,
            label: 'Last week'
        },
        {
            value: postDateFilterTypes.LAST_MONTH,
            label: 'Last month'
        },
        {
            value: postDateFilterTypes.LAST_SIX_MONTHS,
            label: 'Last six months',
            selected: true
        },
        {
            value: postDateFilterTypes.LAST_YEAR,
            label: 'Last year'
        }
    ];

    function onChange(event: any) {
        const query = event.target.value.toLowerCase();
        const isValidSearchQuery = query.length > 1;

        if (isValidSearchQuery) {
            setSearchQuery(query);
        } else {
            setIsSearching(false);
        }
    }

    function onSalaryRangeChanged(newValues: number[]) {
        onSalaryRangeMinChanged(newValues[0]);
        onSalaryRangeMaxChanged(newValues[1]);
    }
    
    function onReset(e: any) {
        e.currentTarget.form.reset();
        setSearchQuery('');
        setIsSearching(false);
        onSearchQueryChanged('');
    }

    function onSearchButtonClicked(event: any) {
        setIsSearching(true);
        debouncedCallback();
    }

    function onSubmit(e: any) {
        e.preventDefault();
        onSearchButtonClicked(e);
    }

    const debouncedCallback = debounce(() => {
        onSearchQueryChanged(searchQuery);
    }, 500);

    function handleTagPickerChange(selectedTagIds: number[]) {
        onTagPickerChanged(selectedTagIds);
    }

    function onSearchPostDateFilterChanged(event: any) {
        onPostDateFilterChanged();
    }

    return (
        <form onSubmit={onSubmit}>
            <Grid container className="search-area">            
                <Grid item xs={2}>
                    <TextField 
                        id="outlined-search"
                        label="Search jobs"
                        type="search"
                        onChange={onChange} />
                </Grid>
                <Grid item xs={2} style={{ paddingLeft: '1rem'}}>
                    <Paper>
                        <label>Salary Range</label>
                        <SalaryRangeSlider onChange={onSalaryRangeChanged}/>
                    </Paper>
                </Grid>
                <Grid item xs={2} style={{ paddingLeft: '1rem'}}>
                    <TagPicker tags={tags} onTagPickerChanged={onTagPickerChanged} />
                </Grid>
                <Grid xs={2} item alignItems="stretch" style={{ paddingLeft: '1rem', display: "flex" }}>
                    <ButtonGroup variant="contained" aria-label="outlined button group">
                        <Button type="submit">Search</Button>
                        <Button onClick={onReset}>Reset</Button>
                    </ButtonGroup>
                </Grid>

               <Grid item xs={8} className="search-second-row">
                    <Grid item xs={2}>
                        <FormControl fullWidth>
                            <InputLabel id="post-date-filter-label">Posts from</InputLabel>
                            <Select
                                labelId="post-date-filter-label"
                                value={postDateFilter}
                                label="Post date filter"
                                onChange={onPostDateFilterChanged}
                                className="post-date-filter-select"
                                >
                                {postDateFilterOptions.map((option: any) => (
                                    <MenuItem   key={option.value}
                                                selected={option.selected}
                                                value={option.value}>{option.label}</MenuItem>
                                ))}                                
                            </Select>
                        </FormControl>
                    </Grid>
               </Grid>
            </Grid>
        </form>
    );
};