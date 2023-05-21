export type PaidUser = {
	id: string;
};
export type Order = {
	id: string;
	name: string;
	price: number;
	paidUsers: PaidUser[];
};

export type User = {
	id: string;
	name: string;
	isPaid: boolean;
};

export type Bill = {
	name: string;
	title: string;
	orders: Order[];
	promptpay: string;
	users: User[];
	updatedAt: Timestamp;
	createdAt: Timestamp;
};
