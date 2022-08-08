import { Button, Stack, Typography } from "@mui/material";
import { createBillPath } from "@utils/route";
import { getRecentBills } from "@utils/storage";
import React, { useEffect, useState } from "react";

//-------------------------------------------------------------------------//
// summary :  component types section
//-------------------------------------------------------------------------//
interface Props {}

//-------------------------------------------------------------------------//
// summary : component function section
//-------------------------------------------------------------------------//
const RecentBill: React.FC<Props> = (props) => {
	const [recent, setRecent] = useState([] as string[]);
	useEffect(() => {
		setRecent(getRecentBills());
	}, []);

	return recent.length ? (
		<Stack
			sx={{ pt: 4 }}
			direction="column"
			spacing={2}
			justifyContent="center"
		>
			<Typography
				component="h5"
				variant="h5"
				align="center"
				color="text.secondary"
				gutterBottom
			>
				บิลล่าสุดของคุณ
			</Typography>
			{recent.map((e) => (
				<Button
					color="secondary"
					style={{ textTransform: "none" }}
					key={e}
					variant="outlined"
					href={createBillPath(e)}
				>
					REFID: {e}
				</Button>
			))}
		</Stack>
	) : null;
};

export default RecentBill;
