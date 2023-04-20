import { Slider } from "@mui/material";
import { useState } from "react";
import formatMoney from "../../utils/formatMoney";

export default function SalaryRangeSlider({ onChange }: any) {
    const [value, setValue] = useState<number[]>([25000, 500000]);

    const handleChange = (event: Event, newValue: number | number[]) => {
        setValue(newValue as number[]);
        onChange(newValue);
    };

    function valueText(value: number) {
        return formatMoney(value);
    }

    return (
        <Slider
            getAriaLabel={() => 'Salary ranges'}
            value={value}
            onChange={handleChange}
            valueLabelDisplay="auto"
            getAriaValueText={valueText}
        />
    );
};