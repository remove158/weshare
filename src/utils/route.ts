export const createBillPath = (id: string) => `/bill?id=${id}&page=1`;
export const getBillFullPath = (id: string, page: string = "0") =>
	`${window.location.origin}/bill?id=${id}&page=${page}`;
