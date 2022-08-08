import { db } from "@utils/firebase";
import {
	addDoc, collection,
	doc, QueryDocumentSnapshot, serverTimestamp, updateDoc
} from "firebase/firestore";
import { Dispatch, SetStateAction } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { Bill, Order, User } from "types";
const BILL_COLLECTION_NAME = "bills";
const BILL_COLLECTION = collection(db, BILL_COLLECTION_NAME);

const updateBillFunc = updateDoc<Bill>

const generateDefaultBill = () => {
	const time = serverTimestamp();
	const orders  = [] as Order[]
	const users = [] as User[]
	return { orders , users ,createdAt: time, updatedAt: time } as Bill;
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

export const useBillQuery = (id: string) => {
	const billRef = getBillRef(id);
	return useDocumentData<Bill>(billRef);
};

export const updateOrders = async (id: string, orders: Order[]) => {
	const billRef = getBillRef(id);
	await updateBillFunc(billRef, {
		orders,
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
