import InfoIcon from "@mui/icons-material/Info";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import React, { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { AddTags2Image, DeleteTags2Image, GetBatchImages, ImageDetail } from "../api/api";
import { TagModifier } from "./TagModifier";

function ImageView() {
    const [open, setOpen] = useState(false);
    const [showImageIdx, setShowImageIdx] = useState(0);
    const [showImageDetail, setShowImageDetail] = useState<ImageDetail>();

    const [images, setImages] = useState<ImageDetail[]>([]);

    useEffect(() => {
        (async () => {
            const resp = await GetBatchImages(new Date(), [], 20);
            if (resp) setImages(resp.data);
        })();
    }, []);

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

    return (
        <Box>
            <ImageList variant="masonry" cols={isMobile ? 2 : 3} gap={8}>
                {images.map((item, idx) => (
                    <ImageListItem key={idx}>
                        <img src={`${item.image_url}`} srcSet={`${item.image_url}`} loading="lazy" />
                        <ImageListItemBar
                            title={item.tags.join(" ")}
                            actionIcon={
                                <IconButton
                                    sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                                    onClick={handleClickShowImageDetails(idx)}
                                >
                                    <InfoIcon />
                                </IconButton>
                            }
                        />
                    </ImageListItem>
                ))}
            </ImageList>
            <Dialog open={open} onClose={handleCloseDialogCancel}>
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
                        <Button size="small" onClick={handleUpdateTags}>
                            Update Tag
                        </Button>
                    </CardActions>
                </Card>
            </Dialog>
        </Box>
    );
}

export default ImageView;
