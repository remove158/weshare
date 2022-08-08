import { Backdrop, CircularProgress } from "@mui/material";
import React from "react";

//-------------------------------------------------------------------------//
// summary :  component types section
//-------------------------------------------------------------------------//
interface Props {
	open: boolean;
}

//-------------------------------------------------------------------------//
// summary : component function section
//-------------------------------------------------------------------------//
const BackDrop: React.FC<Props> = ({ open }) => {
	return (
		<Backdrop
			sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
			open={open}
		>
			<CircularProgress color="inherit" />
		</Backdrop>
	);
};

export default BackDrop;
