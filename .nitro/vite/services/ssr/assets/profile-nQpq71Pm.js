import { r as __toESM } from "./rolldown-runtime-C7HZzL1F.js";
import { i as require_react, r as require_jsx_runtime } from "./useRouter-D4NTYr1m.js";
import { t as useNavigate } from "./useNavigate-CoVVJwJ3.js";
import { t as AppShell } from "./AppShell-DJ6U_uFV.js";
import { n as Button, t as useAuth } from "./useAuth-DS4hw7tn.js";
import { t as supabase } from "./client-DFgLjT3d.js";
//#region src/routes/profile.tsx?tsr-split=component
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProfilePage() {
	const { user, profile, loading, signOut, refreshProfile } = useAuth();
	const navigate = useNavigate();
	const [name, setName] = (0, import_react.useState)(profile?.display_name ?? "");
	const [reminders, setReminders] = (0, import_react.useState)(profile?.reminders_enabled ?? false);
	const [shareMood, setShareMood] = (0, import_react.useState)(profile?.share_mood ?? false);
	const [shareStreak, setShareStreak] = (0, import_react.useState)(profile?.share_streak ?? false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [saved, setSaved] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (loading) return;
		if (!user) {
			navigate({ to: "/auth" });
			return;
		}
		setName(profile?.display_name ?? "");
		setReminders(profile?.reminders_enabled ?? false);
		setShareMood(profile?.share_mood ?? false);
		setShareStreak(profile?.share_streak ?? false);
	}, [
		user,
		profile,
		loading
	]);
	async function handleSave() {
		if (!user || busy) return;
		setBusy(true);
		await supabase.from("profiles").update({
			display_name: name,
			reminders_enabled: reminders,
			share_mood: shareMood,
			share_streak: shareStreak
		}).eq("id", user.id);
		await refreshProfile();
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "mb-6 animate-rise",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-2xl font-semibold tracking-tight text-foreground",
			children: "Your profile"
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "mb-1.5 block text-sm font-medium text-foreground",
				children: "Name"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "text",
				value: name,
				onChange: (e) => setName(e.target.value),
				className: "h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none ring-ring focus:ring-2"
			})] }),
			(profile?.focus_areas ?? []).length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 text-sm font-medium text-foreground",
				children: "Focus areas"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: (profile?.focus_areas ?? []).map((area) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-full border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground",
					children: area
				}, area))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
						label: "Reminders",
						description: "Get gentle nudges to check in",
						checked: reminders,
						onChange: setReminders
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
						label: "Share mood",
						description: "Let your mood check-ins be visible",
						checked: shareMood,
						onChange: setShareMood
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
						label: "Share streak",
						description: "Let your streak count be visible",
						checked: shareStreak,
						onChange: setShareStreak
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: handleSave,
				className: "w-full",
				size: "lg",
				disabled: busy,
				children: busy ? "Saving…" : "Save changes"
			}),
			saved && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-center text-sm text-primary animate-rise",
				children: "Changes saved."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						signOut();
						navigate({ to: "/auth" });
					},
					className: "w-full text-center text-sm text-muted-foreground underline-offset-2 hover:underline",
					children: "Sign out"
				})
			})
		]
	})] });
}
function ToggleRow({ label, description, checked, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between rounded-xl border border-border/70 bg-card px-4 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm font-medium text-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted-foreground",
			children: description
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: () => onChange(!checked),
			className: `relative h-6 w-11 rounded-full transition-colors ${checked ? "bg-primary" : "bg-muted"}`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}` })
		})]
	});
}
//#endregion
export { ProfilePage as component };
