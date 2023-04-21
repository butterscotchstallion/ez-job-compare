import { Button, ButtonGroup, Grid, Paper, TextField } from "@mui/material";
import { debounce } from "lodash";
import { useState } from "react";
import { CustomProvider, TagPicker } from 'rsuite';
import "rsuite/dist/rsuite.min.css";
import SalaryRangeSlider from "./SalaryRangeSlider";
import './search.scss';

export default function Search({    onSearchQueryChanged, 
                                    onSalaryRangeMinChanged,
                                    onSalaryRangeMaxChanged,
                                    onTagPickerChanged,
                                    tags 
                                }: any) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [selectedTags, setSelectedTags] = useState([]);
    const formattedTags: any = tags.map((tag: any) => {
        tag.label = tag.name;
        tag.value = tag.id;
        return tag;
    });

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

    return (
        <Grid container className="search-area">
            <form onSubmit={onSubmit}>
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
                    <CustomProvider theme="dark">
                        <label>Tags</label>
                        <TagPicker  data={formattedTags}
                                    className="tag-picker"
                                    placeholder="Select Tags"
                                    onChange={handleTagPickerChange} />
                    </CustomProvider>
                </Grid>
                <Grid xs={2} item alignItems="stretch" style={{ paddingLeft: '1rem', display: "flex" }}>
                    <ButtonGroup variant="contained" aria-label="outlined button group">
                        <Button type="submit">Search</Button>
                        <Button onClick={onReset}>Reset</Button>
                    </ButtonGroup>
                </Grid>
            </form>
        </Grid>
    );
};