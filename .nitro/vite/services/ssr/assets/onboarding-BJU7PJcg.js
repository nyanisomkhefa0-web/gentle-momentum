import { r as __toESM } from "./rolldown-runtime-C7HZzL1F.js";
import { i as require_react, r as require_jsx_runtime } from "./useRouter-D4NTYr1m.js";
import { t as useNavigate } from "./useNavigate-CoVVJwJ3.js";
import { n as Button, t as useAuth } from "./useAuth-DS4hw7tn.js";
import { t as supabase } from "./client-DFgLjT3d.js";
//#region src/routes/onboarding.tsx?tsr-split=component
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FOCUS_AREAS = [
	"Health",
	"Mind",
	"Career",
	"Relationships",
	"Creativity",
	"Finances"
];
var TIME_OPTIONS = [
	"5 min",
	"15 min",
	"30 min",
	"1 hour+"
];
function OnboardingPage() {
	const { user, profile, loading, refreshProfile } = useAuth();
	const navigate = useNavigate();
	const [name, setName] = (0, import_react.useState)(profile?.display_name ?? "");
	const [areas, setAreas] = (0, import_react.useState)(profile?.focus_areas ?? []);
	const [timePerDay, setTimePerDay] = (0, import_react.useState)(profile?.time_per_day ?? "15 min");
	const [graceDays, setGraceDays] = (0, import_react.useState)(3);
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!loading && !user) navigate({ to: "/auth" });
	}, [user, loading]);
	function toggleArea(area) {
		setAreas((prev) => prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]);
	}
	async function handleComplete(e) {
		e.preventDefault();
		if (!user || busy) return;
		setBusy(true);
		await supabase.from("profiles").upsert({
			id: user.id,
			display_name: name || user.email?.split("@")[0] || "Friend",
			focus_areas: areas,
			time_per_day: timePerDay,
			grace_days_per_month: graceDays,
			onboarding_completed: true
		});
		await refreshProfile();
		setBusy(false);
		navigate({ to: "/" });
	}
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-dvh items-center justify-center bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-muted-foreground",
			children: "Loading…"
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm animate-rise",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl font-semibold tracking-tight text-foreground",
					children: "Let's set you up"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "A few quick questions so we can tailor things for you."
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleComplete,
				className: "space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1.5 block text-sm font-medium text-foreground",
						children: "What should we call you?"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						value: name,
						onChange: (e) => setName(e.target.value),
						placeholder: "Your name",
						className: "h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none ring-ring focus:ring-2"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-2 block text-sm font-medium text-foreground",
						children: "What do you want to focus on?"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: FOCUS_AREAS.map((area) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => toggleArea(area),
							className: `rounded-full border px-3 py-1.5 text-sm font-medium transition ${areas.includes(area) ? "border-primary bg-primary text-primary-foreground" : "border-input bg-background text-muted-foreground hover:text-foreground"}`,
							children: area
						}, area))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-2 block text-sm font-medium text-foreground",
						children: "How much time per day?"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: TIME_OPTIONS.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setTimePerDay(opt),
							className: `rounded-xl border px-3 py-2 text-sm font-medium transition ${timePerDay === opt ? "border-primary bg-primary text-primary-foreground" : "border-input bg-background text-muted-foreground hover:text-foreground"}`,
							children: opt
						}, opt))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mb-2 block text-sm font-medium text-foreground",
							children: ["Grace days per month: ", graceDays]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "range",
							min: 0,
							max: 10,
							value: graceDays,
							onChange: (e) => setGraceDays(Number(e.target.value)),
							className: "w-full"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: "Days you can miss without breaking a streak."
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "w-full",
						size: "lg",
						disabled: busy,
						children: busy ? "Saving…" : "Get started"
					})
				]
			})]
		})
	});
}
//#endregion
export { OnboardingPage as component };
