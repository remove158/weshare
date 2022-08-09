import CloseIcon from "@mui/icons-material/Close";
import { Grid, Typography } from "@mui/material";
import { Box, Chip, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { getColor } from "@utils/random";
import { updateOrders } from "@utils/api";
import { Dispatch, SetStateAction } from "react";
import { Bill, Order, PaidUser } from "types";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
	"& .MuiDialogContent-root": {
		padding: theme.spacing(2),
	},
	"& .MuiDialogActions-root": {
		padding: theme.spacing(1),
	},
}));

interface BootstrapDialogProps {
	children: JSX.Element | JSX.Element[];
	onClose: () => void;
}

const BootstrapDialogTitle: React.FC<BootstrapDialogProps> = ({
	children,
	onClose,
}) => {
	return (
		<DialogTitle sx={{ m: 0, p: 2 }}>
			{children}
			{onClose ? (
				<IconButton
					aria-label="close"
					onClick={onClose}
					sx={{
						position: "absolute",
						right: 8,
						top: 8,
						color: (theme) => theme.palette.grey[500],
					}}
				>
					<CloseIcon />
				</IconButton>
			) : null}
		</DialogTitle>
	);
};

interface Props {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	id: string;
	bill: Bill;
	idx: number;
}

//-------------------------------------------------------------------------//
// summary : component function section
//-------------------------------------------------------------------------//
const UpdateItemModel: React.FC<Props> = ({ open, setOpen, id, bill, idx }) => {
	const [name, setName] = React.useState(bill.orders[idx].name);
	const [price, setPrice] = React.useState(bill.orders[idx].price);
	const [peoples, setPeoples] = React.useState([...bill.users]);
	const [orders, setOrders] = React.useState(
		bill.orders.map((e) => ({ ...e, paidUsers: [...e.paidUsers] }))
	);

	const isContain = (item_id: string) =>
		orders[idx]?.paidUsers?.some((e) => e.id === item_id);

	React.useEffect(() => {
		const curOrder = orders[idx];
		curOrder.name = name;
		curOrder.price = +price;
		setOrderPeople(curOrder);
	}, [name, price]);

	const setOrderPeople = (curOrder: Order) => {
		const tmp_order = orders.map((e, i) => {
			if (i !== idx) return e;
			return curOrder;
		});
		setOrders(tmp_order);
	};
	const addPeopleToCurrentOrder = (user_id: string) => {
		const curOrder = orders[idx];
		const paidUser: PaidUser = {
			id: user_id,
			status: false,
		};
		curOrder.paidUsers = [...curOrder.paidUsers, paidUser];
		setOrderPeople(curOrder);
	};
	const delPeopleFormCurrentOrder = (user_id: string) => {
		const curOrder = orders[idx];
		curOrder.paidUsers = curOrder.paidUsers.filter((i) => i.id !== user_id);
		setOrderPeople(curOrder);
	};
	const onSave: (e: any) => void = async (e) => {
		e.preventDefault();
		await updateOrders(id, orders);
		handleClose();
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<>
			<BootstrapDialog
				onClose={handleClose}
				aria-labelledby="customized-dialog-title"
				open={open}
			>
				<div>
					<BootstrapDialogTitle onClose={handleClose}>
						<Typography>รายการ</Typography>
					</BootstrapDialogTitle>
					<form onSubmit={onSave}>
						<DialogContent dividers>
							<Stack spacing={2}>
								<TextField
									label="ชื่อ"
									value={name}
									fullWidth
									onChange={(e) => setName(e.target.value)}
								/>
								<TextField
									label="ราคา"
									value={price}
									type="number"
									onFocus={(event) => {
										event.target.select();
									}}
									fullWidth
									onChange={(e) => setPrice(+e.target.value)}
								/>

								<Grid container>
									{peoples.map((o, i) => {
										if (isContain(o.id)) {
											return (
												<Grid key={i} item>
													<Chip
														variant="outlined"
														label={o.name}
														color={getColor(i)}
														sx={{ m: 1 }}
														onDelete={() => {
															delPeopleFormCurrentOrder(o.id);
														}}
													/>
												</Grid>
											);
										}
										return (
											<Grid key={i} item>
												<Chip
													key={i}
													variant="outlined"
													label={o.name}
													sx={{ m: 1 }}
													onClick={() => addPeopleToCurrentOrder(o.id)}
												/>
											</Grid>
										);
									})}
								</Grid>
							</Stack>
						</DialogContent>
						<DialogActions>
							<Button onClick={handleClose} variant="outlined" color="error">
								Cancel
							</Button>
							<Button type="submit" onClick={onSave} variant="outlined">
								Save changes
							</Button>
						</DialogActions>
					</form>
				</div>
			</BootstrapDialog>
		</>
	);
};

export default UpdateItemModel;
