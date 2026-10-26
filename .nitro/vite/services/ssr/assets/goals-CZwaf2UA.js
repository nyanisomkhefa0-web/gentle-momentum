import { r as __toESM } from "./rolldown-runtime-C7HZzL1F.js";
import { i as require_react, r as require_jsx_runtime } from "./useRouter-D4NTYr1m.js";
import { t as useNavigate } from "./useNavigate-CoVVJwJ3.js";
import { n as createLucideIcon, t as AppShell } from "./AppShell-DJ6U_uFV.js";
import { n as Button, t as useAuth } from "./useAuth-DS4hw7tn.js";
import { t as supabase } from "./client-DFgLjT3d.js";
import { t as Plus } from "./plus-DVtdxGSQ.js";
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Archive = createLucideIcon("archive", [
	["rect", {
		width: "20",
		height: "5",
		x: "2",
		y: "3",
		rx: "1",
		key: "1wp1u1"
	}],
	["path", {
		d: "M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8",
		key: "1s80jp"
	}],
	["path", {
		d: "M10 12h4",
		key: "a56b0p"
	}]
]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var ChevronDown = createLucideIcon("chevron-down", [["path", {
	d: "m6 9 6 6 6-6",
	key: "qrunsl"
}]]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var ChevronRight = createLucideIcon("chevron-right", [["path", {
	d: "m9 18 6-6-6-6",
	key: "mthhwq"
}]]);
//#endregion
//#region src/routes/goals.tsx?tsr-split=component
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function GoalsPage() {
	const { user, profile, loading } = useAuth();
	const navigate = useNavigate();
	const [goals, setGoals] = (0, import_react.useState)([]);
	const [expanded, setExpanded] = (0, import_react.useState)({});
	const [showForm, setShowForm] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
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
		loadGoals();
	}, [
		user,
		profile,
		loading
	]);
	async function loadGoals() {
		if (!user) return;
		const [goalsRes, habitsRes] = await Promise.all([supabase.from("goals").select("*").eq("user_id", user.id).neq("status", "archived"), supabase.from("habits").select("*").eq("user_id", user.id).neq("status", "archived")]);
		const allGoals = goalsRes.data ?? [];
		const allHabits = habitsRes.data ?? [];
		const withHabits = allGoals.map((g) => ({
			...g,
			habits: allHabits.filter((h) => h.goal_id === g.id)
		}));
		setGoals(withHabits);
	}
	async function handleAddGoal(name, area, why) {
		if (!user || busy) return;
		setBusy(true);
		await supabase.from("goals").insert({
			user_id: user.id,
			name,
			area,
			why: why || null
		});
		setBusy(false);
		setShowForm(false);
		loadGoals();
	}
	async function handleArchiveGoal(id) {
		if (!user || busy) return;
		setBusy(true);
		await supabase.from("goals").update({ status: "archived" }).eq("id", id);
		setBusy(false);
		loadGoals();
	}
	async function handleAddHabit(goalId, name, full, min) {
		if (!user || busy) return;
		setBusy(true);
		await supabase.from("habits").insert({
			goal_id: goalId,
			user_id: user.id,
			name,
			full_version: full,
			minimum_version: min
		});
		setBusy(false);
		loadGoals();
	}
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-dvh items-center justify-center bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-muted-foreground",
			children: "Loading…"
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-6 animate-rise",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl font-semibold tracking-tight text-foreground",
				children: "Your goals"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Break big intentions into small, kind habits."
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: () => setShowForm((v) => !v),
				variant: "soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), "New goal"]
			})
		}),
		showForm && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewGoalForm, {
			onSubmit: handleAddGoal,
			onCancel: () => setShowForm(false)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "space-y-3",
			children: goals.length === 0 && !showForm ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-dashed border-border bg-card/50 px-6 py-10 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium text-foreground",
					children: "No goals yet"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Start with one area you'd like to grow in."
				})]
			}) : goals.map((goal) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoalItem, {
				goal,
				expanded: expanded[goal.id] ?? false,
				onToggle: () => setExpanded((prev) => ({
					...prev,
					[goal.id]: !prev[goal.id]
				})),
				onArchive: () => handleArchiveGoal(goal.id),
				onAddHabit: (name, full, min) => handleAddHabit(goal.id, name, full, min),
				busy
			}, goal.id))
		})
	] });
}
function GoalItem({ goal, expanded, onToggle, onArchive, onAddHabit, busy }) {
	const [showHabitForm, setShowHabitForm] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border/70 bg-card p-4 shadow-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: onToggle,
				className: "flex flex-1 items-start gap-2 text-left",
				children: [expanded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-base font-semibold text-foreground",
						children: goal.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: goal.area
					}),
					goal.why && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground/80",
						children: goal.why
					})
				] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onArchive,
				disabled: busy,
				className: "text-muted-foreground hover:text-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, { className: "h-4 w-4" })
			})]
		}), expanded && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 space-y-3 border-t border-border/50 pt-4",
			children: [(goal.habits ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "No habits yet for this goal."
			}) : (goal.habits ?? []).map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl bg-background/60 px-3 py-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium text-foreground",
						children: h.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: ["Full: ", h.full_version]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: ["Min: ", h.minimum_version]
					})
				]
			}, h.id)), showHabitForm ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewHabitForm, {
				onSubmit: onAddHabit,
				onCancel: () => setShowHabitForm(false)
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				variant: "ghost",
				onClick: () => setShowHabitForm(true),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), "Add habit"]
			})]
		})]
	});
}
function NewGoalForm({ onSubmit, onCancel }) {
	const [name, setName] = (0, import_react.useState)("");
	const [area, setArea] = (0, import_react.useState)("Health");
	const [why, setWhy] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: (e) => {
			e.preventDefault();
			if (name.trim()) onSubmit(name.trim(), area, why.trim());
		},
		className: "mb-4 space-y-3 rounded-2xl border border-border/70 bg-card p-4 shadow-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "text",
				placeholder: "Goal name",
				value: name,
				onChange: (e) => setName(e.target.value),
				className: "h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none ring-ring focus:ring-2",
				required: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
				value: area,
				onChange: (e) => setArea(e.target.value),
				className: "h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none ring-ring focus:ring-2",
				children: [
					"Health",
					"Mind",
					"Career",
					"Relationships",
					"Creativity",
					"Finances"
				].map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: a,
					children: a
				}, a))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				placeholder: "Why does this matter to you?",
				value: why,
				onChange: (e) => setWhy(e.target.value),
				className: "w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2",
				rows: 2
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					size: "sm",
					children: "Create goal"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					size: "sm",
					variant: "ghost",
					onClick: onCancel,
					children: "Cancel"
				})]
			})
		]
	});
}
function NewHabitForm({ onSubmit, onCancel }) {
	const [name, setName] = (0, import_react.useState)("");
	const [full, setFull] = (0, import_react.useState)("");
	const [min, setMin] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: (e) => {
			e.preventDefault();
			if (name.trim() && full.trim() && min.trim()) onSubmit(name.trim(), full.trim(), min.trim());
		},
		className: "space-y-2 rounded-xl bg-background/60 p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "text",
				placeholder: "Habit name",
				value: name,
				onChange: (e) => setName(e.target.value),
				className: "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none ring-ring focus:ring-2",
				required: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "text",
				placeholder: "Full version (the ideal)",
				value: full,
				onChange: (e) => setFull(e.target.value),
				className: "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none ring-ring focus:ring-2",
				required: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "text",
				placeholder: "Minimum version (on hard days)",
				value: min,
				onChange: (e) => setMin(e.target.value),
				className: "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none ring-ring focus:ring-2",
				required: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					size: "sm",
					children: "Add"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					size: "sm",
					variant: "ghost",
					onClick: onCancel,
					children: "Cancel"
				})]
			})
		]
	});
}
//#endregion
export { GoalsPage as component };
