const COLOR_LIST = [
	"primary",
	"secondary",
	"error",
	"info",
	"success",
	"warning",
];
export const getColor = (idx = 0): any => {
	return COLOR_LIST[idx % COLOR_LIST.length];
};
