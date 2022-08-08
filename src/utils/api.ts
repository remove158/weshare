import {
	addDoc,
	updateDoc,
	collection,
	doc,
	serverTimestamp,
	Timestamp,
	QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "@utils/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { SetStateAction } from "react";
import { Dispatch } from "react";
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

interface PaidUser {
	id: string;
	status: string;
}
interface Order {
	id: string;
	name: string;
	price: number;
	paidUsers: PaidUser[];
}

interface User {
	id: string;
	name: string;
}

export interface Bill {
	orders: Order[];
	users: User[];
	updatedAt: Timestamp;
	createdAt: Timestamp;
}

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
