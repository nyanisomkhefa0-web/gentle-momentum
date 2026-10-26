import { r as __toESM } from "./rolldown-runtime-C7HZzL1F.js";
import { i as require_react, r as require_jsx_runtime, t as useRouter } from "./useRouter-D4NTYr1m.js";
import { C as getUrlScheme, E as isDangerousProtocol, M as replaceEqualDeep, S as functionalUpdate, n as dummyMatchContext, o as invariant, r as matchContext, t as useSelector, u as removeTrailingSlash, y as deepEqual } from "./useSelector-5uRv9qLL.js";
//#endregion
//#region node_modules/@tanstack/react-router/dist/esm/useMatch.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var dummyMatch = {};
function useStructuralSharing(opts, router) {
	const previousResult = import_react.useRef();
	return (slice) => {
		const selected = opts?.select ? opts.select(slice) : slice;
		if (opts?.structuralSharing ?? router.options.defaultStructuralSharing) return previousResult.current = replaceEqualDeep(previousResult.current, selected);
		return selected;
	};
}
/**
* Read and select the nearest or targeted route match.
* @link https://tanstack.com/router/latest/docs/framework/react/api/router/useMatchHook
*/
function useMatch(opts) {
	const router = useRouter();
	const nearestRouteId = import_react.useContext(opts.from ? dummyMatchContext : matchContext);
	const routeId = opts.from ?? nearestRouteId;
	const matchStore = router.stores.getMatchStore(routeId);
	{
		const match = matchStore.get();
		if (!match) {
			if (opts.shouldThrow ?? true) invariant();
			return;
		}
		return opts.select ? opts.select(match) : match;
	}
	const selector = useStructuralSharing(opts, router);
	const matchSelection = useSelector(matchStore, (match) => match ? selector(match) : dummyMatch);
	if (matchSelection !== dummyMatch) return matchSelection;
	if (opts.shouldThrow ?? true) invariant();
}
require_jsx_runtime();
function resolveExternalLink(to, protocolAllowlist) {
	const scheme = typeof to === "string" && getUrlScheme(to);
	if (!scheme) return;
	if (!protocolAllowlist.has(scheme)) return null;
	return to;
}
function resolveIsActive(location, next, activeOptions, basepath, isHydrated) {
	const currentPath = removeTrailingSlash(location.pathname, basepath);
	const nextPath = removeTrailingSlash(next.pathname, basepath);
	if (activeOptions?.exact ? currentPath !== nextPath : !(currentPath.startsWith(nextPath) && (currentPath.length === nextPath.length || currentPath[nextPath.length] === "/"))) return false;
	if (activeOptions?.includeSearch ?? true) {
		if (!deepEqual(location.search, next.search, !activeOptions?.exact, activeOptions?.explicitUndefined)) return false;
	}
	if (activeOptions?.includeHash) return isHydrated && location.hash === next.hash;
	return true;
}
function useLinkProps(options, forwardedRef, host) {
	return getServerLinkProps(useRouter(), options, forwardedRef, host);
}
var STATIC_EMPTY_OBJECT = {};
var STATIC_ACTIVE_OBJECT = { className: "active" };
var ROUTER_OPTION_KEYS = /* @__PURE__ */ new Set([
	"to",
	"params",
	"search",
	"hash",
	"state",
	"mask",
	"from",
	"unsafeRelative",
	"_fromLocation",
	"reloadDocument",
	"preload",
	"preloadDelay",
	"preloadIntentProximity",
	"hashScrollIntoView",
	"replace",
	"startTransition",
	"resetScroll",
	"viewTransition",
	"ignoreBlocker",
	"activeProps",
	"inactiveProps",
	"activeOptions",
	"_asChild"
]);
function collectElementProps(options, host) {
	const props = {};
	for (const key in options) {
		if (ROUTER_OPTION_KEYS.has(key) || key === "type" && host !== void 0 || key === "disabled" && host === "a") continue;
		props[key] = options[key];
	}
	return props;
}
function applyLinkState(props, options, isActive, href, linkDisabled, host) {
	const { activeProps, inactiveProps, className, style, target } = options;
	const stateProps = functionalUpdate(isActive ? activeProps : inactiveProps, {}) ?? (isActive ? STATIC_ACTIVE_OBJECT : STATIC_EMPTY_OBJECT);
	Object.assign(props, stateProps);
	props.href = href;
	if (host !== "a") props.disabled = linkDisabled;
	props.target = target;
	const stateStyle = stateProps.style;
	if (style || stateStyle) props.style = style && stateStyle ? {
		...style,
		...stateStyle
	} : style || stateStyle;
	const stateClassName = stateProps.className;
	if (className || stateClassName) props.className = className ? stateClassName ? `${className} ${stateClassName}` : className : stateClassName;
	if (linkDisabled) {
		props.role = "link";
		props["aria-disabled"] = true;
	}
	if (isActive) {
		props["data-status"] = "active";
		props["aria-current"] = "page";
	}
	return props;
}
function getServerLinkProps(router, options, forwardedRef, host) {
	const { to, disabled, activeOptions } = options;
	const directExternalLink = resolveExternalLink(to, router.protocolAllowlist);
	const next = directExternalLink === void 0 ? router.buildLocation(options) : void 0;
	const hrefOption = next ? getHrefOption(next, router, disabled) : directExternalLink ?? void 0;
	const linkDisabled = disabled || !hrefOption;
	const externalLink = directExternalLink ?? (hrefOption && getUrlScheme(hrefOption) ? hrefOption : void 0);
	const props = collectElementProps(options, host);
	props.ref = forwardedRef;
	if (externalLink) {
		props.href = externalLink;
		return props;
	}
	return applyLinkState(props, options, !!next && !(!disabled && !hrefOption) && resolveIsActive(router.stores.location.get(), next, activeOptions, router.basepath, false), hrefOption, linkDisabled, host);
}
function getHrefOption(next, router, disabled) {
	if (disabled) return;
	const location = next.maskedLocation ?? next;
	const href = location.external ? location.publicHref : router.history.createHref(location.publicHref) || "/";
	if ((location.external || href !== location.publicHref) && isDangerousProtocol(href, router.protocolAllowlist)) return;
	return href;
}
/**
* A strongly-typed anchor component for declarative navigation.
* Handles path, search, hash and state updates with optional route preloading
* and active-state styling.
*
* Props:
* - `preload`: Controls route preloading (eg. 'intent', 'render', 'viewport', true/false)
* - `preloadDelay`: Delay in ms before preloading on focus, hover, or viewport entry
* - `activeProps`/`inactiveProps`: Additional props merged when link is active/inactive
* - `resetScroll`/`hashScrollIntoView`: Control scroll behavior on navigation
* - `viewTransition`/`startTransition`: Use View Transitions/React transitions for navigation
* - `ignoreBlocker`: Bypass registered blockers
*
* @returns An anchor-like element that navigates without full page reloads.
* @link https://tanstack.com/router/latest/docs/framework/react/api/router/linkComponent
*/
var Link = import_react.memo(import_react.forwardRef((props, ref) => {
	const host = props._asChild || "a";
	const linkProps = useLinkProps(props, ref, host);
	const children = typeof props.children === "function" ? props.children({ isActive: linkProps["data-status"] === "active" }) : props.children;
	return import_react.createElement(host, linkProps, children);
}), areLinkPropsEqual);
function areLinkPropsEqual(prev, next) {
	let extraKeys = 0;
	for (const key in next) {
		extraKeys++;
		if (prev[key] === next[key]) continue;
		if (!ROUTER_OPTION_KEYS.has(key) || !deepEqual(prev[key], next[key], false, true)) return false;
	}
	for (const _key in prev) extraKeys--;
	return extraKeys === 0;
}
//#endregion
export { useMatch as n, useStructuralSharing as r, Link as t };
