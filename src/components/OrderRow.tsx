import UpdateItemModal from "@components/UpdateItemModal";
import { Chip, Grid, IconButton } from "@mui/material";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { getColor } from "@utils/random";
import { useState } from "react";
import { Bill } from "types";
import EditIcon from "@mui/icons-material/Edit";
interface Column {
	id: string;
	label: string;
	align?: string;
	format?: (value: number) => string;
}
interface Row {
	id: string;
	name: string;
	price: number;
	avg_price: number;
}
interface Props {
	row: Row;
	bill: Bill;
	columns: Column[];
	id: string;
	idx: number;
}

//-------------------------------------------------------------------------//
// summary : component function section
//-------------------------------------------------------------------------//
const OrderRow: React.FC<Props> = ({ row, columns, idx, bill, id }) => {
	const [open, setOpen] = useState(false);
	const handleClickOpen = () => {
		setOpen(true);
	};
	const hasThisPeopleInOrder = (user_id: string) =>
		bill.orders[idx]?.paidUsers.some((e) => e.id === user_id);
	const getName = (people_id: string) =>
		bill.users.find((e) => e.id === people_id)?.name;
	return (
		<>
			<TableRow
				hover
				role="checkbox"
				key={row.id}
				onClick={() => handleClickOpen()}
			>
				{columns.map((column) => {
					const value = (row as any)[column.id];
					return (
						<TableCell key={column.id} align={column.align as any}>
							<Grid container alignItems="center">
								<Grid item>
									{column.format && typeof value === "number"
										? column.format(value)
										: value}
								</Grid>
								<Grid item>
									{column.id === "name" &&
										bill.orders[idx].paidUsers.length > 0 &&
										bill.users.map((e, i) =>
											hasThisPeopleInOrder(e.id) ? (
												<Chip
													size="small"
													key={i}
													variant="outlined"
													label={getName(e.id)}
													color={getColor(i)}
													sx={{ m: 0.5 }}
												/>
											) : null
										)}
								</Grid>
							</Grid>
						</TableCell>
					);
				})}
				<TableCell>
					<IconButton>
						<EditIcon />
					</IconButton>
				</TableCell>
			</TableRow>

			{open && (
				<UpdateItemModal
					open={open}
					setOpen={setOpen}
					id={id}
					bill={bill}
					idx={idx}
				/>
			)}
		</>
	);
};

export default OrderRow;
