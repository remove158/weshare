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

	return recent.length ? <div>{JSON.stringify(recent)}</div> : null;
};

export default RecentBill;
