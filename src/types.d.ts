export type PaidUser = {
	id: string;
	status: string;
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
	orders: Order[];
	users: User[];
	updatedAt: Timestamp;
	createdAt: Timestamp;
};
