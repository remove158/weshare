import PostAddIcon from "@mui/icons-material/PostAdd";
import { Button, Grid, TextField } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import * as React from "react";
import { v4 as uuidv4 } from "uuid";
import { updateOrders } from "@utils/api";
import OrderRow from "@components/OrderRow";
import { Bill, Order, PaidUser } from "types";
const columns = [
	{ id: "name", label: "ชื่อรายการ" },
	{
		id: "price",
		label: "ราคา",
		format: (value: number) => value.toLocaleString("en-US"),
	},
	{
		id: "avg_price",
		label: "คนละ",
		align: "right",
		format: (value: number) => value.toLocaleString("en-US"),
	},
];
const addOrder = (orders: Order[], name: string, id: string) => {
	const item_id = uuidv4();
	const tmp: Order[] = [
		{ id: item_id, name, price: 0, paidUsers: [] },
		...orders,
	];
	updateOrders(id, tmp);
};

function createData(
	id: string,
	name: string,
	price: number,
	avg_price: number
) {
	return { id, name, price, avg_price };
}
interface Props {
	bill: Bill;
	id: string;
}

//-------------------------------------------------------------------------//
// summary : component function section
//-------------------------------------------------------------------------//
const Orders: React.FC<Props> = ({ id, bill }) => {
	const rows = bill.orders.map(({ name, price, paidUsers, id }) => {
		const avg_price =
			price === 0 || paidUsers.length === 0 ? 0 : price / paidUsers.length;
		return createData(id, name, price, avg_price);
	});

	const [text, setText] = React.useState("");
	const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();
		addOrder(bill.orders, text, id);
		setText("");
	};
	return (
		<>
			<form onSubmit={onSubmit}>
				<Grid container spacing={2}>
					<Grid item xs>
						<TextField
							placeholder="ชื่อรายการ"
							value={text}
							fullWidth
							variant="standard"
							onChange={(e) => setText(e.target.value)}
						/>
					</Grid>
					<Grid item>
						<Button
							type="submit"
							fullWidth
							variant="outlined"
							startIcon={<PostAddIcon />}
						>
							เพิ่ม
						</Button>
					</Grid>
				</Grid>
			</form>
			<TableContainer sx={{ mb: 6 }}>
				<Table aria-label="sticky table">
					<TableHead>
						<TableRow>
							{columns.map((column) => (
								<TableCell key={column.id} align={column.align as any}>
									{column.label}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{rows.map((row, idx) => {
							return (
								<OrderRow
									key={idx}
									row={row}
									id={id}
									columns={columns}
									bill={bill}
									idx={idx}
								/>
							);
						})}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
};

export default Orders;
