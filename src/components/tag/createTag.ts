import { uniqueId } from "lodash";
import { ITag } from "./i-tag.interface";

export default function createTag(props?: any) {
    const slug = props && props.slug ? props.slug : uniqueId();
    const tag: ITag = {
        id: slug,
        key: slug,
        label: props && props.label ? props.label : 'New Tag',
        slug: slug,
        icon: props.icon
    };
    return tag;
};