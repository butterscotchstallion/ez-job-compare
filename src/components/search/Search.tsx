import { Button, Grid, Paper, TextField, Typography } from "@mui/material";
import { debounce } from "lodash";
import { useState } from "react";

export default function Search(props: any) {
    const [searchDisabled, setSearchDisabled] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    
    function onSearchQueryChanged(event: any) {
        const searchQuery = event.target.value.toLowerCase();
        const isValidSearchQuery = searchQuery.length > 1;

        setSearchDisabled(!isValidSearchQuery);

        if (isValidSearchQuery) {
            setSearchQuery(searchQuery);
            setIsSearching(true);
        } else {
            setSearchQuery('');
            setIsSearching(false);
        }
    }

    function onSearchButtonClicked(event: any) {
        setIsSearching(true);
        const debouncedCallback = debounce(() => {
            props.onSearchQueryChanged(searchQuery);
        }, 500);
        debouncedCallback();
    }

    return (
        <Grid container className="search-area">
            <Grid item>
                <TextField 
                    id="outlined-search"
                    label="Search jobs"
                    type="search"
                    onChange={onSearchQueryChanged} />
            </Grid>
            <Grid item alignItems="stretch" style={{ paddingLeft: '1rem', display: "flex" }}>
                <Button variant="outlined"
                        disabled={searchDisabled}
                        onClick={onSearchButtonClicked}>Search</Button>
            </Grid>
        </Grid>
    );
};