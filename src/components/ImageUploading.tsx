import { AddBox } from "@mui/icons-material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import LinearProgress, { LinearProgressProps } from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import { ImageDetail, UploadImage } from "../api/api";
import { TagModifier } from "./TagModifier";

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
    return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ width: "100%", mr: 1 }}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="text.secondary">{`${Math.round(props.value)}%`}</Typography>
            </Box>
        </Box>
    );
}

export interface ImageUploadingProps {
    // eslint-disable-next-line no-unused-vars
    afterUpload: (detail: ImageDetail) => void;
}

function ImageUploading(props: ImageUploadingProps) {
    const [open, setOpen] = useState(false);

    const [tags, setTags] = useState<string[]>([]);

    const [currentFile, setCurrentFile] = useState<File>();
    const [previewImage, setPreviewImage] = useState("");
    const [progress, setProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    const resetFileState = () => {
        setCurrentFile(undefined);
        setPreviewImage("");
        setProgress(0);
        setIsUploading(false);
    };

    const handleClickOpenDialog = () => {
        setOpen(true);
    };

    const handleDialogClose = () => {
        if (!isUploading) resetFileState();
        setOpen(false);
    };

    const handleCloseDialogCancel = () => {
        resetFileState();
        setOpen(false);
    };

    const handleCloseDialogUpload = () => {
        (async () => {
            setIsUploading(true);
            const resp = await UploadImage(currentFile!, tags, (event: ProgressEvent) => {
                setProgress(Math.round((100 * event.loaded) / event.total));
            });
            if (resp) {
                props.afterUpload(resp);
            }
            resetFileState();
        })();
    };

    const selectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files![0];
        setCurrentFile(file);
        setPreviewImage(URL.createObjectURL(file));
        setProgress(0);
    };

    const handleTagsSync = (tags: string[]) => {
        setTags(tags);
    };

    return (
        <Box>
            <IconButton
                size="large"
                aria-label="uploading image"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleClickOpenDialog}
                color="inherit"
            >
                <AddBox></AddBox>
            </IconButton>

            <Dialog open={open} onClose={handleDialogClose}>
                <DialogTitle>Uploading</DialogTitle>
                <DialogContent>
                    <DialogContentText>Upload your favorite image</DialogContentText>
                </DialogContent>
                <Box textAlign="center">
                    <label htmlFor="btn-upload">
                        <input
                            id="btn-upload"
                            name="btn-upload"
                            style={{ display: "none" }}
                            type="file"
                            accept="image/*"
                            onChange={selectFile}
                        />

                        <Button color="primary" variant="contained" component="span">
                            Choose Image
                        </Button>
                    </label>

                    {currentFile && <LinearProgressWithLabel value={progress} />}

                    {previewImage && (
                        <Box>
                            <Card>
                                <CardMedia component="img" image={previewImage} alt={currentFile?.name} />
                                <CardContent>
                                    <Typography>{currentFile ? currentFile.name : null} </Typography>
                                </CardContent>
                                <TagModifier onSyncTags={handleTagsSync}></TagModifier>
                            </Card>
                        </Box>
                    )}
                </Box>

                <DialogActions>
                    <Button onClick={handleCloseDialogCancel}>Cancel</Button>
                    <Button disabled={!currentFile} onClick={handleCloseDialogUpload}>
                        Upload
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default ImageUploading;
