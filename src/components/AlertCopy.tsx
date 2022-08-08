import { Alert, Collapse } from "@mui/material";
import { getBillFullPath } from "@utils/route";
import React, { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

//-------------------------------------------------------------------------//
// summary :  component types section
//-------------------------------------------------------------------------//
interface Props {
	isAlert: boolean;
	closeAlert: () => void;
	onCopySuccess: () => void;
	link: string;
}

//-------------------------------------------------------------------------//
// summary : component function section
//-------------------------------------------------------------------------//
const AlertCopy: React.FC<Props> = ({
	isAlert,
	closeAlert,
	onCopySuccess,
	link,
}) => {
	return (
		<Collapse in={isAlert}>
			<Alert severity="success" onClose={closeAlert}>
				แชร์บิลได้เลยตอนนี้ กดที่{" "}
				<CopyToClipboard text={link} onCopy={onCopySuccess}>
					<span style={{ color: "#1976d2", cursor: "pointer" }}>Copy Link</span>
				</CopyToClipboard>
			</Alert>
		</Collapse>
	);
};

export default AlertCopy;
