import { r as __toESM } from "./rolldown-runtime-C7HZzL1F.js";
import { i as require_react, r as require_jsx_runtime } from "./useRouter-D4NTYr1m.js";
import { t as useNavigate } from "./useNavigate-CoVVJwJ3.js";
import { n as Button, t as useAuth } from "./useAuth-C2_Py3j-.js";
import { t as supabase } from "./client-BJ3Uvbji.js";
//#region src/routes/auth.tsx?tsr-split=component
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuthPage() {
	const { user, loading } = useAuth();
	const navigate = useNavigate();
	const [mode, setMode] = (0, import_react.useState)("signin");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [message, setMessage] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!loading && user) navigate({ to: "/" });
	}, [user, loading]);
	async function handleSubmit(e) {
		e.preventDefault();
		setBusy(true);
		setError(null);
		setMessage(null);
		if (mode === "signup") {
			const { error: err } = await supabase.auth.signUp({
				email,
				password,
				options: { data: { name: email.split("@")[0] } }
			});
			if (err) setError(err.message);
			else setMessage("Check your email to confirm, or sign in if confirmation is disabled.");
		} else {
			const { error: err } = await supabase.auth.signInWithPassword({
				email,
				password
			});
			if (err) setError(err.message);
			else navigate({ to: "/" });
		}
		setBusy(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-dvh flex-col items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm animate-rise",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-8 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium text-primary",
							children: "Gentle Momentum"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-1 font-display text-3xl font-semibold tracking-tight text-foreground",
							children: mode === "signin" ? "Welcome back" : "Start gently"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: "Habit tracking that respects real life."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSubmit,
					className: "space-y-4 rounded-2xl border border-border/70 bg-card p-6 shadow-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1.5 block text-sm font-medium text-foreground",
							htmlFor: "email",
							children: "Email"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "email",
							type: "email",
							required: true,
							autoComplete: "email",
							value: email,
							onChange: (e) => setEmail(e.target.value),
							className: "h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none ring-ring focus:ring-2",
							placeholder: "you@example.com"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1.5 block text-sm font-medium text-foreground",
							htmlFor: "password",
							children: "Password"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "password",
							type: "password",
							required: true,
							minLength: 6,
							autoComplete: mode === "signin" ? "current-password" : "new-password",
							value: password,
							onChange: (e) => setPassword(e.target.value),
							className: "h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none ring-ring focus:ring-2",
							placeholder: "••••••••"
						})] }),
						error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-destructive",
							children: error
						}),
						message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-primary",
							children: message
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "w-full",
							size: "lg",
							disabled: busy,
							children: busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-center text-sm text-muted-foreground",
					children: mode === "signin" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						"New here?",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "font-medium text-primary underline-offset-2 hover:underline",
							onClick: () => setMode("signup"),
							children: "Create an account"
						})
					] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						"Already have an account?",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "font-medium text-primary underline-offset-2 hover:underline",
							onClick: () => setMode("signin"),
							children: "Sign in"
						})
					] })
				})
			]
		})
	});
}
//#endregion
export { AuthPage as component };
