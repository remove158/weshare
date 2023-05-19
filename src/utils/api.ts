import { db, storage } from "@utils/firebase";
import {
	addDoc,
	collection,
	doc,
	QueryDocumentSnapshot,
	serverTimestamp,
	updateDoc,
} from "firebase/firestore";
import { Dispatch, SetStateAction } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import axios from "axios";
import { Bill, Order, User } from "types";
import { ref, uploadBytes } from "firebase/storage";
const BILL_COLLECTION_NAME = "bills";
const BILL_COLLECTION = collection(db, BILL_COLLECTION_NAME);

const updateBillFunc = updateDoc<Bill>;

const generateDefaultBill = () => {
	const time = serverTimestamp();
	const orders = [] as Order[];
	const users = [] as User[];
	return {
		orders,
		users,
		createdAt: time,
		updatedAt: time,
		promptpay: "000-000-0000",
	} as Bill;
};

const getBillRef = (id: string) =>
	doc(db, BILL_COLLECTION_NAME, id).withConverter(converter);

interface CreateBillArgs {
	setLoading: Dispatch<SetStateAction<boolean>>;
}
export const createBill = async ({ setLoading }: CreateBillArgs) => {
	setLoading(true);
	const { id } = await addDoc(BILL_COLLECTION, generateDefaultBill());
	return id;
};

const converter = {
	toFirestore: (data: Bill) => data,
	fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as Bill,
};

export const useBillQuery = (id: string) =>
	useDocumentData<Bill>(getBillRef(id));

export const updateOrders = async (id: string, orders: Order[]) => {
	const billRef = getBillRef(id);
	await updateBillFunc(billRef, {
		orders,
		updatedAt: serverTimestamp(),
	});
};
export const updatePromptpay = async (id: string, promptpay: string) => {
	const billRef = getBillRef(id);
	await updateBillFunc(billRef, {
		promptpay,
		updatedAt: serverTimestamp(),
	});
};

export const updateUsers = async (id: string, users: User[]) => {
	const billRef = getBillRef(id);
	await updateBillFunc(billRef, {
		users,
		updatedAt: serverTimestamp(),
	});
};

export const updateBill = async (
	id: string,
	orders: Order[],
	users: User[]
) => {
	const billRef = getBillRef(id);
	await updateBillFunc(billRef, {
		users,
		orders,
		updatedAt: serverTimestamp(),
	});
};

export const uploadFirebase = async (file: File, id: string) => {
	const storageRef = ref(storage, `bills/${id}`);
	// 'file' comes from the Blob or File API
	return uploadBytes(storageRef, file).then((snapshot) => {
		console.log("Uploaded a blob or file!");
	});
};

export const get_items = (file: File) => {
	const formData = new FormData();
	formData.append("file", file);
	formData.append("api_key", "TEST");
	formData.append("recognizer", "auto");
	formData.append("ref_no", "ocr_nodejs_123");

	const items = axios
		.post("https://ocr.asprise.com/api/v1/receipt", formData)
		.then((response) => {
			const orders = response?.data?.receipts[0]?.items ?? [];
			if (orders instanceof Array && response?.data?.receipts[0]?.tax) {
				const amount = response?.data?.receipts[0]?.tax;
				const description = "TAX";
				orders.push({ amount, description });
			}
			return orders;
		})
		.catch((err) => {
			alert(err.message);
			return [];
		});

	return items;
};
