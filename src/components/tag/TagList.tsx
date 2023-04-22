import * as React from 'react';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import { ITag } from './i-tag.interface';
import getTagIconElement from './getTagIconElement';
import './tagList.scss';

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

export default function TagList(props: any) {
  const [chipData, setChipData] = React.useState<readonly ITag[]>(props.tags);
  return (
    <>
      {chipData.map((tag: ITag) => {
        const iconEl = getTagIconElement(tag.icon);
        return (
            <Chip
              icon={iconEl}
              label={tag.name}
              variant="outlined"
              color="primary"
              className="tag-chip"
              size="small"
              key={tag.id}
            />
        );
      })}
    </>
  );
}