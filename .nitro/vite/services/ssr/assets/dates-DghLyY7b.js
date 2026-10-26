//#region src/lib/dates.ts
function dateISO(d) {
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function todayISO() {
	return dateISO(/* @__PURE__ */ new Date());
}
function fromISO(iso) {
	const [y, m, d] = iso.split("-").map(Number);
	return new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1);
}
function weekdayOfISO(iso) {
	return fromISO(iso).getDay();
}
function fmtFriendlyDate(iso) {
	return fromISO(iso).toLocaleDateString(void 0, {
		weekday: "long",
		day: "numeric",
		month: "long"
	});
}
function greetingForHour(hour) {
	if (hour < 5) return "Still up";
	if (hour < 12) return "Good morning";
	if (hour < 17) return "Good afternoon";
	return "Good evening";
}
//#endregion
export { weekdayOfISO as i, greetingForHour as n, todayISO as r, fmtFriendlyDate as t };
