export default function getTagSlugMap(tags: any[]) {
    const tagSlugMap: any = {};

    tags.map((tag: any) => {
        return tagSlugMap[tag.slug] = tag;
    });

    return tagSlugMap;
}