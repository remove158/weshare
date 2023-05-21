import Head from "next/head";
import React from "react";

//-------------------------------------------------------------------------//
// summary :  component types section
//-------------------------------------------------------------------------//
interface Props {
	name ?: string
}

//-------------------------------------------------------------------------//
// summary : component function section
//-------------------------------------------------------------------------//
const MetaTags: React.FC<Props> = (props) => {
	const name = `${props.name ?? "Home"} - Share a Bill`
	return (
		<Head>
			<title>{name}</title>
			<meta
				name="description"
				content="หารบิลกับเพื่อน เราช่วยให้คุณสามารถจัดแจงค่าใช้จ่ายได้อย่างง่ายดาย"
			/>
			<meta name="theme-color" content="#2196f3" />
			<link rel="icon" href="/favicon.ico" />
		</Head>
	);
};

export default MetaTags;
