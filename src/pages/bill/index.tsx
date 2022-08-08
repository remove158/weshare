import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useBillQuery } from "@utils/api";
import React, { useEffect, useState } from "react";
import BackDrop from "@components/Backdrop";
import { addRecentBills } from "@utils/storage";
import AlertCopy from "@components/AlertCopy";
import { Container, Snackbar } from "@mui/material";
import { getBillFullPath } from "@utils/route";
import BillHeader from "@components/BillHeader";
import BillStats from "@components/BillStats";

//-------------------------------------------------------------------------//
// summary :  component types section
//-------------------------------------------------------------------------//
interface Props {
	query: ParsedUrlQuery;
}

//-------------------------------------------------------------------------//
// summary : component function section
//-------------------------------------------------------------------------//
const Index: React.FC<Props> = ({ query }) => {
	const router = useRouter();
	const { id, page } = query;
	const [isAlert, setAlert] = useState(false);
	const [data, loading, err] = useBillQuery(id as string);
	const [value, setValue] = useState(parseInt(page as string));
	const [isCopy, setCopy] = useState(false);
	const [link, setLink] = useState("");
	useEffect(() => {
		setLink(getBillFullPath(id as string));
	}, []);
	useEffect(() => {
		if (data) {
			if (typeof window !== "undefined") {
				const localAlert =
					window.localStorage.getItem(id as string) !== "false";
				setAlert(localAlert);
			}
			addRecentBills(id as string);
		}
	}, [data]);
	const closeAlert = () => {
		setAlert(false);
		window.localStorage.setItem(id as string, "false");
	};
	const onCopySuccess = () => {
		setCopy(true);
		closeAlert();
	};

	if (err || (router.isReady && !loading && !data)) {
		router.replace("/");
	}
	if (!data || loading || !router.isReady) {
		return <BackDrop open={true}></BackDrop>;
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
		</Container>
	);
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	return {
		props: { query: context.query },
	};
};
export default Index;
