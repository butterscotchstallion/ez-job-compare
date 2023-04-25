import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions } from "@mui/material";
import { useEffect, useState } from "react";
import { Button } from "rsuite";

export default function AddJobDialog({ open }: any) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    
    useEffect(() => {
        setIsOpen(open);
    }, []);

    function handleClose() {
        setIsOpen(false);
    }

    function handlePost() {

    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Post Job</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    To subscribe to this website, please enter your email address here. We
                    will send updates occasionally.
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Email Address"
                    type="email"
                    fullWidth
                    variant="standard"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handlePost}>Post</Button>
            </DialogActions>
        </Dialog>
    );
};