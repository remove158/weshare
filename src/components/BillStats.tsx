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
			spacing={1}
		>
			<Stack direction="row" spacing={2} sx={{ mb: 4 }} color="gray">
				<Stack justifyContent="space-between">
					<Typography variant="h6">จำนวนคน</Typography>
					<Typography variant="h3">{personCount}</Typography>
				</Stack>
				<Stack justifyContent="space-between">
					<Typography variant="h6">ราคารวม</Typography>
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
