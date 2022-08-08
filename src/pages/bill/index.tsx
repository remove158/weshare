import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useBillQuery } from "@utils/api";
import React, { useEffect, useState } from "react";
import BackDrop from "@components/Backdrop";
import { addRecentBills } from "@utils/storage";

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
	const [data, loading, err] = useBillQuery(id as string);
	const [value, setValue] = useState(parseInt(page as string));
	useEffect(() => {
		if (data) {
			addRecentBills(id as string);
		}
	}, [data]);

	if (err || (router.isReady && !loading && !data)) {
		router.replace("/");
	}
	if (!data || loading || !router.isReady) {
		return <BackDrop open={true}></BackDrop>;
	}
	return <div>{JSON.stringify(data, null, 2)}</div>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	return {
		props: { query: context.query },
	};
};
export default Index;
