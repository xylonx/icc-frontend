import InfoIcon from "@mui/icons-material/Info";
import LoopIcon from "@mui/icons-material/Loop";
import Masonry from "@mui/lab/Masonry";
import { Chip, DialogContent, TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import Fab from "@mui/material/Fab";
import IconButton from "@mui/material/IconButton";
// import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import React, { useContext, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { AddTags2Image, DeleteImage, DeleteTags2Image, GetAllTags, GetBatchImages, ImageDetail, Tag } from "../api/api";
import { Context } from "../api/context";
import "../css/imageview.css";
import { TagModifier } from "./TagModifier";

export interface ImageViewProp {
    freshImage: ImageDetail | undefined;
}

interface queryParams {
    tags: string[];
}

const loadedStyle = {
    position: "fixed",
    bottom: 16,
    right: 16,
};

// const load

function ImageView(props: ImageViewProp) {
    const [open, setOpen] = useState(false);
    const [showImageIdx, setShowImageIdx] = useState(0);
    const [showImageDetail, setShowImageDetail] = useState<ImageDetail>();

    const [images, setImages] = useState<ImageDetail[]>([]);

    const [loading, setLoading] = useState(false);

    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [queryParams, setQueryParams] = useState<queryParams>({ tags: [] });
    const [allTags, setAllTags] = useState<Tag[]>([]);

    useEffect(() => {
        (async () => {
            const tags = await GetAllTags();
            setAllTags(tags);
        })();
    }, []);

    const handleAutocompleteChange = (event: React.SyntheticEvent, value: string[]) => {
        setQueryParams({ tags: value });
    };

    const ctx = useContext(Context);

    useEffect(() => {
        (async () => {
            const resp = await GetBatchImages(new Date(), queryParams.tags);
            if (resp) {
                if (props.freshImage === undefined) {
                    setImages(resp.data);
                } else {
                    setImages([props.freshImage].concat(resp.data));
                }
            }
        })();
    }, [queryParams]);

    useEffect(() => {
        if (props.freshImage) setImages([props.freshImage].concat(images));
    }, [props]);

    const handleClickShowImageDetails = (idx: number) => {
        return () => {
            setOpen(true);
            setShowImageDetail(images[idx]);
            setShowImageIdx(idx);
        };
    };

    const handleCloseDialogCancel = () => {
        setOpen(false);
    };

    const handleCloseConfirmDialogCancel = () => {
        setConfirmDelete(false);
    };

    const handleDeleteImage = () => {
        setDeleting(true);
        (async () => {
            if (!showImageDetail) return;

            const succ = await DeleteImage(showImageDetail.image_id);
            if (succ) {
                setImages(images.filter((_, idx) => idx !== showImageIdx));
            }
            setConfirmDelete(false);
            setOpen(false);
            setDeleting(false);
        })();
    };

    const handleTagsSync = (tags: string[]) => {
        const newImageDetail = Object.assign({}, showImageDetail);
        newImageDetail.tags = tags;
        setShowImageDetail(newImageDetail);
    };

    const handleUpdateTags = () => {
        if (!showImageDetail) {
            return;
        }
        (async () => {
            const addTags = showImageDetail.tags.filter((x) => !images[showImageIdx].tags.includes(x));
            const deleteTags = images[showImageIdx].tags.filter((x) => !showImageDetail.tags.includes(x));
            if (addTags && addTags.length > 0) {
                const succ = await AddTags2Image(showImageDetail.image_id, addTags);
                if (!succ) return;
            }
            if (deleteTags && deleteTags.length > 0) {
                const succ = await DeleteTags2Image(showImageDetail!.image_id, deleteTags);
                if (!succ) return;
            }

            // update images
            const newImages = [...images];
            newImages[showImageIdx] = showImageDetail;
            setImages(newImages);
        })();
    };

    function handleLoadMoreClick() {
        setLoading(true);
        (async () => {
            const resp = await GetBatchImages(new Date(images[images.length - 1].timestamp), queryParams.tags);
            if (resp) setImages([...images].concat(resp.data));
            setLoading(false);
        })();
    }

    return (
        <Box sx={{ padding: 2 }}>
            <Autocomplete
                sx={{ padding: 2 }}
                size="small"
                multiple
                id="tags-filled"
                options={allTags.map((item) => item.tag_name)}
                freeSolo
                onChange={handleAutocompleteChange}
                renderTags={(value: readonly string[], getTagProps) =>
                    value.map((option: string, index: number) => (
                        // eslint-disable-next-line react/jsx-key
                        <Chip variant="outlined" size="small" label={option} {...getTagProps({ index })} />
                    ))
                }
                renderInput={(params) => <TextField {...params} variant="filled" label="tags" placeholder="tags" />}
            />

            <Masonry columns={isMobile ? 2 : 3} spacing={1}>
                {images.map((item, idx) => (
                    <ImageListItem key={idx}>
                        <img src={`${item.image_url}`} srcSet={`${item.image_url}`} loading="lazy" />
                        <ImageListItemBar
                            title={item.tags.join(" ")}
                            actionIcon={
                                <IconButton
                                    sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                                    style={{ transitionDelay: "200ms" }}
                                    onClick={handleClickShowImageDetails(idx)}
                                >
                                    <InfoIcon />
                                </IconButton>
                            }
                        />
                    </ImageListItem>
                ))}
            </Masonry>

            <Fab disabled={loading} variant="extended" onClick={handleLoadMoreClick} sx={loadedStyle}>
                more
                <LoopIcon className={loading ? "loading" : ""} />
            </Fab>

            <Dialog open={open} onClose={handleCloseDialogCancel}>
                <DialogContent sx={{ padding: "0" }}>
                    <Card>
                        <CardMedia
                            component="img"
                            image={showImageDetail?.image_url}
                            alt={showImageDetail?.tags.join(",")}
                        />
                        <CardContent>
                            <TagModifier onSyncTags={handleTagsSync} defaultTags={showImageDetail?.tags}></TagModifier>
                        </CardContent>

                        <CardActions>
                            <Button size="small" disabled={!ctx.auth} onClick={handleUpdateTags}>
                                Update Tag
                            </Button>
                        </CardActions>
                    </Card>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialogCancel}>close</Button>
                    <Button
                        variant="outlined"
                        color="error"
                        disabled={!ctx.auth}
                        onClick={() => {
                            setConfirmDelete(true);
                        }}
                    >
                        Delete Image
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={confirmDelete} onClose={handleCloseConfirmDialogCancel}>
                <Box textAlign="center">
                    <DialogContent>{"do you really want delete the image?"}</DialogContent>
                </Box>
                <DialogActions>
                    <Button onClick={handleCloseConfirmDialogCancel}>Cancel</Button>
                    <Button disabled={deleting} variant="contained" color="error" onClick={handleDeleteImage}>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default ImageView;
