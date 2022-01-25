import Box from "@mui/material/Box";
import React, { useContext, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ImageDetail } from "../api/api";
import { Context } from "../api/context";
import ImageView from "./ImageView";
import TopBar from "./TopBar";

export function ICC() {
    const [freshImages, setFreshImages] = useState<ImageDetail[]>([]);

    const ctx = useContext(Context);

    const initCtx = () => {
        ctx.toggleAuth = (value) => {
            ctx.auth = value;
        };
    };

    useEffect(() => {
        initCtx();
    }, []);

    const handleAppendFreshImages = (detail: ImageDetail) => {
        setFreshImages([detail].concat(freshImages));
    };

    return (
        <Box>
            <TopBar afterUploading={handleAppendFreshImages}></TopBar>
            <ToastContainer
                position="top-right"
                autoClose={1650}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                limit={4}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <ImageView freshImage={freshImages}></ImageView>
        </Box>
    );
}
