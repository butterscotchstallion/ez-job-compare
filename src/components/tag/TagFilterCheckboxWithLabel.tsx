import { useState } from "react";
import { ITag } from "./i-tag.interface";

export default function TagFilterCheckboxWithLabel(props: any) {
    const tag: ITag = props.tag;
    const [isChecked, setChecked] = useState(false);
    const onChange = (tag: ITag) => {
        const newVal = !isChecked;
        setChecked(newVal);

        if (typeof props.onChange === 'function') {
            props.onChange(tag, newVal);
        }
    };
    return (
        <label key={tag.slug}>
            <input  type="checkbox"
                    checked={isChecked}
                    onChange={() => onChange(tag)} /> {tag.name}
        </label>
    );
}