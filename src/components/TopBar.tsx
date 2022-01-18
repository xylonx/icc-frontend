import AccountCircle from "@mui/icons-material/AccountCircle";
import Login from "@mui/icons-material/Login";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";

export default function TopBar() {
    const [auth, setAuth] = useState(false);
    const [open, setOpen] = useState(false);
    const [token, setToken] = useState("");

    useEffect(() => {});

    const handleClickOpenDialog = () => {
        setOpen(true);
    };

    const handleCloseDialogCancel = () => {
        setOpen(false);
    };

    const handleCloseDialogAuth = () => {
        setOpen(false);
        setAuth(true);
        console.log(token);
    };

    const handleTokenInputChange = (e: any) => {
        setToken(e.target.value);
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Image Collection Center
                    </Typography>

                    <IconButton
                        size="large"
                        aria-label="to be login"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleClickOpenDialog}
                        color="inherit"
                    >
                        {auth ? <AccountCircle /> : <Login />}
                    </IconButton>

                    <Dialog open={open} onClose={handleCloseDialogCancel}>
                        <DialogTitle>Subscribe</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                To use full feature like uploading your favorite image, please enter your token.
                            </DialogContentText>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="token"
                                label="Token"
                                fullWidth
                                onChange={handleTokenInputChange}
                                variant="standard"
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDialogCancel}>Cancel</Button>
                            <Button onClick={handleCloseDialogAuth}>Auth</Button>
                        </DialogActions>
                    </Dialog>
                </Toolbar>
            </AppBar>
        </Box>
    );
}