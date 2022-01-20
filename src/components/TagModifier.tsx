import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import React, { useEffect, useState } from "react";
import { GetAllTags, Tag } from "../api/api";

export interface TagModifierProp {
    // eslint-disable-next-line no-unused-vars
    onSyncTags: (tags: string[]) => void;
    defaultTags?: string[];
}

export function TagModifier(props: TagModifierProp) {
    const [allTags, setAllTags] = useState<Tag[]>([]);

    useEffect(() => {
        (async () => {
            const tags = await GetAllTags();
            setAllTags(tags);
        })();
    }, []);

    const handleAutocompleteChange = (event: React.SyntheticEvent, value: string[]) => {
        props.onSyncTags(value);
    };

    return (
        <Stack spacing={3}>
            <Autocomplete
                size="small"
                multiple
                id="tags-filled"
                options={allTags.map((item) => item.tag_name)}
                defaultValue={props.defaultTags}
                freeSolo
                onChange={handleAutocompleteChange}
                renderTags={(value: readonly string[], getTagProps) =>
                    value.map((option: string, index: number) => (
                        // eslint-disable-next-line react/jsx-key
                        <Chip variant="outlined" size="small" label={option} {...getTagProps({ index })} />
                    ))
                }
                renderInput={(params) => (
                    <TextField {...params} variant="filled" label="tags" placeholder="Favorites" />
                )}
            />
        </Stack>
    );
}
