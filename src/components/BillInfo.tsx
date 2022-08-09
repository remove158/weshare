import AlertCopy from "@components/AlertCopy";
import BackDrop from "@components/Backdrop";
import BillHeader from "@components/BillHeader";
import BillStats from "@components/BillStats";
import Orders from "@components/Orders";
import Users from "@components/Users";
import HomeIcon from "@mui/icons-material/Home";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SegmentIcon from "@mui/icons-material/Segment";
import { Box, Container, Grid, Hidden, Paper, Snackbar } from "@mui/material";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import { useBillQuery } from "@utils/api";
import { getBillFullPath } from "@utils/route";
import { addRecentBills } from "@utils/storage";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import React, { useEffect, useState } from "react";

//-------------------------------------------------------------------------//
// summary :  component types section
//-------------------------------------------------------------------------//
interface Props {
	id: string;
	page: string;
}

interface TabPaneProps {
	children: any;
	value: number;
	index: number;
}
const TabPane = ({ children, value, index }: TabPaneProps) => {
	return value === index ? children : "";
};
//-------------------------------------------------------------------------//
// summary : component function section
//-------------------------------------------------------------------------//
const BillInfo: React.FC<Props> = ({ id, page }) => {
	const router = useRouter();
	const [isAlert, setAlert] = useState(false);
	const [data, loading, err] = useBillQuery(id || "-");
	const [value, setValue] = useState(parseInt(page));
	const [isCopy, setCopy] = useState(false);
	const [link, setLink] = useState("");
	useEffect(() => {
		setLink(getBillFullPath(id));
	}, [router.isReady]);
	useEffect(() => {
		if (data) {
			if (typeof window !== "undefined") {
				const localAlert = window.localStorage.getItem(id) !== "false";
				setAlert(localAlert);
			}
			addRecentBills(id);
		}
	}, [data]);
	const closeAlert = () => {
		setAlert(false);
		window.localStorage.setItem(id, "false");
	};
	const onCopySuccess = () => {
		setCopy(true);
		closeAlert();
	};

	if (err || (router.isReady && !loading && !data)) {
		router.replace("/");
	}
	if (!data || loading) {
		return <BackDrop open={true} />;
	}
	return (
		<Container maxWidth={"lg"} sx={{ padding: "1.5rem" }}>
			<AlertCopy
				isAlert={isAlert}
				closeAlert={closeAlert}
				onCopySuccess={onCopySuccess}
				link={link}
			/>
			<BillHeader onCopySuccess={onCopySuccess} link={link} />
			<Snackbar
				open={isCopy}
				onClose={() => setCopy(false)}
				autoHideDuration={2000}
				message="Copied to clipboard"
			/>
			<BillStats bill={data} />
			<Hidden mdUp>
				<Box sx={{ width: "100%", bgcolor: "background.paper" }}>
					<TabPane value={value} index={1}>
						<Users id={id} bill={data} />
					</TabPane>
					<TabPane value={value} index={2}>
						<Orders id={id} bill={data} />
					</TabPane>
					<Paper
						sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
						elevation={3}
					>
						<BottomNavigation
							showLabels
							value={value}
							onChange={(_, newValue) => {
								setValue(newValue);
							}}
						>
							<BottomNavigationAction
								label="Home"
								icon={<HomeIcon />}
								onClick={() => router.push("/")}
							/>
							<BottomNavigationAction label="People" icon={<PeopleAltIcon />} />
							<BottomNavigationAction label="Orders" icon={<SegmentIcon />} />
						</BottomNavigation>
					</Paper>
				</Box>
			</Hidden>

			<Hidden mdDown>
				<Grid container spacing={8}>
					<Grid item xs>
						<Orders id={id} bill={data} />
					</Grid>
					<Grid item>
						<Users id={id} bill={data} />
					</Grid>
				</Grid>
			</Hidden>
		</Container>
	);
};

export default BillInfo;
