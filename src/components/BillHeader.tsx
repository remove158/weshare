import {
	Button,
	Container,
	IconButton,
	Link,
	SpeedDial,
	SpeedDialAction,
	SpeedDialIcon,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { Link as LinkIcon } from "@mui/icons-material";
import { useRouter } from "next/router";
import {
	get_items,
	resetBill,
	updateName,
	updateOrders,
	uploadFirebase,
} from "@utils/api";
import { v4 as uuidv4 } from "uuid";
import { getDownloadURL, ref } from "firebase/storage";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Input } from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { storage } from "@utils/firebase";
import BackDrop from "./Backdrop";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ReplayIcon from "@mui/icons-material/Replay";
import zIndex from "@mui/material/styles/zIndex";
import { Bill } from "types";
import EditIcon from "@mui/icons-material/Edit";
//-------------------------------------------------------------------------//
// summary :  component types section
//-------------------------------------------------------------------------//
interface Props {
	link: string;
	onCopySuccess: () => void;
	bill: Bill;
}

//-------------------------------------------------------------------------//
// summary : component function section
//-------------------------------------------------------------------------//
const BillHeader: React.FC<Props> = ({ link, onCopySuccess, bill }) => {
	const router = useRouter();
	const [image, setImage] = useState<string>("");
	const fileInputRef = useRef<HTMLInputElement>(null);
	const viewRef = useRef<HTMLAnchorElement>(null);
	const [billFile, setFile] = useState<File | null>(null);
	const [isEditing, setEditing] = useState(false);
	const [title, setTitle] = useState("");
	const [isLoading, setLoading] = useState(false);

	const handleFileUpload = () => {
		if (fileInputRef?.current?.click) {
			fileInputRef.current.click();
		}
	};

	useEffect(() => {
		setTitle(bill.name ?? "Title");
	}, [bill.title]);

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

	const saveTitleName = async (e: any) => {
		e.preventDefault();
		await updateName(router.query?.id as string, title);
		setEditing(false);
	};
	const cancelTitle = () => {
		setTitle(bill.name ?? "Title");
		setEditing(false);
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
				sx={{ my: 2 }}
			>
				{!isEditing ? (
					<Typography
						component="h4"
						variant="h4"
						color="text.primary"
						gutterBottom
						sx={{ cursor: "pointer" }}
						onClick={() => setEditing(true)}
					>
						{bill?.name}
						<IconButton sx={{ ml: 2 }}>
							<EditIcon />
						</IconButton>
					</Typography>
				) : (
					<form onSubmit={saveTitleName}>
						<Stack direction={"row"} sx={{ gap: 2 }}>
							<TextField
								label="Title"
								value={title}
								size="small"
								onChange={(e: any) => setTitle(e.target.value)}
							/>
							<Button
								type="submit"
								startIcon={<SaveIcon />}
								variant="outlined"
								color="info"
								size="small"
							>
								Save
							</Button>
							<Button
								onClick={cancelTitle}
								variant="outlined"
								startIcon={<CloseIcon />}
								color="error"
								size="small"
							>
								Cancel
							</Button>
						</Stack>
					</form>
				)}

				<CopyToClipboard text={link} onCopy={onCopySuccess}>
					<IconButton>
						<LinkIcon color="info" />
					</IconButton>
				</CopyToClipboard>
			</Stack>
			<SpeedDial
				ariaLabel="SpeedDial basic example"
				sx={{
					position: "fixed",
					bottom: 80,
					right: 16,
					translateY: "-100%",
					translateX: "-100%",
					zIndex: 10,
				}}
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
						onClick={() => viewRef?.current?.click()}
						icon={<ReceiptLongIcon />}
						tooltipTitle={"uploaded receipt"}
					/>
				)}
				<SpeedDialAction
					sx={{ backgroundColor: "error.main" }}
					onClick={() => resetBill(id as string)}
					icon={<ReplayIcon style={{ color: "#FFF" }} />}
					tooltipTitle={"reset bill"}
				/>
			</SpeedDial>
		</>
	);
};

export default BillHeader;
