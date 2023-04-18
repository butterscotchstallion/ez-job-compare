import { useEffect, useState } from "react";
import { ITag } from "./i-tag.interface";
import TagFilterCheckboxWithLabel from "./TagFilterCheckboxWithLabel";
import { findIndex } from "lodash";

export default function TagFilterList({ providedTags }: any) {
    const [tags, setTags] = useState(providedTags);

    function onChange(tag: ITag, newValue: boolean) {
        const tagIndex = findIndex(tags, (t: ITag) => {
            return t.slug === tag.slug;
        });
        if (tagIndex !== undefined) {
            const newTags: any = tags;
            newTags[tagIndex].selected = newValue;
            setTags(newTags);
        }
    }

    return (
        providedTags && providedTags.map((tag: ITag) => (
            <TagFilterCheckboxWithLabel props={{ tag: tag, onChange: onChange }}/>
        ))
    );
}