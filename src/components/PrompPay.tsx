import { Box, Stack, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { updatePromptpay } from "@utils/api";
import generatePayload from "promptpay-qr";
import QRCode from "qrcode.react";
import React, { useState } from "react";
import { Bill } from "types";

//-------------------------------------------------------------------------//
// summary :  component types section
//-------------------------------------------------------------------------//
interface Props {
	id: string;
	bill: Bill;
}

//-------------------------------------------------------------------------//
// summary : component function section
//-------------------------------------------------------------------------//
const PrompPay: React.FC<Props> = ({ id, bill }) => {
	const [qrCode, setqrCode] = useState("sample");
	const [open, setOpen] = React.useState(false);
	const [text, setText] = useState(bill.promptpay || "");

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	function handleQR(number: string) {
		setqrCode(generatePayload(number, {}));
	}
	return (
		<Box>
			<Stack
				justifyContent="center"
				alignItems="center"
				onClick={handleClickOpen}
			>
				<QRCode value={qrCode} style={{ height: "82px", width: "82px" }} />
				<Stack direction="row" alignItems="center">
					<Typography variant="subtitle2">{bill.promptpay}</Typography>
				</Stack>
			</Stack>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>พร้อมเพย์</DialogTitle>
				<DialogContent>
					<DialogContentText>
						แก้ไขหมายเลข Promptpay ง่ายๆ ให้เพื่อนสแกนได้เลยทันที
					</DialogContentText>
					<TextField
						autoFocus
						margin="dense"
						id="name"
						label="หมายเลขพร้อมเพย์"
						type="promptpay"
						fullWidth
						variant="standard"
						value={text}
						onChange={(e) => setText(e.target.value)}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
					<Button
						onClick={() => {
							updatePromptpay(id, text);
							handleQR(text);
							handleClose();
						}}
					>
						Save
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default PrompPay;
