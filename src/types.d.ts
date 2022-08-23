export type PaidUser = {
	id: string;
	paid: boolean;
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
};

export type Bill = {
	title: string;
	orders: Order[];
	users: User[];
	updatedAt: Timestamp;
	createdAt: Timestamp;
};
