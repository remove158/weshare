const RECENT_KEY = "recent-bills";
export const getRecentBills = (): string[] => {
	const recentString = localStorage.getItem(RECENT_KEY);
	if (!recentString) {
		return [];
	}
	return JSON.parse(recentString);
};

export const addRecentBills = (id: string) => {
	const recentString = localStorage.getItem(RECENT_KEY);
	let data: string[] = [id];
	if (recentString) {
		const recentArr: string[] = JSON.parse(recentString);
		const filterOut = recentArr.filter((e) => e != id);
		data = [id, ...filterOut];
	}
	return localStorage.setItem(RECENT_KEY, JSON.stringify(data));
};
