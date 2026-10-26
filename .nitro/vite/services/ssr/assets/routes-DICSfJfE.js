import { r as __toESM } from "./rolldown-runtime-C7HZzL1F.js";
import { i as require_react, r as require_jsx_runtime } from "./useRouter-D4NTYr1m.js";
import { t as Link } from "./link-hSMqQ_mo.js";
import { t as useNavigate } from "./useNavigate-CoVVJwJ3.js";
import { n as createLucideIcon, t as AppShell } from "./AppShell-DJ6U_uFV.js";
import { n as Button, r as cn, t as useAuth } from "./useAuth-DS4hw7tn.js";
import { t as supabase } from "./client-DFgLjT3d.js";
import { t as Plus } from "./plus-DVtdxGSQ.js";
import { i as weekdayOfISO, n as greetingForHour, r as todayISO, t as fmtFriendlyDate } from "./dates-DghLyY7b.js";
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Check = createLucideIcon("check", [["path", {
	d: "M20 6 9 17l-5-5",
	key: "1gmf2c"
}]]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Minus = createLucideIcon("minus", [["path", {
	d: "M5 12h14",
	key: "1ays0h"
}]]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var SkipForward = createLucideIcon("skip-forward", [["path", {
	d: "M21 4v16",
	key: "7j8fe9"
}], ["path", {
	d: "M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z",
	key: "zs4d6"
}]]);
//#endregion
//#region src/components/habits/HabitCard.tsx
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function HabitCard({ habit, log, onLog, disabled }) {
	const status = log?.status ?? null;
	const done = status === "full" || status === "minimum";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("rounded-2xl border border-border/70 bg-card p-4 shadow-sm transition-all", done && "border-primary/30 bg-sage-soft/40", status === "skipped" && "opacity-70"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-base font-semibold leading-tight text-foreground",
						children: habit.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: status === "full" ? habit.full_version : status === "minimum" ? habit.minimum_version : status === "skipped" ? log?.skip_reason || "Skipped today" : `Full: ${habit.full_version}`
					}),
					!status && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-0.5 text-xs text-muted-foreground/80",
						children: ["Min: ", habit.minimum_version]
					})
				]
			}), done && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-5 w-5" })
			})]
		}), !status && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 flex flex-wrap gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					className: "flex-1",
					disabled,
					onClick: () => onLog("full"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }), "Full"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: "soft",
					className: "flex-1",
					disabled,
					onClick: () => onLog("minimum"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-4 w-4" }), "Minimum"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: "ghost",
					disabled,
					onClick: () => onLog("skipped"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkipForward, { className: "h-4 w-4" }), "Skip"]
				})
			]
		})]
	});
}
//#endregion
//#region src/routes/index.tsx?tsr-split=component
function TodayPage() {
	const { user, profile, loading, signOut } = useAuth();
	const navigate = useNavigate();
	const today = todayISO();
	const [habits, setHabits] = (0, import_react.useState)([]);
	const [logs, setLogs] = (0, import_react.useState)({});
	const [mood, setMood] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [dataLoading, setDataLoading] = (0, import_react.useState)(true);
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
		loadToday();
	}, [
		user,
		profile,
		loading
	]);
	async function loadToday() {
		if (!user) return;
		setDataLoading(true);
		const [habitsRes, logsRes, moodRes] = await Promise.all([
			supabase.from("habits").select("*").eq("user_id", user.id).eq("status", "active"),
			supabase.from("habit_logs").select("*").eq("user_id", user.id).eq("log_date", today),
			supabase.from("mood_entries").select("*").eq("user_id", user.id).eq("entry_date", today).maybeSingle()
		]);
		const allHabits = habitsRes.data ?? [];
		const dow = weekdayOfISO(today);
		const due = allHabits.filter((h) => {
			if (h.frequency_type === "daily") return true;
			if (h.frequency_type === "weekdays") return dow >= 1 && dow <= 5;
			if (h.frequency_type === "weekly_x") return (h.weekdays ?? []).includes(dow);
			return true;
		});
		setHabits(due);
		const map = {};
		for (const log of logsRes.data ?? []) map[log.habit_id] = log;
		setLogs(map);
		setMood(moodRes.data ?? null);
		setDataLoading(false);
	}
	async function handleLog(habitId, status) {
		if (!user || busy) return;
		setBusy(true);
		const existing = logs[habitId];
		if (existing) {
			const { data, error } = await supabase.from("habit_logs").update({
				status,
				skip_reason: status === "skipped" ? "Chose to skip" : null
			}).eq("id", existing.id).select().single();
			if (!error && data) setLogs((prev) => ({
				...prev,
				[habitId]: data
			}));
		} else {
			const { data, error } = await supabase.from("habit_logs").insert({
				habit_id: habitId,
				user_id: user.id,
				log_date: today,
				status,
				skip_reason: status === "skipped" ? "Chose to skip" : null
			}).select().single();
			if (!error && data) setLogs((prev) => ({
				...prev,
				[habitId]: data
			}));
		}
		setBusy(false);
	}
	const stats = (0, import_react.useMemo)(() => {
		return {
			total: habits.length,
			completed: habits.filter((h) => {
				const s = logs[h.id]?.status;
				return s === "full" || s === "minimum";
			}).length
		};
	}, [habits, logs]);
	if (loading || dataLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-dvh items-center justify-center bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "animate-soft-pulse text-muted-foreground",
			children: "Loading…"
		})
	});
	const hour = (/* @__PURE__ */ new Date()).getHours();
	const name = profile?.display_name?.split(" ")[0] || "there";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-6 animate-rise",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium text-muted-foreground",
					children: fmtFriendlyDate(today)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "mt-1 font-display text-2xl font-semibold tracking-tight text-foreground",
					children: [
						greetingForHour(hour),
						", ",
						name
					]
				}),
				stats.total > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: [
						stats.completed,
						" of ",
						stats.total,
						" done today"
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mb-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/mood",
				className: "flex items-center justify-between rounded-2xl border border-border/70 bg-card px-4 py-3 shadow-sm transition hover:border-primary/30",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium text-foreground",
					children: "How are you feeling?"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: mood ? `Logged: ${moodLabel(mood.mood)}` : "Tap to check in"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-2xl",
					children: mood ? moodEmoji(mood.mood) : "✨"
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "space-y-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg font-semibold text-foreground",
					children: "Today's habits"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					size: "sm",
					variant: "soft",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/goals",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), "Goals"]
					})
				})]
			}), habits.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-dashed border-border bg-card/50 px-6 py-10 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium text-foreground",
						children: "No habits scheduled today"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Create a goal and add habits to build gentle momentum."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/goals",
							children: "Add a goal"
						})
					})
				]
			}) : habits.map((habit) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HabitCard, {
				habit,
				log: logs[habit.id] ?? null,
				onLog: (status) => handleLog(habit.id, status),
				disabled: busy
			}, habit.id))]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-10 text-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => signOut(),
				className: "text-xs text-muted-foreground underline-offset-2 hover:underline",
				children: "Sign out"
			})
		})
	] });
}
function moodEmoji(m) {
	return [
		"",
		"😔",
		"😕",
		"😐",
		"🙂",
		"😊"
	][m] ?? "✨";
}
function moodLabel(m) {
	return [
		"",
		"Low",
		"Off",
		"Okay",
		"Good",
		"Great"
	][m] ?? "Logged";
}
//#endregion
export { TodayPage as component };
