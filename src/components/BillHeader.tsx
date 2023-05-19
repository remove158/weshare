import {
	IconButton,
	Link,
	SpeedDial,
	SpeedDialAction,
	SpeedDialIcon,
	Stack,
	Typography,
} from "@mui/material";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { Link as LinkIcon } from "@mui/icons-material";
import { useRouter } from "next/router";
import { get_items, resetBill, updateOrders, uploadFirebase } from "@utils/api";
import { v4 as uuidv4 } from "uuid";
import { getDownloadURL, ref } from "firebase/storage";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Input } from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { storage } from "@utils/firebase";
import BackDrop from "./Backdrop";
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ReplayIcon from '@mui/icons-material/Replay';
//-------------------------------------------------------------------------//
// summary :  component types section
//-------------------------------------------------------------------------//
interface Props {
	link: string;
	onCopySuccess: () => void;
}

//-------------------------------------------------------------------------//
// summary : component function section
//-------------------------------------------------------------------------//
const BillHeader: React.FC<Props> = ({ link, onCopySuccess }) => {
	const router = useRouter();
	const [image, setImage] = useState<string>("");
	const fileInputRef = useRef<HTMLInputElement>(null);
	const viewRef = useRef<HTMLAnchorElement>(null);
	const [billFile, setFile] = useState<File | null>(null);
	const [isLoading, setLoading] = useState(false);

	const handleFileUpload = () => {
		if (fileInputRef?.current?.click) {
			fileInputRef.current.click();
		}
	};

	const { id } = router.query;
	const img_ref = ref(storage, `bills/${id}`);
	const handleFileSelected = async (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]; // Get the selected file
		try {
			setLoading(true);
			if (file) {
				await uploadFirebase(file, id as string);

				const url = await getDownloadURL(img_ref);
				setImage(url);

				setFile(file);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};
	const applyImageOrders = () => {
		if (billFile) {
			get_items(billFile).then((items) => {
				console.log(items);
				const orders = items.map((item: any) => {
					const id = uuidv4();
					return {
						id,
						name: item.description,
						price: item.amount,
						paidUsers: [],
					};
				});
				if (orders.length > 0) {
					updateOrders(id as string, orders);
				}
			});
		}
	};

	useEffect(() => {
		try {
			setLoading(true);
			if (billFile) {
				applyImageOrders();
			}
		} catch {
			// do nothing
		} finally {
			setLoading(false);
		}
	}, [billFile]);

	useEffect(() => {
		getDownloadURL(img_ref)
			.then((url) => {
				setImage(url);
			})
			.catch(() => {});
	}, [id]);
	if (isLoading) return <BackDrop open={isLoading} />;
	return (
		<>
			<Stack
				direction="row"
				justifyContent="space-between"
				alignItems="center"
				spacing={2}
				sx={{ mt: 1, mb: 1 }}
			>
				<Typography
					component="h4"
					variant="h4"
					color="text.primary"
					gutterBottom
					sx={{ cursor: "pointer" }}
					onClick={() => router.push("/")}
				>
					Share a Bill
				</Typography>

				<CopyToClipboard text={link} onCopy={onCopySuccess}>
					<IconButton>
						<LinkIcon color="info" />
					</IconButton>
				</CopyToClipboard>
			</Stack>
			<SpeedDial
				ariaLabel="SpeedDial basic example"
				sx={{ position: "fixed", bottom: 72, right: 24 }}
				icon={<SpeedDialIcon />}
			>
			
				<input
					type="file"
					accept="image/*"
					style={{ display: "none" }}
					ref={fileInputRef}
					onChange={handleFileSelected}
				/>
				<SpeedDialAction
					icon={<FileUploadIcon />}
					onClick={handleFileUpload}
					tooltipTitle={"upload file"}
				/>
				<a
					href={image}
					target="_blank"
					rel="noreferrer"
					style={{ display: "none" }}
					ref={viewRef}
				/>
				{image && (
					<SpeedDialAction
						color="secondary"
						onClick={() => viewRef?.current?.click()}
						icon={<ReceiptLongIcon/>}
						tooltipTitle={"uploaded receipt"}
					/>
				)}
						<SpeedDialAction
					sx={{ backgroundColor: "error" }}
						onClick={() => resetBill(id as string)}
						icon={<ReplayIcon/>}
						tooltipTitle={"reset bill"}
					/>
			</SpeedDial>
		</>
	);
};

export default BillHeader;
