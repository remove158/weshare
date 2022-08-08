export const createBillPath = (id: string) => `/bill?id=${id}&page=2`;
export const getBillFullPath = (id: string, page: number = 2) =>
	`${window.location.origin}/bills?id=${id}&page=${page}`;
