import { Button, ButtonGroup, Grid, Paper, Slider, TextField } from "@mui/material";
import { debounce } from "lodash";
import { useState } from "react";
import './search.scss';
import SalaryRangeSlider from "./SalaryRangeSlider";
import { TagPicker, CustomProvider } from 'rsuite';
import { ITag } from "../tag/i-tag.interface";
import "rsuite/dist/rsuite.min.css";

export default function Search({    onSearchQueryChanged, 
                                    onSalaryRangeMinChanged,
                                    onSalaryRangeMaxChanged,
                                    tags 
                                }: any) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
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
                <Grid xs={2} item alignItems="stretch" style={{ paddingLeft: '1rem', display: "flex" }}>
                    <ButtonGroup variant="contained" aria-label="outlined button group">
                        <Button type="submit">Search</Button>
                        <Button onClick={onReset}>Reset</Button>
                    </ButtonGroup>
                </Grid>
                <Grid item xs={2}>
                    <Paper>
                        <label>Salary Range</label>
                        <SalaryRangeSlider onChange={onSalaryRangeChanged}/>
                    </Paper>
                </Grid>
                <Grid item xs={2}>
                    <CustomProvider theme="dark">
                        <TagPicker data={formattedTags} style={{ width: 300 }} />
                    </CustomProvider>
                </Grid>
            </form>
        </Grid>
    );
};