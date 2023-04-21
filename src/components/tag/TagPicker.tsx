import { Checkbox, FormControl, InputLabel, ListItemText, OutlinedInput, Select, SelectChangeEvent } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import { ITag } from "./i-tag.interface";
import { useState } from "react";

export default function TagPicker({ tags, onTagPickerChanged }: any) {
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
            },
        },
    };

    function onSelfTagPickerChanged(event: SelectChangeEvent<number[]>) {
        setSelectedTagIds(selectedTagIds);
    }

    return (
        <FormControl sx={{ m: 1, width: 180 }}>
            <InputLabel id="demo-multiple-checkbox-label">Tags</InputLabel>
            <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={selectedTagIds}
                onChange={onSelfTagPickerChanged}
                input={<OutlinedInput label="Tags" />}
                renderValue={(selected: number[]) => selected.join(', ')}
                MenuProps={MenuProps}
                >
                    {tags.map((tag: ITag) => (
                        <MenuItem key={tag.id} value={tag.id}>
                            <Checkbox checked={selectedTagIds.indexOf(tag.id) > -1} />
                            <ListItemText primary={tag.name} />
                        </MenuItem>
                    ))}
            </Select>
        </FormControl>
    );
}