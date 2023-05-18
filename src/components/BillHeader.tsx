import { IconButton, Stack, Typography } from "@mui/material";
import React, { ChangeEvent } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { Link as LinkIcon } from "@mui/icons-material";
import { useRouter } from "next/router";
import { get_items, updateOrders } from "@utils/api";
import { v4 as uuidv4 } from "uuid";
import { Order } from "types";

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
const BillHeader: React.FC<Props> = ({ link, onCopySuccess }) => {
	const router = useRouter();
	const { id } = router.query;
	const getBillInfo = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]; // Get the selected file
		if (file) {
			get_items(file).then((items) => {
				console.log(items);
				const orders = items.map((item: any) => {
					const id = uuidv4();
					return {
						id,
						name: item.description,
						price: item.amount,
						paidUsers: [],
					} as Order;
				});
				if (orders.length > 0) {
					updateOrders(id as string, orders);
				}
			})
	}
}
	return (
		<>
			<Stack
				direction="row"
				justifyContent="space-between"
				alignItems="center"
				spacing={2}
				sx={{ mt: 1, mb: 1 }}
			>
				<Typography
					component="h4"
					variant="h4"
					color="text.primary"
					gutterBottom
					onClick={() => router.push("/")}
				>
					Share a Bill
				</Typography>

				<CopyToClipboard text={link} onCopy={onCopySuccess}>
					<IconButton>
						<LinkIcon color="info" />
					</IconButton>
				</CopyToClipboard>
			</Stack>
			<input type="file" onChange={getBillInfo} />
		</>
	);
};

export default BillHeader
