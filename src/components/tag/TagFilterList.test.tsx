import renderer from 'react-test-renderer';
import { ITag } from './i-tag.interface';
import TagFilterList from './TagFilterList';
import createTag from './createTag';

it('updates the filter state when a tag is selected', () => {
    const tags: ITag[] = [
        createTag({ label: 'Tag 1', icon: 'Computer' }),
        createTag({ label: 'Tag 2', icon: 'Computer' }),
        createTag({ label: 'Tag 3', icon: 'Computer' }),
    ];
    const component = renderer.create(
        <TagFilterList tags={tags} />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});