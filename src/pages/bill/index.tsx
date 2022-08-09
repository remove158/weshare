import BackDrop from "@components/Backdrop";
import BillInfo from "@components/BillInfo";
import { useRouter } from "next/router";
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
