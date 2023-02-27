function formattedDate(createdAt) {
	const date = new Date(createdAt);
	const formattedDate = `${date.getDate()} ${date.toLocaleString("default", {
		month: "short",
	})} ${date.getFullYear()}`;
	return formattedDate;
}

export default formattedDate;