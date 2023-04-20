import { Button, ButtonGroup, Grid, Paper, Slider, TextField } from "@mui/material";
import { debounce } from "lodash";
import { useState } from "react";
import './search.scss';
import SalaryRangeSlider from "./SalaryRangeSlider";

export default function Search({ onSearchQueryChanged, onSalaryRangeMinChanged, onSalaryRangeMaxChanged }: any) {
    const [searchDisabled, setSearchDisabled] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    
    function onChange(event: any) {
        const query = event.target.value.toLowerCase();
        const isValidSearchQuery = query.length > 1;

        setSearchDisabled(!isValidSearchQuery);

        if (isValidSearchQuery) {
            setIsSearching(true);
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
                        <Button type="submit"
                                disabled={searchDisabled}>Search</Button>
                        <Button disabled={!isSearching}
                                onClick={onReset}>Reset</Button>
                    </ButtonGroup>
                </Grid>
                <Grid item xs={2}>
                    <Paper>
                        <label>Salary Range</label>
                        <SalaryRangeSlider onChange={onSalaryRangeChanged}/>
                    </Paper>
                </Grid>
            </form>
        </Grid>
    );
};