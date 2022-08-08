import { Stack, Typography } from "@mui/material";
import React from "react";
import { Bill } from "types";

//-------------------------------------------------------------------------//
// summary :  component types section
//-------------------------------------------------------------------------//
interface Props {
	bill: Bill;
}

//-------------------------------------------------------------------------//
// summary : component function section
//-------------------------------------------------------------------------//
const BillStats: React.FC<Props> = ({ bill }) => {
	const personCount = bill.users.length;
	const totalPrice = bill.orders.reduce((p, c) => p + c.price, 0);
	return (
		<Stack direction="row" spacing={4} sx={{ mb: 4 }} color="gray">
			<Stack>
				<Typography variant="h5">จำนวนคน</Typography>
				<Typography variant="h3">{personCount}</Typography>
			</Stack>
			<Stack>
				<Typography variant="h5">ราคารวม</Typography>
				<Typography variant="h3">
					{totalPrice.toLocaleString("en-US")}
				</Typography>
			</Stack>
		</Stack>
	);
};

export default BillStats;
