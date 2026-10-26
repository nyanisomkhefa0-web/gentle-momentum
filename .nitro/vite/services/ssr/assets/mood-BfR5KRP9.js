import { r as __toESM } from "./rolldown-runtime-C7HZzL1F.js";
import { i as require_react, r as require_jsx_runtime } from "./useRouter-D4NTYr1m.js";
import { t as useNavigate } from "./useNavigate-CoVVJwJ3.js";
import { t as AppShell } from "./AppShell-DJ6U_uFV.js";
import { n as Button, r as cn, t as useAuth } from "./useAuth-DS4hw7tn.js";
import { t as supabase } from "./client-DFgLjT3d.js";
import { r as todayISO } from "./dates-DghLyY7b.js";
//#region src/routes/mood.tsx?tsr-split=component
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MOODS = [
	{
		value: 1,
		emoji: "😔",
		label: "Low"
	},
	{
		value: 2,
		emoji: "😕",
		label: "Off"
	},
	{
		value: 3,
		emoji: "😐",
		label: "Okay"
	},
	{
		value: 4,
		emoji: "🙂",
		label: "Good"
	},
	{
		value: 5,
		emoji: "😊",
		label: "Great"
	}
];
function MoodPage() {
	const { user, profile, loading } = useAuth();
	const navigate = useNavigate();
	const today = todayISO();
	const [entry, setEntry] = (0, import_react.useState)(null);
	const [selected, setSelected] = (0, import_react.useState)(3);
	const [note, setNote] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [saved, setSaved] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (loading) return;
		if (!user) {
			navigate({ to: "/auth" });
			return;
		}
		if (profile && !profile.onboarding_completed) {
			navigate({ to: "/onboarding" });
			return;
		}
		loadMood();
	}, [
		user,
		profile,
		loading
	]);
	async function loadMood() {
		if (!user) return;
		const { data } = await supabase.from("mood_entries").select("*").eq("user_id", user.id).eq("entry_date", today).maybeSingle();
		if (data) {
			setEntry(data);
			setSelected(data.mood);
			setNote(data.note ?? "");
		}
	}
	async function handleSave() {
		if (!user || busy) return;
		setBusy(true);
		setSaved(false);
		if (entry) await supabase.from("mood_entries").update({
			mood: selected,
			note: note || null
		}).eq("id", entry.id);
		else await supabase.from("mood_entries").insert({
			user_id: user.id,
			entry_date: today,
			mood: selected,
			note: note || null
		});
		setBusy(false);
		setSaved(true);
		setTimeout(() => setSaved(false), 2e3);
	}
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-dvh items-center justify-center bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-muted-foreground",
			children: "Loading…"
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "mb-6 animate-rise",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-2xl font-semibold tracking-tight text-foreground",
			children: "Mood check-in"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted-foreground",
			children: "No judgment — just noticing how you feel."
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-between gap-2",
				children: MOODS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setSelected(m.value),
					className: cn("flex flex-1 flex-col items-center gap-1 rounded-2xl border py-4 transition-all", selected === m.value ? "border-primary bg-primary/10 scale-105" : "border-border bg-card hover:border-primary/30"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-3xl",
						children: m.emoji
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("text-xs font-medium", selected === m.value ? "text-primary" : "text-muted-foreground"),
						children: m.label
					})]
				}, m.value))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "mb-1.5 block text-sm font-medium text-foreground",
				children: "Anything on your mind? (optional)"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				value: note,
				onChange: (e) => setNote(e.target.value),
				placeholder: "A word, a thought…",
				rows: 3,
				className: "w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: handleSave,
				className: "w-full",
				size: "lg",
				disabled: busy,
				children: busy ? "Saving…" : entry ? "Update check-in" : "Save check-in"
			}),
			saved && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-center text-sm text-primary animate-rise",
				children: "Saved. Thanks for checking in."
			})
		]
	})] });
}
//#endregion
export { MoodPage as component };
