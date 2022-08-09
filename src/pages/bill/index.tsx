import AlertCopy from "@components/AlertCopy";
import BackDrop from "@components/Backdrop";
import BillHeader from "@components/BillHeader";
import BillInfo from "@components/BillInfo";
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
interface Props {}

//-------------------------------------------------------------------------//
// summary : component function section
//-------------------------------------------------------------------------//
const Index: React.FC<Props> = () => {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const { id, page } = router.query;
	useEffect(() => {
		if (router.isReady) {
			setLoading(false);
		}
	}, [router.isReady]);
	if (loading) return <BackDrop open={loading} />;
	return <BillInfo id={id as string} page={page as string} />;
};

export default Index;
