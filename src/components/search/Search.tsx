import { Button, ButtonGroup, Grid, Paper, TextField, Typography } from "@mui/material";
import { debounce } from "lodash";
import { useState } from "react";
import './search.scss';

export default function Search(props: any) {
    const [searchDisabled, setSearchDisabled] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    
    function onSearchQueryChanged(event: any) {
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
    
    function onReset(e: any) {
        e.currentTarget.form.reset();
        setSearchQuery('');
        setIsSearching(false);
        props.onSearchQueryChanged('');
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
        props.onSearchQueryChanged(searchQuery);
    }, 500);

    return (
        <Grid container className="search-area">
            <form onSubmit={onSubmit}>
                <Grid item>
                    <TextField 
                        id="outlined-search"
                        label="Search jobs"
                        type="search"
                        onChange={onSearchQueryChanged} />
                </Grid>
                <Grid item alignItems="stretch" style={{ paddingLeft: '1rem', display: "flex" }}>
                    <ButtonGroup variant="contained" aria-label="outlined button group">
                        <Button type="submit"
                                disabled={searchDisabled}>Search</Button>
                        <Button disabled={!isSearching}
                                onClick={onReset}>Reset</Button>
                    </ButtonGroup>
                </Grid>
            </form>
        </Grid>
    );
};