import { Box, Slider } from "@mui/material";
import { useState } from "react";
import formatMoney from "../../utils/formatMoney";

export function onReset() {

};

export default function SalaryRangeSlider({ onChange }: any) {
    const defaultValues = [0, 5000000];
    const [value, setValue] = useState<number[]>(defaultValues);

    const handleChange = (event: Event, newValue: number | number[]) => {
        setValue(newValue as number[]);
        onChange(newValue);
    };

    function valueText(value: number) {
        const formatted = formatMoney(value);
        return formatted + " USD per year";
    }

    return (
        <Box sx={{ width: 300 }}>
            <Slider
                getAriaLabel={() => 'Salary ranges'}
                value={value}
                min={defaultValues[0]}
                max={defaultValues[1]}
                step={5000}
                onChange={handleChange}
                valueLabelDisplay="auto"
                valueLabelFormat={valueText}
            />
        </Box>
    );
};