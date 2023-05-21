import BackDrop from "@components/Backdrop";
import Center from "@components/Center";
import RecentBill from "@components/RecentBill";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { createBill } from "@utils/api";
import { createBillPath } from "@utils/route";
import type { NextPage } from "next";
import { Head } from "next/document";
import { useRouter } from "next/router";
import { useState } from "react";

const Home: NextPage = () => {
	const [isLoading, setLoading] = useState(false);
	const router = useRouter();
	const createBillAndRedirect = async () => {
		const id = await createBill({ setLoading });
		router.push(createBillPath(id));
	};
	
	return (
		<Center>
			<main>
		<Head>
			<title>Share a Bill</title>
			<meta
				name="description"
				content="หารบิลกับเพื่อน เราช่วยให้คุณสามารถจัดแจงค่าใช้จ่ายได้อย่างง่ายดาย"
			/>
			<meta name="theme-color" content="#2196f3" />
			<link rel="icon" href="/favicon.ico" />
		</Head>
				<Box
					sx={{
						bgcolor: "background.paper",
						pt: 8,
						pb: 6,
					}}
				>
					<Container maxWidth="sm">
						<Typography
							component="h1"
							variant="h2"
							align="center"
							color="text.primary"
							gutterBottom
						>
							หารบิลกับเพื่อน
						</Typography>
						<Typography
							variant="h5"
							align="center"
							color="text.secondary"
							paragraph
						>
							หารบิลกับเพื่อน เราช่วยให้คุณสามารถจัดแจงค่าใช้จ่ายได้อย่างง่ายดาย
						</Typography>
						<Stack
							sx={{ pt: 4 }}
							direction="row"
							spacing={2}
							justifyContent="center"
						>
							{isLoading ? (
								<Button disabled variant="outlined">
									Creating
								</Button>
							) : (
								<Button variant="outlined" onClick={createBillAndRedirect}>
									Create bill
								</Button>
							)}
						</Stack>
						<RecentBill />
					</Container>
				</Box>
				<BackDrop open={isLoading} />
			</main>
		</Center>
	);
};

export default Home;
