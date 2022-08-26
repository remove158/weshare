import { Stack, Typography } from "@mui/material";
import React from "react";
import { Bill } from "types";
import PrompPay from "./PrompPay";

//-------------------------------------------------------------------------//
// summary :  component types section
//-------------------------------------------------------------------------//
interface Props {
	bill: Bill;
	id: string;
}

//-------------------------------------------------------------------------//
// summary : component function section
//-------------------------------------------------------------------------//
const BillStats: React.FC<Props> = ({ bill, id }) => {
	const personCount = bill.users.length;
	const totalPrice = bill.orders.reduce((p, c) => p + c.price, 0);
	return (
		<Stack
			direction="row"
			color="gray"
			justifyContent="space-between"
			alignItems="center"
		>
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
			<PrompPay id={id} bill={bill} />
		</Stack>
	);
};

export default BillStats;
