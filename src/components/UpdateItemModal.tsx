import CloseIcon from "@mui/icons-material/Close";
import { Checkbox, FormControlLabel, Grid, Typography } from "@mui/material";
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
import DeleteIcon from "@mui/icons-material/Delete";
import { Dispatch, SetStateAction } from "react";
import { Bill, Order, PaidUser } from "types";
import AddUser from "@components/AddUser";

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
	const [orders, setOrders] = React.useState(
		bill.orders.map((e) => ({ ...e, paidUsers: [...e.paidUsers] }))
	);
	const [lastChange, setLastChange] = React.useState(
		bill.orders[idx].paidUsers
	);
	const [paid, SetPaid] = React.useState(false);

	const isContain = (item_id: string) =>
		orders[idx]?.paidUsers?.some((e) => e.id === item_id);

	React.useEffect(() => {
		const curOrder = orders[idx];
		curOrder.name = name;
		curOrder.price = +price;
		setOrderPeople(curOrder);
	}, [name, price]);

	const setOrderPeople = (curOrder: Order, saveHistory: boolean = true) => {
		if (saveHistory) {
			setLastChange(curOrder.paidUsers);
		}
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
		} as PaidUser;
		curOrder.paidUsers = [...curOrder.paidUsers, paidUser];
		setOrderPeople(curOrder);
	};
	React.useEffect(() => {
		const curOrder = orders[idx];
		if (paid) {
			curOrder.paidUsers = bill.users.map((e) => ({ id: e.id } as PaidUser));
		} else {
			if (lastChange.length === bill.users.length) {
				curOrder.paidUsers = []
			} else {
				curOrder.paidUsers = lastChange;
			}
		}
		setOrderPeople(curOrder, false);
	}, [paid]);

	React.useEffect(() => {
		const curOrder = orders[idx];
		SetPaid(curOrder.paidUsers.length === bill.users.length);
	});

	const delPeopleFormCurrentOrder = (user_id: string) => {
		const curOrder = orders[idx];
		curOrder.paidUsers = curOrder.paidUsers.filter((i) => i.id !== user_id);
		setOrderPeople(curOrder);
	};

	const deleteOrderFromBill = async () => {
		const tmp = bill.orders.filter((_, o_id) => o_id !== idx);
		await updateOrders(id, tmp);
		setOpen(false);
		SetPaid(false);
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
					<DialogContent dividers>
						<Stack spacing={2}>
							<Stack direction="row" justifyContent="space-between">
								<FormControlLabel
									control={
										<Checkbox
											checked={paid}
											onChange={(e) => SetPaid(e.target.checked)}
										/>
									}
									label="จ่ายทุกคน"
								/>
								<Button
									onClick={deleteOrderFromBill}
									variant="outlined"
									startIcon={<DeleteIcon />}
									color="error"
								>
									Delete
								</Button>
							</Stack>
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
								{bill.users.map((o, i) => {
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
							<AddUser id={id} bill={bill} />
						</Stack>
					</DialogContent>
					<DialogActions>
						<Button
							fullWidth
							onClick={handleClose}
							variant="outlined"
							color="error"
						>
							Cancel
						</Button>
						<Button fullWidth type="submit" onClick={onSave} variant="outlined">
							Save
						</Button>
					</DialogActions>
				</div>
			</BootstrapDialog>
		</>
	);
};

export default UpdateItemModel;
