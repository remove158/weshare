import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Button, Grid, TextField } from "@mui/material";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { updateUsers } from "utils/api";
import { Bill, User } from "types";

const addPeople = (peoples: User[], name: string, id: string) => {
	const item_id = uuidv4();
	const tmp = [...peoples, { id: item_id, name }];
	updateUsers(id, tmp);
};
const deletePeople = (peoples: User[], item_id: string, id: string) => {
	const tmp = peoples.filter((e) => e.id !== item_id);
	updateUsers(id, tmp);
};
const AddPeople = ({ id, bill }: { id: string; bill: Bill }) => {
	const { users } = bill;

	const [text, setText] = useState("");
	return (
		<>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					addPeople(users, text, id);
					setText("");
				}}
			>
				<Grid container spacing={2}>
					<Grid item xs>
						<TextField
							placeholder="ชื่อคน"
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
							startIcon={<PersonAddIcon />}
						>
							เพิ่ม
						</Button>
					</Grid>
				</Grid>
			</form>
		</>
	);
};

export default AddPeople;
