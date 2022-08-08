import { IconButton, Stack, Typography } from "@mui/material";
import React from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { Link as LinkIcon } from "@mui/icons-material";

//-------------------------------------------------------------------------//
// summary :  component types section
//-------------------------------------------------------------------------//
interface Props {
	link: string;
	onCopySuccess: () => void;
}

//-------------------------------------------------------------------------//
// summary : component function section
//-------------------------------------------------------------------------//
const BillHeader: React.FC<Props> = ({ link, onCopySuccess }) => (
	<Stack
		direction="row"
		justifyContent="space-between"
		alignItems="center"
		spacing={2}
		sx={{ mt: 1, mb: 1 }}
	>
		<Typography component="h4" variant="h4" color="text.primary" gutterBottom>
			Share a Bill
		</Typography>

		<CopyToClipboard text={link} onCopy={onCopySuccess}>
			<IconButton>
				<LinkIcon color="info" />
			</IconButton>
		</CopyToClipboard>
	</Stack>
);

export default BillHeader;
