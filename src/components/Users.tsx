import AddPeople from "@components/AddUser";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Chip } from "@mui/material";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { updateUsers } from "@utils/api";
import * as React from "react";
import { Bill, Order, User } from "types";

interface RowProps {
	idx: number;
	row: DataType;
	bill: Bill;
	id: string;
}
function Row({ row, idx, bill, id }: RowProps) {
	const [open, setOpen] = React.useState(false);

	const updatePaidStatus = (isPaid: boolean) => {
		const users = bill.users.map((user) => {
			if (user.id === row.id) {
				user.isPaid = isPaid;
			}
			return user;
		});
		updateUsers(id, users);
	};
	return (
		<React.Fragment>
			<TableRow hover sx={{ "&>*": { borderBottom: "unset" } }}>
				<TableCell onClick={() => setOpen(!open)}>
					<IconButton aria-label="expand row" size="small">
						{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell>
				<TableCell
					component="th"
					scope="row"
					sx={{ cursor: "pointer" }}
				>
					<Typography component="span" onClick={() => updatePaidStatus(!row.isPaid)}>
						{row.name}{" "}
						{row.isPaid && (
							<Chip
								size="small"
								variant="outlined"
								label={"จ่ายแล้ว"}
								color="success"
								sx={{ m: 0.5 }}
							/>
						)}
					</Typography>
				</TableCell>
				<TableCell align="right" sx={{ borderBottom: "unset" }}>
					{row.totalPrice.toLocaleString("en-US")}
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
					<Collapse in={open} timeout="auto" unmountOnExit>
						<Box sx={{ margin: 1 }}>
							{row.orders.length === 0 ? (
								<Typography component="div" color="GrayText">
									ไม่มีรายการ
								</Typography>
							) : (
								<Table size="small" aria-label="purchases">
									<TableHead>
										<TableRow>
											<TableCell>รายการ</TableCell>
											<TableCell>ราคา</TableCell>
											<TableCell align="right">จ่าย</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{row.orders.map((order, idx) => (
											<TableRow key={idx}>
												<TableCell component="th" scope="row">
													{order.name}
												</TableCell>
												<TableCell component="th" scope="row">
													{order.price.toLocaleString("en-US")}
												</TableCell>
												<TableCell align="right">
													{order.paid.toLocaleString("en-US")}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							)}
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</React.Fragment>
	);
}

interface DataType {
	id: string;
	name: string;
	totalPrice: number;
	isPaid: boolean;
	orders: {
		name: string;
		price: number;
		paid: number;
	}[];
}
const calculateData = (users: User[], orders: Order[]) => {
	return users.map(({ id, name, isPaid }) => {
		const interestOrder: Order[] = orders.filter((o) =>
			o.paidUsers.some((o_id) => o_id.id === id)
		);
		const totalPrice = interestOrder.reduce(
			(prev, cur) => prev + cur.price / cur.paidUsers.length,
			0
		);
		const tmp_orders = interestOrder.map(
			({ name: n, price, paidUsers: p }) => ({
				name: n,
				price,
				paid: price / p.length,
			})
		);
		return { id, name, totalPrice, isPaid, orders: tmp_orders };
	});
};

interface UsersProps {
	id: string;
	bill: Bill;
}
const Users = ({ id, bill }: UsersProps) => {
	const data = calculateData(bill.users, bill.orders);

	return (
		<>
			<AddPeople id={id} bill={bill} />
			<TableContainer sx={{ mb: 6 }}>
				<Table stickyHeader aria-label="table">
					<TableHead>
						<TableRow>
							<TableCell />
							<TableCell sx={{ minWidth: "160px" }}>ชื่อ</TableCell>
							<TableCell align="right">รวม</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{data.reverse().map((row, idx) => (
							<Row
								key={idx}
								row={row}
								idx={data.length - idx - 1}
								bill={bill}
								id={id}
							/>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
};

export default Users;
