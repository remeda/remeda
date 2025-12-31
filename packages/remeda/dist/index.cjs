
//#region src/internal/lazyDataLastImpl.ts
/**
* Use this helper function to build the data last implementation together with
* a lazy implementation. Use this when you need to build your own purrying
* logic when you want to decide between dataFirst and dataLast on something
* that isn't the number of arguments provided. This is useful for implementing
* functions with optional or variadic arguments.
*/
function lazyDataLastImpl(fn, args, lazy) {
	const dataLast = (data) => fn(data, ...args);
	return lazy === void 0 ? dataLast : Object.assign(dataLast, {
		lazy,
		lazyArgs: args
	});
}

//#endregion
//#region src/purry.ts
/**
* Creates a function with `dataFirst` and `dataLast` signatures.
*
* `purry` is a dynamic function and it's not type safe. It should be wrapped by
* a function that have proper typings. Refer to the example below for correct
* usage.
*
* !IMPORTANT: functions that simply call `purry` and return the result (like
* almost all functions in this library) should return `unknown` themselves if
* an explicit return type is required. This is because we currently don't
* provide a generic return type that is built from the input function, and
* crafting one manually isn't worthwhile as we rely on function declaration
* overloading to combine the types for dataFirst and dataLast invocations!
*
* @param fn - The function to purry.
* @param args - The arguments.
* @param lazy - A lazy version of the function to purry.
* @signature R.purry(fn, args);
* @example
*    function _findIndex(array, fn) {
*      for (let i = 0; i < array.length; i++) {
*        if (fn(array[i])) {
*          return i;
*        }
*      }
*      return -1;
*    }
*
*    // data-first
*    function findIndex<T>(array: T[], fn: (item: T) => boolean): number;
*
*    // data-last
*    function findIndex<T>(fn: (item: T) => boolean): (array: T[]) => number;
*
*    function findIndex(...args: unknown[]) {
*      return R.purry(_findIndex, args);
*    }
* @category Function
*/
function purry(fn, args, lazy) {
	const diff = fn.length - args.length;
	if (diff === 0) return fn(...args);
	if (diff === 1) return lazyDataLastImpl(fn, args, lazy);
	throw new Error("Wrong number of arguments");
}

//#endregion
//#region src/add.ts
function add(...args) {
	return purry(addImplementation, args);
}
const addImplementation = (value, addend) => value + addend;

//#endregion
//#region src/addProp.ts
function addProp(...args) {
	return purry(addPropImplementation, args);
}
const addPropImplementation = (obj, prop$1, value) => ({
	...obj,
	[prop$1]: value
});

//#endregion
//#region src/allPass.ts
function allPass(...args) {
	return purry(allPassImplementation, args);
}
const allPassImplementation = (data, fns) => fns.every((fn) => fn(data));

//#endregion
//#region src/anyPass.ts
function anyPass(...args) {
	return purry(anyPassImplementation, args);
}
const anyPassImplementation = (data, fns) => fns.some((fn) => fn(data));

//#endregion
//#region src/capitalize.ts
function capitalize(...args) {
	return purry(capitalizeImplementation, args);
}
const capitalizeImplementation = (data) => `${data[0]?.toUpperCase() ?? ""}${data.slice(1)}`;

//#endregion
//#region src/internal/withPrecision.ts
const MAX_PRECISION = 15;
const RADIX = 10;
const withPrecision = (roundingFn) => (value, precision) => {
	if (precision === 0) return roundingFn(value);
	if (!Number.isInteger(precision)) throw new TypeError(`precision must be an integer: ${precision.toString()}`);
	if (precision > MAX_PRECISION || precision < -MAX_PRECISION) throw new RangeError("precision must be between -15 and 15");
	if (Number.isNaN(value) || !Number.isFinite(value)) return roundingFn(value);
	return shiftDecimalPoint(roundingFn(shiftDecimalPoint(value, precision)), -precision);
};
/**
* Shift a number's decimal point via scientific notation.
*
* This takes advantage of the fact that `Number` methods support scientific
* (e-notation) string natively and avoids working with double-precision
* floating-point numbers directly, working around their limitations
* with representing decimal numbers.
*/
function shiftDecimalPoint(value, shift) {
	const [n, exponent] = value.toString().split("e");
	const shiftedValueAsString = `${n}e${((exponent === void 0 ? 0 : Number.parseInt(exponent, RADIX)) + shift).toString()}`;
	return Number.parseFloat(shiftedValueAsString);
}

//#endregion
//#region src/ceil.ts
function ceil(...args) {
	return purry(withPrecision(Math.ceil), args);
}

//#endregion
//#region src/chunk.ts
function chunk(...args) {
	return purry(chunkImplementation, args);
}
function chunkImplementation(data, size) {
	if (size < 1) throw new RangeError(`chunk: A chunk size of '${size.toString()}' would result in an infinite array`);
	if (data.length === 0) return [];
	if (size >= data.length) return [[...data]];
	const chunks = Math.ceil(data.length / size);
	const result = new Array(chunks);
	if (size === 1) for (const [index, item] of data.entries()) result[index] = [item];
	else for (let index = 0; index < chunks; index += 1) {
		const start = index * size;
		result[index] = data.slice(start, start + size);
	}
	return result;
}

//#endregion
//#region src/clamp.ts
function clamp(...args) {
	return purry(clampImplementation, args);
}
const clampImplementation = (value, { min, max }) => min !== void 0 && value < min ? min : max !== void 0 && value > max ? max : value;

//#endregion
//#region src/clone.ts
function clone(...args) {
	return purry(cloneImplementation, args);
}
function cloneImplementation(value, refFrom = [], refTo = []) {
	if (typeof value === "function") return value;
	if (typeof value !== "object" || value === null) return structuredClone(value);
	const prototype = Object.getPrototypeOf(value);
	if (!Array.isArray(value) && prototype !== null && prototype !== Object.prototype) return structuredClone(value);
	const idx = refFrom.indexOf(value);
	if (idx !== -1) return refTo[idx];
	refFrom.push(value);
	return Array.isArray(value) ? deepCloneArray(value, refFrom, refTo) : deepCloneObject(value, refFrom, refTo);
}
function deepCloneObject(value, refFrom, refTo) {
	const copiedValue = {};
	refTo.push(copiedValue);
	for (const [k, v] of Object.entries(value)) copiedValue[k] = cloneImplementation(v, refFrom, refTo);
	return copiedValue;
}
function deepCloneArray(value, refFrom, refTo) {
	const copiedValue = [];
	refTo.push(copiedValue);
	for (const [index, item] of value.entries()) copiedValue[index] = cloneImplementation(item, refFrom, refTo);
	return copiedValue;
}

//#endregion
//#region src/concat.ts
function concat(...args) {
	return purry(concatImplementation, args);
}
const concatImplementation = (arr1, arr2) => [...arr1, ...arr2];

//#endregion
//#region src/internal/purryOn.ts
/**
* Utility for purrying functions based on a predicate for the first argument.
*
* This is useful for purrying functions with a variadic argument list.
*/
function purryOn(isArg, implementation, args) {
	return isArg(args[0]) ? (data) => implementation(data, ...args) : implementation(...args);
}

//#endregion
//#region src/conditional.ts
function conditional(...args) {
	return purryOn(isCase, conditionalImplementation, args);
}
function conditionalImplementation(data, ...cases) {
	for (const current of cases) {
		if (typeof current === "function") return current(data);
		const [when$1, then] = current;
		if (when$1(data)) return then(data);
	}
	throw new Error("conditional: data failed for all cases");
}
function isCase(maybeCase) {
	if (!Array.isArray(maybeCase)) return false;
	const [when$1, then, ...rest] = maybeCase;
	return typeof when$1 === "function" && when$1.length <= 1 && typeof then === "function" && then.length <= 1 && rest.length === 0;
}

//#endregion
//#region src/constant.ts
/**
* A function that takes any arguments and returns the provided `value` on every
* invocation. This is useful to provide trivial implementations for APIs or in
* combination with a ternary or other conditional execution to allow to short-
* circuit more complex implementations for a specific case.
*
* Notice that this is a dataLast impl where the function needs to be invoked
* to get the "do nothing" function.
*
* See also:
* `doNothing` - A function that doesn't return anything.
* `identity` - A function that returns the first argument it receives.
*
* @param value - The constant value that would be returned on every invocation.
* The value is not copied/cloned on every invocation so care should be taken
* with mutable objects (like arrays, objects, Maps, etc...).
* @signature
*   R.constant(value);
* @example
*   R.map([1, 2, 3], R.constant('a')); // => ['a', 'a', 'a']
*   R.map(
*     [1, 2, 3],
*     isDemoMode ? R.add(1) : R.constant(0),
*   ); // => [2, 3, 4] or [0, 0, 0]
* @dataLast
* @category Function
*/
function constant(value) {
	return () => value;
}

//#endregion
//#region src/countBy.ts
function countBy(...args) {
	return purry(countByImplementation, args);
}
const countByImplementation = (data, categorizationFn) => {
	const out = /* @__PURE__ */ new Map();
	for (const [index, item] of data.entries()) {
		const category = categorizationFn(item, index, data);
		if (category !== void 0) {
			const count = out.get(category);
			if (count === void 0) out.set(category, 1);
			else out.set(category, count + 1);
		}
	}
	return Object.fromEntries(out);
};

//#endregion
//#region src/debounce.ts
function debounce(func, { waitMs, timing = "trailing", maxWaitMs }) {
	if (maxWaitMs !== void 0 && waitMs !== void 0 && maxWaitMs < waitMs) throw new Error(`debounce: maxWaitMs (${maxWaitMs.toString()}) cannot be less than waitMs (${waitMs.toString()})`);
	let coolDownTimeoutId;
	let maxWaitTimeoutId;
	let latestCallArgs;
	let result;
	const handleInvoke = () => {
		if (maxWaitTimeoutId !== void 0) {
			const timeoutId = maxWaitTimeoutId;
			maxWaitTimeoutId = void 0;
			clearTimeout(timeoutId);
		}
		/* v8 ignore if -- This protects us against changes to the logic, there is no known flow we can simulate to reach this condition. It can only happen if a previous timeout isn't cleared (or faces a race condition clearing). @preserve */
		if (latestCallArgs === void 0) throw new Error("REMEDA[debounce]: latestCallArgs was unexpectedly undefined.");
		const args = latestCallArgs;
		latestCallArgs = void 0;
		result = func(...args);
	};
	const handleCoolDownEnd = () => {
		if (coolDownTimeoutId === void 0) return;
		const timeoutId = coolDownTimeoutId;
		coolDownTimeoutId = void 0;
		clearTimeout(timeoutId);
		if (latestCallArgs !== void 0) handleInvoke();
	};
	const handleDebouncedCall = (args) => {
		latestCallArgs = args;
		if (maxWaitMs !== void 0 && maxWaitTimeoutId === void 0) maxWaitTimeoutId = setTimeout(handleInvoke, maxWaitMs);
	};
	return {
		call: (...args) => {
			if (coolDownTimeoutId === void 0) if (timing === "trailing") handleDebouncedCall(args);
			else result = func(...args);
			else {
				if (timing !== "leading") handleDebouncedCall(args);
				const timeoutId = coolDownTimeoutId;
				coolDownTimeoutId = void 0;
				clearTimeout(timeoutId);
			}
			coolDownTimeoutId = setTimeout(handleCoolDownEnd, waitMs ?? maxWaitMs ?? 0);
			return result;
		},
		cancel: () => {
			if (coolDownTimeoutId !== void 0) {
				const timeoutId = coolDownTimeoutId;
				coolDownTimeoutId = void 0;
				clearTimeout(timeoutId);
			}
			if (maxWaitTimeoutId !== void 0) {
				const timeoutId = maxWaitTimeoutId;
				maxWaitTimeoutId = void 0;
				clearTimeout(timeoutId);
			}
			latestCallArgs = void 0;
		},
		flush: () => {
			handleCoolDownEnd();
			return result;
		},
		get isPending() {
			return coolDownTimeoutId !== void 0;
		},
		get cachedValue() {
			return result;
		}
	};
}

//#endregion
//#region src/defaultTo.ts
function defaultTo(...args) {
	return purry(defaultToImplementation, args);
}
const defaultToImplementation = (data, fallback) => data ?? fallback;

//#endregion
//#region src/internal/utilityEvaluators.ts
const EMPTY_PIPE = {
	done: true,
	hasNext: false
};
/**
* A singleton value for skipping an item in a lazy evaluator.
*/
const SKIP_ITEM = {
	done: false,
	hasNext: false
};
/**
* A helper evaluator when we want to return an empty result. It memoizes both
* the result and the evaluator itself to reduce memory usage.
*/
const lazyEmptyEvaluator = () => EMPTY_PIPE;
/**
* A helper evaluator when we want to return a shallow clone of the input. It
* memoizes both the evaluator itself to reduce memory usage.
*/
const lazyIdentityEvaluator = (value) => ({
	hasNext: true,
	next: value,
	done: false
});

//#endregion
//#region src/pipe.ts
function pipe(input, ...functions) {
	let output = input;
	const lazyFunctions = functions.map((op) => "lazy" in op ? prepareLazyFunction(op) : void 0);
	let functionIndex = 0;
	while (functionIndex < functions.length) {
		if (lazyFunctions[functionIndex] === void 0 || !isIterable(output)) {
			const func = functions[functionIndex];
			output = func(output);
			functionIndex += 1;
			continue;
		}
		const lazySequence = [];
		for (let index = functionIndex; index < functions.length; index++) {
			const lazyOp = lazyFunctions[index];
			if (lazyOp === void 0) break;
			lazySequence.push(lazyOp);
			if (lazyOp.isSingle) break;
		}
		const accumulator = [];
		for (const value of output) if (processItem(value, accumulator, lazySequence)) break;
		const { isSingle } = lazySequence.at(-1);
		output = isSingle ? accumulator[0] : accumulator;
		functionIndex += lazySequence.length;
	}
	return output;
}
function processItem(item, accumulator, lazySequence) {
	if (lazySequence.length === 0) {
		accumulator.push(item);
		return false;
	}
	let currentItem = item;
	let lazyResult = SKIP_ITEM;
	let isDone = false;
	for (const [functionsIndex, lazyFn] of lazySequence.entries()) {
		const { index, items } = lazyFn;
		items.push(currentItem);
		lazyResult = lazyFn(currentItem, index, items);
		lazyFn.index += 1;
		if (lazyResult.hasNext) {
			if (lazyResult.hasMany ?? false) {
				for (const subItem of lazyResult.next) if (processItem(subItem, accumulator, lazySequence.slice(functionsIndex + 1))) return true;
				return isDone;
			}
			currentItem = lazyResult.next;
		}
		if (!lazyResult.hasNext) break;
		if (lazyResult.done) isDone = true;
	}
	if (lazyResult.hasNext) accumulator.push(currentItem);
	return isDone;
}
function prepareLazyFunction(func) {
	const { lazy, lazyArgs } = func;
	const fn = lazy(...lazyArgs);
	return Object.assign(fn, {
		isSingle: lazy.single ?? false,
		index: 0,
		items: []
	});
}
function isIterable(something) {
	return typeof something === "string" || typeof something === "object" && something !== null && Symbol.iterator in something;
}

//#endregion
//#region src/internal/purryFromLazy.ts
/**
* A version of `purry` for cases where the only meaningful implementation is a
* lazy one. This is useful for functions that don't have a built-in
* implementation already, and that can't be optimized to take advantage of
* having the complete array upfront.
*
* Under the hood the function uses `pipe` to utilize it's built-in lazy logic
* and wraps the pipe with the required invocations to allow using the function
* outside of pipes too.
*
* @param lazy - The main lazy implementation, it assumes that data is an
* iterable (array-like).
* @param args - The arguments passed to the overloaded invocation.
* @see purry
* @see pipe
*/
function purryFromLazy(lazy, args) {
	const diff = args.length - lazy.length;
	if (diff === 1) {
		const [data, ...rest] = args;
		return pipe(data, {
			lazy,
			lazyArgs: rest
		});
	}
	if (diff === 0) {
		const lazyDefinition = {
			lazy,
			lazyArgs: args
		};
		const dataLast = (data) => pipe(data, lazyDefinition);
		return Object.assign(dataLast, lazyDefinition);
	}
	throw new Error("Wrong number of arguments");
}

//#endregion
//#region src/difference.ts
function difference(...args) {
	return purryFromLazy(lazyImplementation$18, args);
}
function lazyImplementation$18(other) {
	if (other.length === 0) return lazyIdentityEvaluator;
	const remaining = /* @__PURE__ */ new Map();
	for (const value of other) remaining.set(value, (remaining.get(value) ?? 0) + 1);
	return (value) => {
		const copies = remaining.get(value);
		if (copies === void 0 || copies === 0) return {
			done: false,
			hasNext: true,
			next: value
		};
		remaining.set(value, copies - 1);
		return SKIP_ITEM;
	};
}

//#endregion
//#region src/differenceWith.ts
function differenceWith(...args) {
	return purryFromLazy(lazyImplementation$17, args);
}
const lazyImplementation$17 = (other, isEqual) => (value) => other.every((otherValue) => !isEqual(value, otherValue)) ? {
	done: false,
	hasNext: true,
	next: value
} : SKIP_ITEM;

//#endregion
//#region src/divide.ts
function divide(...args) {
	return purry(divideImplementation, args);
}
const divideImplementation = (value, divisor) => value / divisor;

//#endregion
//#region src/doNothing.ts
/**
* A function that takes any arguments and does nothing with them. This is
* useful as a placeholder for any function or API that requires a **void**
* function (a function that doesn't return a value). This could also be used in
* combination with a ternary or other conditional execution to allow disabling
* a function call for a specific case.
*
* Notice that this is a dataLast impl where the function needs to be invoked
* to get the "do nothing" function.
*
* See also:
* * `constant` - A function that ignores it's arguments and returns the same value on every invocation.
* * `identity` - A function that returns the first argument it receives.
*
* @signature
*   R.doNothing();
* @example
*   myApi({ onSuccess: handleSuccess, onError: R.doNothing() });
*   myApi({ onSuccess: isDemoMode ? R.doNothing(): handleSuccess });
* @dataLast
* @category Function
*/
function doNothing() {
	return doesNothing;
}
function doesNothing(..._args) {}

//#endregion
//#region src/drop.ts
function drop(...args) {
	return purry(dropImplementation, args, lazyImplementation$16);
}
const dropImplementation = (array, n) => n < 0 ? [...array] : array.slice(n);
function lazyImplementation$16(n) {
	if (n <= 0) return lazyIdentityEvaluator;
	let left = n;
	return (value) => {
		if (left > 0) {
			left -= 1;
			return SKIP_ITEM;
		}
		return {
			done: false,
			hasNext: true,
			next: value
		};
	};
}

//#endregion
//#region src/hasAtLeast.ts
function hasAtLeast(...args) {
	return purry(hasAtLeastImplementation, args);
}
const hasAtLeastImplementation = (data, minimum) => data.length >= minimum;

//#endregion
//#region src/internal/swapInPlace.ts
/**
* An efficient hack to swap the values at two indices in an array *in-place*.
*/
function swapInPlace(data, i, j) {
	[data[i], data[j]] = [data[j], data[i]];
}

//#endregion
//#region src/internal/heap.ts
/**
* Mutates an array into a "max"-heap based on `compareFn` so that for any `item` in the heap, `compareFn(heap[0], item) > 0`.
*
* @param heap - The array to be heapified. The array would be mutated!
* @param compareFn - The comparator used to order items in the heap. Use the
* same function in all calls mutating the same heap otherwise you'd get
* unexpected results.
*/
function heapify(heap, compareFn) {
	for (let i = Math.floor(heap.length / 2) - 1; i >= 0; i--) heapSiftDown(heap, i, compareFn);
}
/**
* Insert an item into a heap if it's "smaller" (in regards to `compareFn`) than
* the current head of the heap (which is the "largest" value in the heap). If
* the item is inserted, the previous head of the heap is returned, otherwise
* `undefined` is returned and the heap is unchanged.
*
* @param heap - A *mutable* array representing a heap (see `heapify`).
* @param compareFn - The comparator used to order items in the heap. Use the.
* @param item - The item to be inserted into the heap.
* @returns `undefined` if the heap is unchanged, or the previous head of the
* heap if the item was inserted.
*/
function heapMaybeInsert(heap, compareFn, item) {
	if (!hasAtLeast(heap, 1)) return;
	const [head] = heap;
	if (compareFn(item, head) >= 0) return;
	heap[0] = item;
	heapSiftDown(heap, 0, compareFn);
	return head;
}
/**
* The main heap operation. Takes a `heap` and an `index` and sifts the item
* down the heap until it reaches the correct position based on `compareFn`,
* swapping other items in the process.
*/
function heapSiftDown(heap, index, compareFn) {
	let currentIndex = index;
	while (currentIndex * 2 + 1 < heap.length) {
		const firstChildIndex = currentIndex * 2 + 1;
		let swapIndex = compareFn(heap[currentIndex], heap[firstChildIndex]) < 0 ? firstChildIndex : currentIndex;
		const secondChildIndex = firstChildIndex + 1;
		if (secondChildIndex < heap.length && compareFn(heap[swapIndex], heap[secondChildIndex]) < 0) swapIndex = secondChildIndex;
		if (swapIndex === currentIndex) return;
		swapInPlace(heap, currentIndex, swapIndex);
		currentIndex = swapIndex;
	}
}

//#endregion
//#region src/internal/purryOrderRules.ts
const COMPARATORS = {
	asc: (x, y) => x > y,
	desc: (x, y) => x < y
};
/**
* Allows functions that want to handle a variadic number of order rules a
* a simplified API that hides most of the implementation details. The only
* thing users of this function need to do is provide a function that would take
* the data, and a compare function that can be used to determine the order
* between the items of the array.
* This functions takes care of the rest; it will parse rules, built the
* comparer, and manage the purrying of the input arguments.
*/
function purryOrderRules(func, inputArgs) {
	const [dataOrRule, ...rules] = inputArgs;
	if (!isOrderRule(dataOrRule)) return func(dataOrRule, orderRuleComparer(...rules));
	const compareFn = orderRuleComparer(dataOrRule, ...rules);
	return (data) => func(data, compareFn);
}
/**
* Some functions need an extra number argument, this helps facilitate that.
*/
function purryOrderRulesWithArgument(func, [first$1, second, ...rest]) {
	let arg;
	let argRemoved;
	if (isOrderRule(second)) {
		arg = first$1;
		argRemoved = [second, ...rest];
	} else {
		arg = second;
		argRemoved = [first$1, ...rest];
	}
	return purryOrderRules((...args) => func(...args, arg), argRemoved);
}
function orderRuleComparer(primaryRule, secondaryRule, ...otherRules) {
	const projector = typeof primaryRule === "function" ? primaryRule : primaryRule[0];
	const direction = typeof primaryRule === "function" ? "asc" : primaryRule[1];
	const { [direction]: comparator } = COMPARATORS;
	const nextComparer = secondaryRule === void 0 ? void 0 : orderRuleComparer(secondaryRule, ...otherRules);
	return (a, b) => {
		const projectedA = projector(a);
		const projectedB = projector(b);
		if (comparator(projectedA, projectedB)) return 1;
		if (comparator(projectedB, projectedA)) return -1;
		return nextComparer?.(a, b) ?? 0;
	};
}
function isOrderRule(x) {
	if (isProjection(x)) return true;
	if (typeof x !== "object" || !Array.isArray(x)) return false;
	const [maybeProjection, maybeDirection, ...rest] = x;
	return isProjection(maybeProjection) && typeof maybeDirection === "string" && maybeDirection in COMPARATORS && rest.length === 0;
}
const isProjection = (x) => typeof x === "function" && x.length === 1;

//#endregion
//#region src/dropFirstBy.ts
function dropFirstBy(...args) {
	return purryOrderRulesWithArgument(dropFirstByImplementation, args);
}
function dropFirstByImplementation(data, compareFn, n) {
	if (n >= data.length) return [];
	if (n <= 0) return [...data];
	const heap = data.slice(0, n);
	heapify(heap, compareFn);
	const out = [];
	const rest = data.slice(n);
	for (const item of rest) {
		const previousHead = heapMaybeInsert(heap, compareFn, item);
		out.push(previousHead ?? item);
	}
	return out;
}

//#endregion
//#region src/dropLast.ts
function dropLast(...args) {
	return purry(dropLastImplementation, args);
}
const dropLastImplementation = (array, n) => n > 0 ? array.slice(0, Math.max(0, array.length - n)) : [...array];

//#endregion
//#region src/dropLastWhile.ts
function dropLastWhile(...args) {
	return purry(dropLastWhileImplementation, args);
}
function dropLastWhileImplementation(data, predicate) {
	for (let i = data.length - 1; i >= 0; i--) if (!predicate(data[i], i, data)) return data.slice(0, i + 1);
	return [];
}

//#endregion
//#region src/dropWhile.ts
function dropWhile(...args) {
	return purry(dropWhileImplementation, args);
}
function dropWhileImplementation(data, predicate) {
	for (const [index, item] of data.entries()) if (!predicate(item, index, data)) return data.slice(index);
	return [];
}

//#endregion
//#region src/endsWith.ts
function endsWith(...args) {
	return purry(endsWithImplementation, args);
}
const endsWithImplementation = (data, suffix) => data.endsWith(suffix);

//#endregion
//#region src/entries.ts
function entries(...args) {
	return purry(Object.entries, args);
}

//#endregion
//#region src/evolve.ts
function evolve(...args) {
	return purry(evolveImplementation, args);
}
function evolveImplementation(data, evolver) {
	if (typeof data !== "object" || data === null) return data;
	const out = { ...data };
	for (const [key, value] of Object.entries(evolver)) if (key in out) out[key] = typeof value === "function" ? value(out[key]) : evolveImplementation(out[key], value);
	return out;
}

//#endregion
//#region src/filter.ts
function filter(...args) {
	return purry(filterImplementation, args, lazyImplementation$15);
}
const filterImplementation = (data, predicate) => data.filter(predicate);
const lazyImplementation$15 = (predicate) => (value, index, data) => predicate(value, index, data) ? {
	done: false,
	hasNext: true,
	next: value
} : SKIP_ITEM;

//#endregion
//#region src/internal/toSingle.ts
const toSingle = (fn) => Object.assign(fn, { single: true });

//#endregion
//#region src/find.ts
function find(...args) {
	return purry(findImplementation, args, toSingle(lazyImplementation$14));
}
const findImplementation = (data, predicate) => data.find(predicate);
const lazyImplementation$14 = (predicate) => (value, index, data) => predicate(value, index, data) ? {
	done: true,
	hasNext: true,
	next: value
} : SKIP_ITEM;

//#endregion
//#region src/findIndex.ts
function findIndex(...args) {
	return purry(findIndexImplementation, args);
}
const findIndexImplementation = (data, predicate) => data.findIndex(predicate);

//#endregion
//#region src/findLast.ts
function findLast(...args) {
	return purry(findLastImplementation, args);
}
const findLastImplementation = (data, predicate) => {
	for (let i = data.length - 1; i >= 0; i--) {
		const item = data[i];
		if (predicate(item, i, data)) return item;
	}
};

//#endregion
//#region src/findLastIndex.ts
function findLastIndex(...args) {
	return purry(findLastIndexImplementation, args);
}
const findLastIndexImplementation = (data, predicate) => {
	for (let i = data.length - 1; i >= 0; i--) if (predicate(data[i], i, data)) return i;
	return -1;
};

//#endregion
//#region src/first.ts
function first(...args) {
	return purry(firstImplementation, args, toSingle(lazyImplementation$13));
}
const firstImplementation = ([item]) => item;
const lazyImplementation$13 = () => firstLazy;
const firstLazy = (value) => ({
	hasNext: true,
	next: value,
	done: true
});

//#endregion
//#region src/firstBy.ts
function firstBy(...args) {
	return purryOrderRules(firstByImplementation, args);
}
function firstByImplementation(data, compareFn) {
	if (!hasAtLeast(data, 2)) return data[0];
	let [currentFirst] = data;
	const [, ...rest] = data;
	for (const item of rest) if (compareFn(item, currentFirst) < 0) currentFirst = item;
	return currentFirst;
}

//#endregion
//#region src/flat.ts
function flat(dataOrDepth, depth) {
	if (typeof dataOrDepth === "object") return flatImplementation(dataOrDepth, depth);
	return lazyDataLastImpl(flatImplementation, dataOrDepth === void 0 ? [] : [dataOrDepth], lazyImplementation$12);
}
const flatImplementation = (data, depth) => depth === void 0 ? data.flat() : data.flat(depth);
const lazyImplementation$12 = (depth) => depth === void 0 || depth === 1 ? lazyShallow : depth <= 0 ? lazyIdentityEvaluator : (value) => Array.isArray(value) ? {
	next: value.flat(depth - 1),
	hasNext: true,
	hasMany: true,
	done: false
} : {
	next: value,
	hasNext: true,
	done: false
};
const lazyShallow = (value) => Array.isArray(value) ? {
	next: value,
	hasNext: true,
	hasMany: true,
	done: false
} : {
	next: value,
	hasNext: true,
	done: false
};

//#endregion
//#region src/flatMap.ts
function flatMap(...args) {
	return purry(flatMapImplementation, args, lazyImplementation$11);
}
const flatMapImplementation = (data, callbackfn) => data.flatMap(callbackfn);
const lazyImplementation$11 = (callbackfn) => (value, index, data) => {
	const next = callbackfn(value, index, data);
	return Array.isArray(next) ? {
		done: false,
		hasNext: true,
		hasMany: true,
		next
	} : {
		done: false,
		hasNext: true,
		next
	};
};

//#endregion
//#region src/floor.ts
function floor(...args) {
	return purry(withPrecision(Math.floor), args);
}

//#endregion
//#region src/forEach.ts
function forEach(...args) {
	return purry(forEachImplementation, args, lazyImplementation$10);
}
function forEachImplementation(data, callbackfn) {
	data.forEach(callbackfn);
	return data;
}
const lazyImplementation$10 = (callbackfn) => (value, index, data) => {
	callbackfn(value, index, data);
	return {
		done: false,
		hasNext: true,
		next: value
	};
};

//#endregion
//#region src/forEachObj.ts
function forEachObj(...args) {
	return purry(forEachObjImplementation, args);
}
function forEachObjImplementation(data, fn) {
	for (const [key, value] of Object.entries(data)) fn(value, key, data);
	return data;
}

//#endregion
//#region src/fromEntries.ts
function fromEntries(...args) {
	return purry(Object.fromEntries, args);
}

//#endregion
//#region src/fromKeys.ts
function fromKeys(...args) {
	return purry(fromKeysImplementation, args);
}
function fromKeysImplementation(data, mapper) {
	const result = {};
	for (const [index, key] of data.entries()) result[key] = mapper(key, index, data);
	return result;
}

//#endregion
//#region src/funnel.ts
const VOID_REDUCER_SYMBOL = Symbol("funnel/voidReducer");
const voidReducer = () => VOID_REDUCER_SYMBOL;
/**
* Creates a funnel that controls the timing and execution of `callback`. Its
* main purpose is to manage multiple consecutive (usually fast-paced) calls,
* reshaping them according to a defined batching strategy and timing policy.
* This is useful when handling uncontrolled call rates, such as DOM events or
* network traffic. It can implement strategies like debouncing, throttling,
* batching, and more.
*
* An optional `reducer` function can be provided to allow passing data to the
* callback via calls to `call` (otherwise the signature of `call` takes no
* arguments).
*
* Typing is inferred from `callback`s param, and from the rest params that
* the optional `reducer` function accepts. Use **explicit** types for these
* to ensure that everything _else_ is well-typed.
*
* Notice that this function constructs a funnel **object**, and does **not**
* execute anything when called. The returned object should be used to execute
* the funnel via the its `call` method.
*
* - Debouncing: use `minQuietPeriodMs` and any `triggerAt`.
* - Throttling: use `minGapMs` and `triggerAt: "start"` or `"both"`.
* - Batching: See the reference implementation in [`funnel.reference-batch.test.ts`](https://github.com/remeda/remeda/blob/main/packages/remeda/src/funnel.reference-batch.test.ts).
*
* @param callback - The main function that would be invoked periodically based
* on `options`. The function would take the latest result of the `reducer`; if
* no calls where made since the last time it was invoked it will not be
* invoked. (If a return value is needed, it should be passed via a reference or
* via closure to the outer scope of the funnel).
* @param options - An object that defines when `execute` should be invoked,
* relative to the calls of `call`. An empty/missing options object is
* equivalent to setting `minQuietPeriodMs` to `0`.
* @param options.reducer - Combines the arguments passed to `call` with the
* value computed on the previous call (or `undefined` on the first time). The
* goal of the function is to extract and summarize the data needed for
* `callback`. It should be fast and simple as it is called often and should
* defer heavy operations to the `execute` function. If the final value
* is `undefined`, `callback` will not be called.
* @param options.triggerAt - At what "edges" of the funnel's burst window
* would `execute` invoke:
* - `start` - the function will be invoked immediately (within the  **same**
* execution frame!), and any subsequent calls would be ignored until the funnel
* is idle again. During this period `reducer` will also not be called.
* - `end` - the function will **not** be invoked initially but the timer will
* be started. Any calls during this time would be passed to the reducer, and
* when the timers are done, the reduced result would trigger an invocation.
* - `both` - the function will be invoked immediately, and then the funnel
* would behave as if it was in the 'end' state. Default: 'end'.
* @param options.minQuietPeriodMs - The burst timer prevents subsequent calls
* in short succession to cause excessive invocations (aka "debounce"). This
* duration represents the **minimum** amount of time that needs to pass
* between calls (the "quiet" part) in order for the subsequent call to **not**
* be considered part of the burst. In other words, as long as calls are faster
* than this, they are considered part of the burst and the burst is extended.
* @param options.maxBurstDurationMs - Bursts are extended every time a call is
* made within the burst period. This means that the burst period could be
* extended indefinitely. To prevent such cases, a maximum burst duration could
* be defined. When `minQuietPeriodMs` is not defined and this option is, they
* will both share the same value.
* @param options.minGapMs - A minimum duration between calls of `execute`.
* This is maintained regardless of the shape of the burst and is ensured even
* if the `maxBurstDurationMs` is reached before it. (aka "throttle").
* @returns A funnel with a `call` function that is used to trigger invocations.
* In addition to it the funnel also comes with the following functions and
* properties:
* - `cancel` - Resets the funnel to it's initial state, discarding the current
* `reducer` result without calling `execute` on it.
* - `flush` - Triggers an invocation even if there are active timeouts, and
* then resets the funnel to it's initial state.
* - `isIdle` - Checks if there are any active timeouts.
* @signature
*   R.funnel(callback, options);
* @example
*   const debouncer = R.funnel(
*     () => {
*       console.log("Callback executed!");
*     },
*     { minQuietPeriodMs: 100 },
*   );
*   debouncer.call();
*   debouncer.call();
*
*   const throttle = R.funnel(
*     () => {
*       console.log("Callback executed!");
*     },
*     { minGapMs: 100, triggerAt: "start" },
*   );
*   throttle.call();
*   throttle.call();
* @category Function
*/
function funnel(callback, { triggerAt = "end", minQuietPeriodMs, maxBurstDurationMs, minGapMs, reducer = voidReducer }) {
	let burstTimeoutId;
	let intervalTimeoutId;
	let preparedData;
	let burstStartTimestamp;
	const invoke = () => {
		const param = preparedData;
		if (param === void 0) return;
		preparedData = void 0;
		if (param === VOID_REDUCER_SYMBOL) callback();
		else callback(param);
		if (minGapMs !== void 0) intervalTimeoutId = setTimeout(handleIntervalEnd, minGapMs);
	};
	const handleIntervalEnd = () => {
		clearTimeout(intervalTimeoutId);
		intervalTimeoutId = void 0;
		if (burstTimeoutId !== void 0) return;
		invoke();
	};
	const handleBurstEnd = () => {
		clearTimeout(burstTimeoutId);
		burstTimeoutId = void 0;
		burstStartTimestamp = void 0;
		if (intervalTimeoutId !== void 0) return;
		invoke();
	};
	return {
		call: (...args) => {
			const wasIdle = burstTimeoutId === void 0 && intervalTimeoutId === void 0;
			if (triggerAt !== "start" || wasIdle) preparedData = reducer(preparedData, ...args);
			if (burstTimeoutId === void 0 && !wasIdle) return;
			if (minQuietPeriodMs !== void 0 || maxBurstDurationMs !== void 0 || minGapMs === void 0) {
				clearTimeout(burstTimeoutId);
				const now = Date.now();
				burstStartTimestamp ??= now;
				const burstRemainingMs = maxBurstDurationMs === void 0 ? minQuietPeriodMs ?? 0 : Math.min(minQuietPeriodMs ?? maxBurstDurationMs, maxBurstDurationMs - (now - burstStartTimestamp));
				burstTimeoutId = setTimeout(handleBurstEnd, burstRemainingMs);
			}
			if (triggerAt !== "end" && wasIdle) invoke();
		},
		cancel: () => {
			clearTimeout(burstTimeoutId);
			burstTimeoutId = void 0;
			burstStartTimestamp = void 0;
			clearTimeout(intervalTimeoutId);
			intervalTimeoutId = void 0;
			preparedData = void 0;
		},
		flush: () => {
			handleBurstEnd();
			handleIntervalEnd();
		},
		get isIdle() {
			return burstTimeoutId === void 0 && intervalTimeoutId === void 0;
		}
	};
}

//#endregion
//#region src/groupBy.ts
function groupBy(...args) {
	return purry(groupByImplementation, args);
}
const groupByImplementation = (data, callbackfn) => {
	const output = Object.create(null);
	for (let index = 0; index < data.length; index++) {
		const item = data[index];
		const key = callbackfn(item, index, data);
		if (key !== void 0) {
			const items = output[key];
			if (items === void 0) output[key] = [item];
			else items.push(item);
		}
	}
	Object.setPrototypeOf(output, Object.prototype);
	return output;
};

//#endregion
//#region src/groupByProp.ts
function groupByProp(...args) {
	return purry(groupByPropImplementation, args);
}
function groupByPropImplementation(data, prop$1) {
	const output = Object.create(null);
	for (const item of data) {
		const key = item?.[prop$1];
		if (key !== void 0) {
			const items = output[key];
			if (items === void 0) output[key] = [item];
			else items.push(item);
		}
	}
	Object.setPrototypeOf(output, Object.prototype);
	return output;
}

//#endregion
//#region src/isDeepEqual.ts
function isDeepEqual(...args) {
	return purry(isDeepEqualImplementation, args);
}
function isDeepEqualImplementation(data, other) {
	if (data === other) return true;
	if (Object.is(data, other)) return true;
	if (typeof data !== "object" || typeof other !== "object") return false;
	if (data === null || other === null) return false;
	if (Object.getPrototypeOf(data) !== Object.getPrototypeOf(other)) return false;
	if (Array.isArray(data)) return isDeepEqualArrays(data, other);
	if (data instanceof Map) return isDeepEqualMaps(data, other);
	if (data instanceof Set) return isDeepEqualSets(data, other);
	if (data instanceof Date) return data.getTime() === other.getTime();
	if (data instanceof RegExp) return data.toString() === other.toString();
	if (Object.keys(data).length !== Object.keys(other).length) return false;
	for (const [key, value] of Object.entries(data)) {
		if (!(key in other)) return false;
		if (!isDeepEqualImplementation(value, other[key])) return false;
	}
	return true;
}
function isDeepEqualArrays(data, other) {
	if (data.length !== other.length) return false;
	for (const [index, item] of data.entries()) if (!isDeepEqualImplementation(item, other[index])) return false;
	return true;
}
function isDeepEqualMaps(data, other) {
	if (data.size !== other.size) return false;
	for (const [key, value] of data.entries()) {
		if (!other.has(key)) return false;
		if (!isDeepEqualImplementation(value, other.get(key))) return false;
	}
	return true;
}
function isDeepEqualSets(data, other) {
	if (data.size !== other.size) return false;
	const otherCopy = [...other];
	for (const dataItem of data) {
		let isFound = false;
		for (const [index, otherItem] of otherCopy.entries()) if (isDeepEqualImplementation(dataItem, otherItem)) {
			isFound = true;
			otherCopy.splice(index, 1);
			break;
		}
		if (!isFound) return false;
	}
	return true;
}

//#endregion
//#region src/hasSubObject.ts
function hasSubObject(...args) {
	return purry(hasSubObjectImplementation, args);
}
function hasSubObjectImplementation(data, subObject) {
	for (const [key, value] of Object.entries(subObject)) {
		if (!Object.hasOwn(data, key)) return false;
		if (!isDeepEqual(value, data[key])) return false;
	}
	return true;
}

//#endregion
//#region src/identity.ts
/**
* A function that returns the first argument passed to it.
*
* Notice that this is a dataLast impl where the function needs to be invoked
* to get the "do nothing" function.
*
* See also:
* * `doNothing` - A function that doesn't return anything.
* * `constant` - A function that ignores the input arguments and returns the same value on every invocation.
*
* @signature
*    R.identity();
* @example
*    R.map([1,2,3], R.identity()); // => [1,2,3]
* @category Function
*/
function identity() {
	return identityImplementation;
}
const identityImplementation = (firstParameter) => firstParameter;

//#endregion
//#region src/indexBy.ts
function indexBy(...args) {
	return purry(indexByImplementation, args);
}
function indexByImplementation(data, mapper) {
	const out = {};
	for (const [index, item] of data.entries()) {
		const key = mapper(item, index, data);
		out[key] = item;
	}
	return out;
}

//#endregion
//#region src/intersection.ts
function intersection(...args) {
	return purryFromLazy(lazyImplementation$9, args);
}
function lazyImplementation$9(other) {
	if (other.length === 0) return lazyEmptyEvaluator;
	const remaining = /* @__PURE__ */ new Map();
	for (const value of other) remaining.set(value, (remaining.get(value) ?? 0) + 1);
	return (value) => {
		const copies = remaining.get(value);
		if (copies === void 0 || copies === 0) return SKIP_ITEM;
		if (copies === 1) remaining.delete(value);
		else remaining.set(value, copies - 1);
		return {
			hasNext: true,
			next: value,
			done: remaining.size === 0
		};
	};
}

//#endregion
//#region src/intersectionWith.ts
function intersectionWith(...args) {
	return purryFromLazy(lazyImplementation$8, args);
}
const lazyImplementation$8 = (other, comparator) => (value) => other.some((otherValue) => comparator(value, otherValue)) ? {
	done: false,
	hasNext: true,
	next: value
} : SKIP_ITEM;

//#endregion
//#region src/invert.ts
function invert(...args) {
	return purry(invertImplementation, args);
}
function invertImplementation(data) {
	const result = {};
	for (const [key, value] of Object.entries(data)) result[value] = key;
	return result;
}

//#endregion
//#region src/isArray.ts
/**
* A function that checks if the passed parameter is an Array and narrows its type accordingly.
*
* @param data - The variable to check.
* @returns True if the passed input is an Array, false otherwise.
* @signature
*    R.isArray(data)
* @example
*    R.isArray([5]) //=> true
*    R.isArray([]) //=> true
*    R.isArray('somethingElse') //=> false
* @category Guard
*/
function isArray(data) {
	return Array.isArray(data);
}

//#endregion
//#region src/isBigInt.ts
/**
* A function that checks if the passed parameter is a bigint and narrows its
* type accordingly.
*
* @param data - The variable to check.
* @returns True if the passed input is a number, false otherwise.
* @signature
*    R.isBigInt(data)
* @example
*    R.isBigInt(1n); // => true
*    R.isBigInt(1); // => false
*    R.isBigInt('notANumber'); // => false
* @category Guard
*/
function isBigInt(data) {
	return typeof data === "bigint";
}

//#endregion
//#region src/isBoolean.ts
/**
* A function that checks if the passed parameter is a boolean and narrows its type accordingly.
*
* @param data - The variable to check.
* @returns True if the passed input is a boolean, false otherwise.
* @signature
*    R.isBoolean(data)
* @example
*    R.isBoolean(true) //=> true
*    R.isBoolean(false) //=> true
*    R.isBoolean('somethingElse') //=> false
* @category Guard
*/
function isBoolean(data) {
	return typeof data === "boolean";
}

//#endregion
//#region src/isDate.ts
/**
* A function that checks if the passed parameter is a Date and narrows its type accordingly.
*
* @param data - The variable to check.
* @returns True if the passed input is a Date, false otherwise.
* @signature
*    R.isDate(data)
* @example
*    R.isDate(new Date()) //=> true
*    R.isDate('somethingElse') //=> false
* @category Guard
*/
function isDate(data) {
	return data instanceof Date;
}

//#endregion
//#region src/isDefined.ts
/**
* A function that checks if the passed parameter is defined (`!== undefined`)
* and narrows its type accordingly.
*
* @param data - The variable to check.
* @returns True if the passed input is defined, false otherwise.
* @signature
*    R.isDefined(data)
* @example
*    R.isDefined('string') //=> true
*    R.isDefined(null) //=> true
*    R.isDefined(undefined) //=> false
* @category Guard
*/
function isDefined(data) {
	return data !== void 0;
}

//#endregion
//#region src/isEmpty.ts
function isEmpty(data) {
	if (data === "" || data === void 0) return true;
	if (Array.isArray(data)) return data.length === 0;
	return Object.keys(data).length === 0;
}

//#endregion
//#region src/isEmptyish.ts
function isEmptyish(data) {
	if (data == void 0 || data === "") return true;
	if (typeof data !== "object") return false;
	if ("length" in data && typeof data.length === "number") return data.length === 0;
	if ("size" in data && typeof data.size === "number") return data.size === 0;
	for (const _ in data) return false;
	return Object.getOwnPropertySymbols(data).length === 0;
}

//#endregion
//#region src/isError.ts
/**
* A function that checks if the passed parameter is an Error and narrows its type accordingly.
*
* @param data - The variable to check.
* @returns True if the passed input is an Error, false otherwise.
* @signature
*    R.isError(data)
* @example
*    R.isError(new Error('message')) //=> true
*    R.isError('somethingElse') //=> false
* @category Guard
*/
function isError(data) {
	return data instanceof Error;
}

//#endregion
//#region src/isFunction.ts
/**
* A function that checks if the passed parameter is a Function and narrows its type accordingly.
*
* @param data - The variable to check.
* @returns True if the passed input is a Function, false otherwise.
* @signature
*    R.isFunction(data)
* @example
*    R.isFunction(() => {}) //=> true
*    R.isFunction('somethingElse') //=> false
* @category Guard
*/
const isFunction = (data) => typeof data === "function";

//#endregion
//#region src/isIncludedIn.ts
function isIncludedIn(dataOrContainer, container) {
	if (container === void 0) {
		const asSet = new Set(dataOrContainer);
		return (data) => asSet.has(data);
	}
	return container.includes(dataOrContainer);
}

//#endregion
//#region src/isNonNull.ts
/**
* A function that checks if the passed parameter is not `null` and narrows its type accordingly.
* Notice that `undefined` is not null!
*
* @param data - The variable to check.
* @returns True if the passed input is defined, false otherwise.
* @signature
*    R.isNonNull(data)
* @example
*    R.isNonNull('string') //=> true
*    R.isNonNull(null) //=> false
*    R.isNonNull(undefined) //=> true
* @category Guard
*/
function isNonNull(data) {
	return data !== null;
}

//#endregion
//#region src/isNonNullish.ts
/**
* A function that checks if the passed parameter is defined *AND* isn't `null`
* and narrows its type accordingly.
*
* @param data - The variable to check.
* @returns True if the passed input is defined and isn't `null`, false
* otherwise.
* @signature
*    R.isNonNullish(data)
* @example
*    R.isNonNullish('string') //=> true
*    R.isNonNullish(null) //=> false
*    R.isNonNullish(undefined) //=> false
* @category Guard
*/
function isNonNullish(data) {
	return data !== void 0 && data !== null;
}

//#endregion
//#region src/isNot.ts
function isNot(predicate) {
	return (data) => !predicate(data);
}

//#endregion
//#region src/isNullish.ts
/**
* A function that checks if the passed parameter is either `null` or
* `undefined` and narrows its type accordingly.
*
* @param data - The variable to check.
* @returns True if the passed input is either `null` or `undefined`, false
* otherwise.
* @signature
*    R.isNullish(data)
* @example
*    R.isNullish(undefined) //=> true
*    R.isNullish(null) //=> true
*    R.isNullish('somethingElse') //=> false
* @category Guard
*/
function isNullish(data) {
	return data === null || data === void 0;
}

//#endregion
//#region src/isNumber.ts
/**
* A function that checks if the passed parameter is a number and narrows its
* type accordingly.
*
* @param data - The variable to check.
* @returns True if the passed input is a number, false otherwise.
* @signature
*    R.isNumber(data)
* @example
*    R.isNumber(1); // => true
*    R.isNumber(1n); // => false
*    R.isNumber('notANumber'); // => false
* @category Guard
*/
function isNumber(data) {
	return typeof data === "number" && !Number.isNaN(data);
}

//#endregion
//#region src/isObjectType.ts
/**
* Checks if the given parameter is of type `"object"` via `typeof`, excluding `null`.
*
* It's important to note that in JavaScript, many entities are considered objects, like Arrays, Classes, RegExps, Maps, Sets, Dates, URLs, Promise, Errors, and more. Although technically an object too, `null` is not considered an object by this function, so that its easier to narrow nullables.
*
* For a more specific check that is limited to plain objects (simple struct/shape/record-like objects), consider using `isPlainObject` instead. For a simpler check that only removes `null` from the type prefer `isNonNull` or `isDefined`.
*
* @param data - The variable to be checked for being an object type.
* @returns The input type, narrowed to only objects.
* @signature
*    R.isObjectType(data)
* @example
*    // true
*    R.isObjectType({}) //=> true
*    R.isObjectType([]) //=> true
*    R.isObjectType(Promise.resolve("something")) //=> true
*    R.isObjectType(new Date()) //=> true
*    R.isObjectType(new Error("error")) //=> true
*
*    // false
*    R.isObjectType('somethingElse') //=> false
*    R.isObjectType(null) //=> false
* @dataFirst
* @category Guard
*/
function isObjectType(data) {
	return typeof data === "object" && data !== null;
}

//#endregion
//#region src/isPlainObject.ts
/**
* Checks if `data` is a "plain" object. A plain object is defined as an object with string keys and values of any type, including primitives, other objects, functions, classes, etc (aka struct/shape/record/simple). Technically, a plain object is one whose prototype is either `Object.prototype` or `null`, ensuring it does not inherit properties or methods from other object types.
*
* This function is narrower in scope than `isObjectType`, which accepts any entity considered an `"object"` by JavaScript's `typeof`.
*
* Note that Maps, Arrays, and Sets are not considered plain objects and would return `false`.
*
* @param data - The variable to check.
* @returns The input type, narrowed to only plain objects.
* @signature
*    R.isPlainObject(data)
* @example
*    // true
*    R.isPlainObject({}) //=> true
*    R.isPlainObject({ a: 123 }) //=> true
*
*    // false
*    R.isPlainObject([]) //=> false
*    R.isPlainObject(Promise.resolve("something")) //=> false
*    R.isPlainObject(new Date()) //=> false
*    R.isPlainObject(new Error("error")) //=> false
*    R.isPlainObject('somethingElse') //=> false
*    R.isPlainObject(null) //=> false
* @category Guard
*/
function isPlainObject(data) {
	if (typeof data !== "object" || data === null) return false;
	const proto = Object.getPrototypeOf(data);
	return proto === null || proto === Object.prototype;
}

//#endregion
//#region src/isPromise.ts
/**
* A function that checks if the passed parameter is a Promise and narrows its type accordingly.
*
* @param data - The variable to check.
* @returns True if the passed input is a Promise, false otherwise.
* @signature
*    R.isPromise(data)
* @example
*    R.isPromise(Promise.resolve(5)) //=> true
*    R.isPromise(Promise.reject(5)) //=> true
*    R.isPromise('somethingElse') //=> false
* @category Guard
*/
function isPromise(data) {
	return data instanceof Promise;
}

//#endregion
//#region src/isShallowEqual.ts
function isShallowEqual(...args) {
	return purry(isShallowEqualImplementation, args);
}
function isShallowEqualImplementation(a, b) {
	if (a === b || Object.is(a, b)) return true;
	if (typeof a !== "object" || a === null || typeof b !== "object" || b === null) return false;
	if (a instanceof Map && b instanceof Map) return isMapShallowEqual(a, b);
	if (a instanceof Set && b instanceof Set) return isSetShallowEqual(a, b);
	const keys$1 = Object.keys(a);
	if (keys$1.length !== Object.keys(b).length) return false;
	for (const key of keys$1) {
		if (!Object.hasOwn(b, key)) return false;
		const { [key]: valueA } = a;
		const { [key]: valueB } = b;
		if (valueA !== valueB || !Object.is(valueA, valueB)) return false;
	}
	return true;
}
function isMapShallowEqual(a, b) {
	if (a.size !== b.size) return false;
	for (const [key, value] of a) {
		const valueB = b.get(key);
		if (value !== valueB || !Object.is(value, valueB)) return false;
	}
	return true;
}
function isSetShallowEqual(a, b) {
	if (a.size !== b.size) return false;
	for (const value of a) if (!b.has(value)) return false;
	return true;
}

//#endregion
//#region src/isStrictEqual.ts
function isStrictEqual(...args) {
	return purry(isStrictlyEqualImplementation, args);
}
const isStrictlyEqualImplementation = (data, other) => data === other || Object.is(data, other);

//#endregion
//#region src/isString.ts
/**
* A function that checks if the passed parameter is a string and narrows its type accordingly.
*
* @param data - The variable to check.
* @returns True if the passed input is a string, false otherwise.
* @signature
*    R.isString(data)
* @example
*    R.isString('string') //=> true
*    R.isString(1) //=> false
* @category Guard
*/
function isString(data) {
	return typeof data === "string";
}

//#endregion
//#region src/isSymbol.ts
/**
* A function that checks if the passed parameter is a symbol and narrows its type accordingly.
*
* @param data - The variable to check.
* @returns True if the passed input is a symbol, false otherwise.
* @signature
*    R.isSymbol(data)
* @example
*    R.isSymbol(Symbol('foo')) //=> true
*    R.isSymbol(1) //=> false
* @category Guard
*/
function isSymbol(data) {
	return typeof data === "symbol";
}

//#endregion
//#region src/isTruthy.ts
/**
* A function that checks if the passed parameter is truthy and narrows its type accordingly.
*
* @param data - The variable to check.
* @returns True if the passed input is truthy, false otherwise.
* @signature
*    R.isTruthy(data)
* @example
*    R.isTruthy('somethingElse') //=> true
*    R.isTruthy(null) //=> false
*    R.isTruthy(undefined) //=> false
*    R.isTruthy(false) //=> false
*    R.isTruthy(0) //=> false
*    R.isTruthy('') //=> false
* @category Guard
*/
function isTruthy(data) {
	return Boolean(data);
}

//#endregion
//#region src/join.ts
function join(...args) {
	return purry(joinImplementation, args);
}
const joinImplementation = (data, glue) => data.join(glue);

//#endregion
//#region src/keys.ts
function keys(...args) {
	return purry(Object.keys, args);
}

//#endregion
//#region src/last.ts
function last(...args) {
	return purry(lastImplementation, args);
}
const lastImplementation = (array) => array.at(-1);

//#endregion
//#region src/length.ts
function length(...args) {
	return purry(lengthImplementation, args);
}
const lengthImplementation = (items) => "length" in items ? items.length : [...items].length;

//#endregion
//#region src/map.ts
function map(...args) {
	return purry(mapImplementation, args, lazyImplementation$7);
}
const mapImplementation = (data, callbackfn) => data.map(callbackfn);
const lazyImplementation$7 = (callbackfn) => (value, index, data) => ({
	done: false,
	hasNext: true,
	next: callbackfn(value, index, data)
});

//#endregion
//#region src/mapKeys.ts
function mapKeys(...args) {
	return purry(mapKeysImplementation, args);
}
function mapKeysImplementation(data, keyMapper) {
	const out = {};
	for (const [key, value] of Object.entries(data)) {
		const mappedKey = keyMapper(key, value, data);
		out[mappedKey] = value;
	}
	return out;
}

//#endregion
//#region src/mapToObj.ts
function mapToObj(...args) {
	return purry(mapToObjImplementation, args);
}
function mapToObjImplementation(array, fn) {
	const out = {};
	for (const [index, element] of array.entries()) {
		const [key, value] = fn(element, index, array);
		out[key] = value;
	}
	return out;
}

//#endregion
//#region src/mapValues.ts
function mapValues(...args) {
	return purry(mapValuesImplementation, args);
}
function mapValuesImplementation(data, valueMapper) {
	const out = {};
	for (const [key, value] of Object.entries(data)) out[key] = valueMapper(value, key, data);
	return out;
}

//#endregion
//#region src/mapWithFeedback.ts
function mapWithFeedback(...args) {
	return purryFromLazy(lazyImplementation$6, args);
}
const lazyImplementation$6 = (reducer, initialValue) => {
	let previousValue = initialValue;
	return (currentValue, index, data) => {
		previousValue = reducer(previousValue, currentValue, index, data);
		return {
			done: false,
			hasNext: true,
			next: previousValue
		};
	};
};

//#endregion
//#region src/sum.ts
function sum(...args) {
	return purry(sumImplementation, args);
}
function sumImplementation(data) {
	let out = typeof data[0] === "bigint" ? 0n : 0;
	for (const value of data) out += value;
	return out;
}

//#endregion
//#region src/mean.ts
function mean(...args) {
	return purry(meanImplementation, args);
}
function meanImplementation(data) {
	if (data.length === 0) return;
	return sum(data) / data.length;
}

//#endregion
//#region src/meanBy.ts
function meanBy(...args) {
	return purry(meanByImplementation, args);
}
const meanByImplementation = (array, fn) => {
	if (array.length === 0) return NaN;
	let sum$1 = 0;
	for (const [index, item] of array.entries()) sum$1 += fn(item, index, array);
	return sum$1 / array.length;
};

//#endregion
//#region src/median.ts
function median(...args) {
	return purry(medianImplementation, args);
}
const numberComparator = (a, b) => a - b;
function medianImplementation(data) {
	if (data.length === 0) return;
	const sortedData = [...data].sort(numberComparator);
	if (sortedData.length % 2 !== 0) return sortedData[(sortedData.length - 1) / 2];
	const middleIndex = sortedData.length / 2;
	return (sortedData[middleIndex] + sortedData[middleIndex - 1]) / 2;
}

//#endregion
//#region src/merge.ts
function merge(...args) {
	return purry(mergeImplementation, args);
}
const mergeImplementation = (data, source) => ({
	...data,
	...source
});

//#endregion
//#region src/mergeAll.ts
function mergeAll(objects) {
	let out = {};
	for (const item of objects) out = {
		...out,
		...item
	};
	return out;
}

//#endregion
//#region src/mergeDeep.ts
function mergeDeep(...args) {
	return purry(mergeDeepImplementation, args);
}
function mergeDeepImplementation(destination, source) {
	const output = {
		...destination,
		...source
	};
	for (const key in source) {
		if (!(key in destination)) continue;
		const { [key]: destinationValue } = destination;
		if (!isPlainObject(destinationValue)) continue;
		const { [key]: sourceValue } = source;
		if (!isPlainObject(sourceValue)) continue;
		output[key] = mergeDeepImplementation(destinationValue, sourceValue);
	}
	return output;
}

//#endregion
//#region src/multiply.ts
function multiply(...args) {
	return purry(multiplyImplementation, args);
}
const multiplyImplementation = (value, multiplicand) => value * multiplicand;

//#endregion
//#region src/internal/quickSelect.ts
/**
* Perform QuickSelect on the given data. Notice that the data would be cloned
* shallowly so that it could be mutated in-place, and then discarded once the
* algorithm is done. This means that running this function multiple times on
* the same array might be slower then sorting the array before.
*
* @param data - The data to perform the selection on.
* @param index - The index of the item we are looking for.
* @param compareFn - The compare function to use for sorting.
* @returns The item at the given index, or `undefined` if the index is out-of-
* bounds.
*/
const quickSelect = (data, index, compareFn) => index < 0 || index >= data.length ? void 0 : quickSelectImplementation([...data], 0, data.length - 1, index, compareFn);
/**
* The actual implementation, called recursively.
*/
function quickSelectImplementation(data, left, right, index, compareFn) {
	if (left === right) return data[left];
	const pivotIndex = partition$1(data, left, right, compareFn);
	return index === pivotIndex ? data[index] : quickSelectImplementation(data, index < pivotIndex ? left : pivotIndex + 1, index < pivotIndex ? pivotIndex - 1 : right, index, compareFn);
}
function partition$1(data, left, right, compareFn) {
	const pivot = data[right];
	let i = left;
	for (let j = left; j < right; j++) if (compareFn(data[j], pivot) < 0) {
		swapInPlace(data, i, j);
		i += 1;
	}
	swapInPlace(data, i, right);
	return i;
}

//#endregion
//#region src/nthBy.ts
function nthBy(...args) {
	return purryOrderRulesWithArgument(nthByImplementation, args);
}
const nthByImplementation = (data, compareFn, index) => quickSelect(data, index >= 0 ? index : data.length + index, compareFn);

//#endregion
//#region src/objOf.ts
function objOf(...args) {
	return purry(objOfImplementation, args);
}
const objOfImplementation = (value, key) => ({ [key]: value });

//#endregion
//#region src/omit.ts
function omit(...args) {
	return purry(omitImplementation, args);
}
function omitImplementation(data, keys$1) {
	if (!hasAtLeast(keys$1, 1)) return { ...data };
	if (!hasAtLeast(keys$1, 2)) {
		const { [keys$1[0]]: _omitted,...remaining } = data;
		return remaining;
	}
	const out = { ...data };
	for (const key of keys$1) delete out[key];
	return out;
}

//#endregion
//#region src/omitBy.ts
function omitBy(...args) {
	return purry(omitByImplementation, args);
}
function omitByImplementation(data, predicate) {
	const out = { ...data };
	for (const [key, value] of Object.entries(out)) if (predicate(value, key, data)) delete out[key];
	return out;
}

//#endregion
//#region src/once.ts
/**
* Creates a function that is restricted to invoking `func` once. Repeat calls to the function return the value of the first invocation.
*
* @param fn - The function to wrap.
* @signature R.once(fn)
* @example
* const initialize = R.once(createApplication);
* initialize();
* initialize();
* // => `createApplication` is invoked once
* @category Function
*/
function once(fn) {
	let called = false;
	let ret;
	return () => {
		if (!called) {
			ret = fn();
			called = true;
		}
		return ret;
	};
}

//#endregion
//#region src/only.ts
function only(...args) {
	return purry(onlyImplementation, args);
}
const onlyImplementation = (array) => array.length === 1 ? array[0] : void 0;

//#endregion
//#region src/partialBind.ts
/**
* Creates a function that calls `func` with `partial` put before the arguments
* it receives.
*
* Can be thought of as "freezing" some portion of a function's arguments,
* resulting in a new function with a simplified signature.
*
* @param func - The function to wrap.
* @param partial - The arguments to put before.
* @returns A partially bound function.
* @signature
*    R.partialBind(func, ...partial);
* @example
*    const fn = (x: number, y: number, z: number) => x * 100 + y * 10 + z;
*    const partialFn = R.partialBind(fn, 1, 2);
*    partialFn(3); //=> 123
*
*    const logWithPrefix = R.partialBind(console.log, "[prefix]");
*    logWithPrefix("hello"); //=> "[prefix] hello"
* @dataFirst
* @category Function
* @see partialLastBind
*/
function partialBind(func, ...partial) {
	return (...rest) => func(...partial, ...rest);
}

//#endregion
//#region src/partialLastBind.ts
/**
* Creates a function that calls `func` with `partial` put after the arguments
* it receives. Note that this doesn't support functions with both optional
* and rest parameters.
*
* Can be thought of as "freezing" some portion of a function's arguments,
* resulting in a new function with a simplified signature.
*
* Useful for converting a data-first function to a data-last one.
*
* @param func - The function to wrap.
* @param partial - The arguments to put after.
* @returns A partially bound function.
* @signature
*    R.partialLastBind(func, ...partial);
* @example
*    const fn = (x: number, y: number, z: number) => x * 100 + y * 10 + z;
*    const partialFn = R.partialLastBind(fn, 2, 3);
*    partialFn(1); //=> 123
*
*    const parseBinary = R.partialLastBind(parseInt, "2");
*    parseBinary("101"); //=> 5
*
*    R.pipe(
*      { a: 1 },
*      // instead of (arg) => JSON.stringify(arg, null, 2)
*      R.partialLastBind(JSON.stringify, null, 2),
*    ); //=> '{\n  "a": 1\n}'
* @dataFirst
* @category Function
* @see partialBind
*/
function partialLastBind(func, ...partial) {
	return (...rest) => func(...rest, ...partial);
}

//#endregion
//#region src/partition.ts
function partition(...args) {
	return purry(partitionImplementation, args);
}
const partitionImplementation = (data, predicate) => {
	const ret = [[], []];
	for (const [index, item] of data.entries()) if (predicate(item, index, data)) ret[0].push(item);
	else ret[1].push(item);
	return ret;
};

//#endregion
//#region src/pathOr.ts
function pathOr(...args) {
	return purry(pathOrImplementation, args);
}
function pathOrImplementation(data, path, defaultValue) {
	let current = data;
	for (const prop$1 of path) {
		if (current === null || current === void 0) break;
		current = current[prop$1];
	}
	return current ?? defaultValue;
}

//#endregion
//#region src/pick.ts
function pick(...args) {
	return purry(pickImplementation, args);
}
function pickImplementation(object, keys$1) {
	const out = {};
	for (const key of keys$1) if (key in object) out[key] = object[key];
	return out;
}

//#endregion
//#region src/pickBy.ts
function pickBy(...args) {
	return purry(pickByImplementation, args);
}
function pickByImplementation(data, predicate) {
	const out = {};
	for (const [key, value] of Object.entries(data)) if (predicate(value, key, data)) out[key] = value;
	return out;
}

//#endregion
//#region src/piped.ts
function piped(...functions) {
	return (value) => pipe(value, ...functions);
}

//#endregion
//#region src/product.ts
function product(...args) {
	return purry(productImplementation, args);
}
function productImplementation(data) {
	let out = typeof data[0] === "bigint" ? 1n : 1;
	for (const value of data) out *= value;
	return out;
}

//#endregion
//#region src/prop.ts
function prop(maybeData, ...args) {
	return typeof maybeData === "string" || typeof maybeData === "number" || typeof maybeData === "symbol" ? (data) => propImplementation(data, maybeData, ...args) : propImplementation(maybeData, ...args);
}
function propImplementation(data, ...keys$1) {
	let output = data;
	for (const key of keys$1) {
		if (output === void 0 || output === null) return;
		output = output[key];
	}
	return output;
}

//#endregion
//#region src/pullObject.ts
function pullObject(...args) {
	return purry(pullObjectImplementation, args);
}
function pullObjectImplementation(data, keyExtractor, valueExtractor) {
	const result = {};
	for (const [index, item] of data.entries()) {
		const key = keyExtractor(item, index, data);
		result[key] = valueExtractor(item, index, data);
	}
	return result;
}

//#endregion
//#region src/randomBigInt.ts
/**
* Generate a random `bigint` between `from` and `to` (inclusive).
*
* ! Important: In most environments this function uses
* [`crypto.getRandomValues()`](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues)
* under-the-hood which **is** cryptographically strong. When the WebCrypto API
* isn't available (Node 18) we fallback to an implementation that uses
* [`Math.random()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random)
* which is **NOT** cryptographically secure.
*
* @param from - The minimum value.
* @param to - The maximum value.
* @returns The random integer.
* @signature
*   R.randomBigInt(from, to)
* @example
*   R.randomBigInt(1n, 10n) // => 5n
* @dataFirst
* @category Number
*/
function randomBigInt(from, to) {
	if (to < from) throw new RangeError(`randomBigInt: The range [${from.toString()},${to.toString()}] is empty.`);
	const range$1 = to - from;
	const { length: maxBits } = range$1.toString(2);
	const maxBytes = Math.ceil(maxBits / 8);
	const excessBits = BigInt(8 - maxBits % 8);
	while (true) {
		const result = asBigInt(random(maxBytes)) >> excessBits;
		if (result <= range$1) return result + from;
	}
}
function asBigInt(bytes) {
	let result = 0n;
	for (const byte of bytes) result = (result << 8n) + BigInt(byte);
	return result;
}
function random(numBytes) {
	const output = new Uint8Array(numBytes);
	if (typeof crypto === "undefined") for (let index = 0; index < numBytes; index += 1) output[index] = Math.floor(Math.random() * 256);
	else crypto.getRandomValues(output);
	return output;
}

//#endregion
//#region src/randomInteger.ts
/**
* Generate a random integer between `from` and `to` (inclusive).
*
* !Important: This function uses [`Math.random()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random) under-the-hood, which has two major limitations:
* 1. It generates 2^52 possible values, so the bigger the range, the less
* uniform the distribution of values would be, and at ranges larger than that
* some values would never come up.
* 2. It is not cryptographically secure and should not be used for security
* scenarios.
*
* @param from - The minimum value.
* @param to - The maximum value.
* @returns The random integer.
* @signature
*   R.randomInteger(from, to)
* @example
*   R.randomInteger(1, 10) // => 5
*   R.randomInteger(1.5, 2.6) // => 2
* @dataFirst
* @category Number
*/
function randomInteger(from, to) {
	const fromCeiled = Math.ceil(from);
	const toFloored = Math.floor(to);
	if (toFloored < fromCeiled) throw new RangeError(`randomInteger: The range [${from.toString()},${to.toString()}] contains no integer`);
	return Math.floor(Math.random() * (toFloored - fromCeiled + 1) + fromCeiled);
}

//#endregion
//#region src/randomString.ts
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
function randomString(...args) {
	return purry(randomStringImplementation, args);
}
function randomStringImplementation(length$1) {
	const out = [];
	for (let iteration = 0; iteration < length$1; iteration++) {
		const randomChar = ALPHABET[Math.floor(Math.random() * 62)];
		out.push(randomChar);
	}
	return out.join("");
}

//#endregion
//#region src/range.ts
function range(...args) {
	return purry(rangeImplementation, args);
}
function rangeImplementation(start, end) {
	const ret = [];
	for (let i = start; i < end; i++) ret.push(i);
	return ret;
}

//#endregion
//#region src/rankBy.ts
function rankBy(...args) {
	return purryOrderRulesWithArgument(rankByImplementation, args);
}
function rankByImplementation(data, compareFn, targetItem) {
	let rank = 0;
	for (const item of data) if (compareFn(targetItem, item) > 0) rank += 1;
	return rank;
}

//#endregion
//#region src/reduce.ts
function reduce(...args) {
	return purry(reduceImplementation, args);
}
const reduceImplementation = (data, callbackfn, initialValue) => data.reduce(callbackfn, initialValue);

//#endregion
//#region src/reverse.ts
function reverse(...args) {
	return purry(reverseImplementation, args);
}
function reverseImplementation(array) {
	return [...array].reverse();
}

//#endregion
//#region src/round.ts
function round(...args) {
	return purry(withPrecision(Math.round), args);
}

//#endregion
//#region src/sample.ts
function sample(...args) {
	return purry(sampleImplementation, args);
}
function sampleImplementation(data, sampleSize) {
	if (sampleSize <= 0) return [];
	if (sampleSize >= data.length) return [...data];
	const actualSampleSize = Math.min(sampleSize, data.length - sampleSize);
	const sampleIndices = /* @__PURE__ */ new Set();
	while (sampleIndices.size < actualSampleSize) {
		const randomIndex = Math.floor(Math.random() * data.length);
		sampleIndices.add(randomIndex);
	}
	if (sampleSize === actualSampleSize) return [...sampleIndices].sort((a, b) => a - b).map((index) => data[index]);
	return data.filter((_, index) => !sampleIndices.has(index));
}

//#endregion
//#region src/set.ts
function set(...args) {
	return purry(setImplementation, args);
}
const setImplementation = (obj, prop$1, value) => ({
	...obj,
	[prop$1]: value
});

//#endregion
//#region src/setPath.ts
function setPath(...args) {
	return purry(setPathImplementation, args);
}
function setPathImplementation(data, path, value) {
	const [pivot, ...rest] = path;
	if (pivot === void 0) return value;
	if (Array.isArray(data)) {
		const copy = [...data];
		copy[pivot] = setPathImplementation(data[pivot], rest, value);
		return copy;
	}
	const { [pivot]: currentValue,...remaining } = data;
	return {
		...remaining,
		[pivot]: setPathImplementation(currentValue, rest, value)
	};
}

//#endregion
//#region src/shuffle.ts
function shuffle(...args) {
	return purry(shuffleImplementation, args);
}
function shuffleImplementation(items) {
	const result = [...items];
	for (let index = 0; index < items.length; index++) {
		const rand = index + Math.floor(Math.random() * (items.length - index));
		const value = result[rand];
		result[rand] = result[index];
		result[index] = value;
	}
	return result;
}

//#endregion
//#region src/sliceString.ts
function sliceString(dataOrIndexStart, indexStartOrIndexEnd, indexEnd) {
	return typeof dataOrIndexStart === "string" ? dataOrIndexStart.slice(indexStartOrIndexEnd, indexEnd) : (data) => data.slice(dataOrIndexStart, indexStartOrIndexEnd);
}

//#endregion
//#region src/sort.ts
function sort(...args) {
	return purry(sortImplementation, args);
}
function sortImplementation(items, cmp) {
	const ret = [...items];
	ret.sort(cmp);
	return ret;
}

//#endregion
//#region src/sortBy.ts
function sortBy(...args) {
	return purryOrderRules(sortByImplementation, args);
}
const sortByImplementation = (data, compareFn) => [...data].sort(compareFn);

//#endregion
//#region src/internal/binarySearchCutoffIndex.ts
/**
* A binary search implementation that finds the index at which `predicate`
* stops returning `true` and starts returning `false` (consistently) when run
* on the items of the array. It **assumes** that mapping the array via the
* predicate results in the shape `[...true[], ...false[]]`. *For any other case
* the result is unpredictable*.
*
* This is the base implementation of the `sortedIndex` functions which define
* the predicate for the user, for common use-cases.
*
* It is similar to `findIndex`, but runs at O(logN), whereas the latter is
* general purpose function which runs on any array and predicate, but runs at
* O(N) time.
*/
function binarySearchCutoffIndex(array, predicate) {
	let lowIndex = 0;
	let highIndex = array.length;
	while (lowIndex < highIndex) {
		const pivotIndex = lowIndex + highIndex >>> 1;
		const pivot = array[pivotIndex];
		if (predicate(pivot, pivotIndex, array)) lowIndex = pivotIndex + 1;
		else highIndex = pivotIndex;
	}
	return highIndex;
}

//#endregion
//#region src/sortedIndex.ts
function sortedIndex(...args) {
	return purry(sortedIndexImplementation, args);
}
const sortedIndexImplementation = (array, item) => binarySearchCutoffIndex(array, (pivot) => pivot < item);

//#endregion
//#region src/sortedIndexBy.ts
function sortedIndexBy(...args) {
	return purry(sortedIndexByImplementation, args);
}
function sortedIndexByImplementation(data, item, valueFunction) {
	const value = valueFunction(item, void 0, data);
	return binarySearchCutoffIndex(data, (pivot, index) => valueFunction(pivot, index, data) < value);
}

//#endregion
//#region src/sortedIndexWith.ts
function sortedIndexWith(...args) {
	return purry(binarySearchCutoffIndex, args);
}

//#endregion
//#region src/sortedLastIndex.ts
function sortedLastIndex(...args) {
	return purry(sortedLastIndexImplementation, args);
}
const sortedLastIndexImplementation = (array, item) => binarySearchCutoffIndex(array, (pivot) => pivot <= item);

//#endregion
//#region src/sortedLastIndexBy.ts
function sortedLastIndexBy(...args) {
	return purry(sortedLastIndexByImplementation, args);
}
function sortedLastIndexByImplementation(array, item, valueFunction) {
	const value = valueFunction(item, void 0, array);
	return binarySearchCutoffIndex(array, (pivot, index) => valueFunction(pivot, index, array) <= value);
}

//#endregion
//#region src/splice.ts
function splice(...args) {
	return purry(spliceImplementation, args);
}
function spliceImplementation(items, start, deleteCount, replacement) {
	const result = [...items];
	result.splice(start, deleteCount, ...replacement);
	return result;
}

//#endregion
//#region src/split.ts
function split(dataOrSeparator, separatorOrLimit, limit) {
	return typeof separatorOrLimit === "number" || separatorOrLimit === void 0 ? (data) => data.split(dataOrSeparator, separatorOrLimit) : dataOrSeparator.split(separatorOrLimit, limit);
}

//#endregion
//#region src/splitAt.ts
function splitAt(...args) {
	return purry(splitAtImplementation, args);
}
function splitAtImplementation(array, index) {
	const effectiveIndex = Math.max(Math.min(index < 0 ? array.length + index : index, array.length), 0);
	return [array.slice(0, effectiveIndex), array.slice(effectiveIndex)];
}

//#endregion
//#region src/splitWhen.ts
function splitWhen(...args) {
	return purry(splitWhenImplementation, args);
}
function splitWhenImplementation(data, predicate) {
	const index = data.findIndex(predicate);
	return index === -1 ? [[...data], []] : [data.slice(0, index), data.slice(index)];
}

//#endregion
//#region src/startsWith.ts
function startsWith(...args) {
	return purry(startsWithImplementation, args);
}
const startsWithImplementation = (data, prefix) => data.startsWith(prefix);

//#endregion
//#region src/stringToPath.ts
const NON_NEGATIVE_INTEGER_RE = /^(?:0|[1-9][0-9]*)$/u;
/**
* A utility to allow JSONPath-like strings to be used in other utilities which
* take an array of path segments as input (e.g. `prop`, `setPath`, etc...).
* The main purpose of this utility is to act as a bridge between the runtime
* implementation that converts the path to an array, and the type-system that
* parses the path string **type** into an array **type**. This type allows us
* to return fine-grained types and to enforce correctness at the type-level.
*
* We **discourage** using this utility for new code. This utility is for legacy
* code that already contains path strings (which are accepted by Lodash). We
* strongly recommend using *path arrays* instead as they provide better
* developer experience via significantly faster type-checking, fine-grained
* error messages, and automatic typeahead suggestions for each segment of the
* path.
*
* *There are a bunch of limitations to this utility derived from the
* limitations of the type itself, these are usually edge-cases around deeply
* nested paths, escaping, whitespaces, and empty segments. This is true even
* in cases where the runtime implementation can better handle them, this is
* intentional. See the tests for this utility for more details and the
* expected outputs*.
*
* @param path - A string path.
* @signature
*   R.stringToPath(path)
* @example
*   R.stringToPath('a.b[0].c') // => ['a', 'b', 0, 'c']
* @dataFirst
* @category Utility
*/
function stringToPath(path) {
	const result = [];
	const pathSegmentRe = /\.{0,4096}(?<propName>[^.[\]]+)|\['(?<quoted>.{0,4096}?)'\]|\["(?<doubleQuoted>.{0,4096}?)"\]|\[(?<unquoted>.{0,4096}?)\]/uy;
	let match;
	while ((match = pathSegmentRe.exec(path)) !== null) {
		const { propName, quoted, doubleQuoted, unquoted } = match.groups;
		if (unquoted !== void 0) {
			result.push(...stringToPath(unquoted));
			continue;
		}
		result.push(propName === void 0 ? quoted ?? doubleQuoted : NON_NEGATIVE_INTEGER_RE.test(propName) ? Number(propName) : propName);
	}
	return result;
}

//#endregion
//#region src/subtract.ts
function subtract(...args) {
	return purry(subtractImplementation, args);
}
const subtractImplementation = (value, subtrahend) => value - subtrahend;

//#endregion
//#region src/sumBy.ts
function sumBy(...args) {
	return purry(sumByImplementation, args);
}
const sumByImplementation = (array, callbackfn) => {
	const iter = array.entries();
	const firstEntry = iter.next();
	if ("done" in firstEntry && firstEntry.done) return 0;
	const { value: [, firstValue] } = firstEntry;
	let sum$1 = callbackfn(firstValue, 0, array);
	for (const [index, item] of iter) {
		const summand = callbackfn(item, index, array);
		sum$1 += summand;
	}
	return sum$1;
};

//#endregion
//#region src/swapIndices.ts
function swapIndices(...args) {
	return purry(swapIndicesImplementation, args);
}
const swapIndicesImplementation = (data, index1, index2) => typeof data === "string" ? swapArray([...data], index1, index2).join("") : swapArray(data, index1, index2);
function swapArray(data, index1, index2) {
	const result = [...data];
	if (Number.isNaN(index1) || Number.isNaN(index2)) return result;
	const positiveIndexA = index1 < 0 ? data.length + index1 : index1;
	const positiveIndexB = index2 < 0 ? data.length + index2 : index2;
	if (positiveIndexA < 0 || positiveIndexA > data.length) return result;
	if (positiveIndexB < 0 || positiveIndexB > data.length) return result;
	result[positiveIndexA] = data[positiveIndexB];
	result[positiveIndexB] = data[positiveIndexA];
	return result;
}

//#endregion
//#region src/swapProps.ts
function swapProps(...args) {
	return purry(swapPropsImplementation, args);
}
function swapPropsImplementation(obj, key1, key2) {
	const { [key1]: value1, [key2]: value2 } = obj;
	return {
		...obj,
		[key1]: value2,
		[key2]: value1
	};
}

//#endregion
//#region src/take.ts
function take(...args) {
	return purry(takeImplementation, args, lazyImplementation$5);
}
const takeImplementation = (array, n) => n < 0 ? [] : array.slice(0, n);
function lazyImplementation$5(n) {
	if (n <= 0) return lazyEmptyEvaluator;
	let remaining = n;
	return (value) => {
		remaining -= 1;
		return {
			done: remaining <= 0,
			hasNext: true,
			next: value
		};
	};
}

//#endregion
//#region src/takeFirstBy.ts
function takeFirstBy(...args) {
	return purryOrderRulesWithArgument(takeFirstByImplementation, args);
}
function takeFirstByImplementation(data, compareFn, n) {
	if (n <= 0) return [];
	if (n >= data.length) return [...data];
	const heap = data.slice(0, n);
	heapify(heap, compareFn);
	const rest = data.slice(n);
	for (const item of rest) heapMaybeInsert(heap, compareFn, item);
	return heap;
}

//#endregion
//#region src/takeLast.ts
function takeLast(...args) {
	return purry(takeLastImplementation, args);
}
const takeLastImplementation = (array, n) => n > 0 ? array.slice(Math.max(0, array.length - n)) : [];

//#endregion
//#region src/takeLastWhile.ts
function takeLastWhile(...args) {
	return purry(takeLastWhileImplementation, args);
}
function takeLastWhileImplementation(data, predicate) {
	for (let i = data.length - 1; i >= 0; i--) if (!predicate(data[i], i, data)) return data.slice(i + 1);
	return [...data];
}

//#endregion
//#region src/takeWhile.ts
function takeWhile(...args) {
	return purry(takeWhileImplementation, args);
}
function takeWhileImplementation(data, predicate) {
	const ret = [];
	for (const [index, item] of data.entries()) {
		if (!predicate(item, index, data)) break;
		ret.push(item);
	}
	return ret;
}

//#endregion
//#region src/tap.ts
function tap(...args) {
	return purry(tapImplementation, args);
}
function tapImplementation(value, fn) {
	fn(value);
	return value;
}

//#endregion
//#region src/times.ts
function times(...args) {
	return purry(timesImplementation, args);
}
function timesImplementation(count, fn) {
	if (count < 1) return [];
	const length$1 = Number.isInteger(count) ? count : Math.floor(count);
	const res = new Array(length$1);
	for (let i = 0; i < length$1; i++) res[i] = fn(i);
	return res;
}

//#endregion
//#region src/internal/words.ts
const WORD_SEPARATORS = new Set([
	"-",
	"_",
	...[
		"	",
		"\n",
		"\v",
		"\f",
		"\r",
		" ",
		"",
		"\xA0",
		" ",
		" ",
		" ",
		" ",
		" ",
		" ",
		" ",
		" ",
		" ",
		" ",
		" ",
		" ",
		"\u2028",
		"\u2029",
		" ",
		" ",
		"　",
		"﻿"
	]
]);
const words = (data) => {
	const results = [];
	let word = "";
	const flush = () => {
		if (word.length > 0) {
			results.push(word);
			word = "";
		}
	};
	for (const character of data) {
		if (WORD_SEPARATORS.has(character)) {
			flush();
			continue;
		}
		if (/[a-z]$/u.test(word) && /[A-Z]/u.test(character)) flush();
		else if (/[A-Z][A-Z]$/u.test(word) && /[a-z]/u.test(character)) {
			const lastCharacter = word.slice(-1);
			word = word.slice(0, -1);
			flush();
			word = lastCharacter;
		} else if (/\d$/u.test(word) !== /\d/u.test(character)) flush();
		word += character;
	}
	flush();
	return results;
};

//#endregion
//#region src/toCamelCase.ts
const LOWER_CASE_CHARACTER_RE$1 = /[a-z]/u;
const DEFAULT_PRESERVE_CONSECUTIVE_UPPERCASE$1 = true;
function toCamelCase(dataOrOptions, options) {
	return typeof dataOrOptions === "string" ? toCamelCaseImplementation(dataOrOptions, options) : (data) => toCamelCaseImplementation(data, dataOrOptions);
}
const toCamelCaseImplementation = (data, { preserveConsecutiveUppercase = DEFAULT_PRESERVE_CONSECUTIVE_UPPERCASE$1 } = {}) => words(LOWER_CASE_CHARACTER_RE$1.test(data) ? data : data.toLowerCase()).map((word, index) => `${index === 0 ? word[0].toLowerCase() : word[0].toUpperCase()}${preserveConsecutiveUppercase ? word.slice(1) : word.slice(1).toLowerCase()}`).join("");

//#endregion
//#region src/toKebabCase.ts
function toKebabCase(...args) {
	return purry(toKebabCaseImplementation, args);
}
const toKebabCaseImplementation = (data) => words(data).join("-").toLowerCase();

//#endregion
//#region src/toLowerCase.ts
function toLowerCase(...args) {
	return purry(toLowerCaseImplementation, args);
}
const toLowerCaseImplementation = (data) => data.toLowerCase();

//#endregion
//#region src/toSnakeCase.ts
function toSnakeCase(...args) {
	return purry(toSnakeCaseImplementation, args);
}
const toSnakeCaseImplementation = (data) => words(data).join("_").toLowerCase();

//#endregion
//#region src/toTitleCase.ts
const LOWER_CASE_CHARACTER_RE = /[a-z]/u;
const DEFAULT_PRESERVE_CONSECUTIVE_UPPERCASE = true;
function toTitleCase(dataOrOptions, options) {
	return typeof dataOrOptions === "string" ? toTitleCaseImplementation(dataOrOptions, options) : (data) => toTitleCaseImplementation(data, dataOrOptions);
}
const toTitleCaseImplementation = (data, { preserveConsecutiveUppercase = DEFAULT_PRESERVE_CONSECUTIVE_UPPERCASE } = {}) => words(LOWER_CASE_CHARACTER_RE.test(data) ? data : data.toLowerCase()).map((word) => `${word[0].toUpperCase()}${preserveConsecutiveUppercase ? word.slice(1) : word.slice(1).toLowerCase()}`).join(" ");

//#endregion
//#region src/toUpperCase.ts
function toUpperCase(...args) {
	return purry(toUpperCaseImplementation, args);
}
const toUpperCaseImplementation = (data) => data.toUpperCase();

//#endregion
//#region src/truncate.ts
const DEFAULT_OMISSION = "...";
function truncate(dataOrN, nOrOptions, options) {
	return typeof dataOrN === "string" ? truncateImplementation(dataOrN, nOrOptions, options) : (data) => truncateImplementation(data, dataOrN, nOrOptions);
}
function truncateImplementation(data, n, { omission = DEFAULT_OMISSION, separator } = {}) {
	if (data.length <= n) return data;
	if (n <= 0) return "";
	if (n < omission.length) return omission.slice(0, n);
	let cutoff = n - omission.length;
	if (typeof separator === "string") {
		const lastSeparator = data.lastIndexOf(separator, cutoff);
		if (lastSeparator !== -1) cutoff = lastSeparator;
	} else if (separator !== void 0) {
		const globalSeparator = separator.flags.includes("g") ? separator : new RegExp(separator.source, `${separator.flags}g`);
		let lastSeparator;
		for (const { index } of data.matchAll(globalSeparator)) {
			if (index > cutoff) break;
			lastSeparator = index;
		}
		if (lastSeparator !== void 0) cutoff = lastSeparator;
	}
	return `${data.slice(0, cutoff)}${omission}`;
}

//#endregion
//#region src/uncapitalize.ts
function uncapitalize(...args) {
	return purry(uncapitalizeImplementation, args);
}
const uncapitalizeImplementation = (data) => `${data[0]?.toLowerCase() ?? ""}${data.slice(1)}`;

//#endregion
//#region src/unique.ts
function unique(...args) {
	return purryFromLazy(lazyImplementation$4, args);
}
function lazyImplementation$4() {
	const set$1 = /* @__PURE__ */ new Set();
	return (value) => {
		if (set$1.has(value)) return SKIP_ITEM;
		set$1.add(value);
		return {
			done: false,
			hasNext: true,
			next: value
		};
	};
}

//#endregion
//#region src/uniqueBy.ts
function uniqueBy(...args) {
	return purryFromLazy(lazyImplementation$3, args);
}
function lazyImplementation$3(keyFunction) {
	const brandedKeyFunction = keyFunction;
	const set$1 = /* @__PURE__ */ new Set();
	return (value, index, data) => {
		const key = brandedKeyFunction(value, index, data);
		if (set$1.has(key)) return SKIP_ITEM;
		set$1.add(key);
		return {
			done: false,
			hasNext: true,
			next: value
		};
	};
}

//#endregion
//#region src/uniqueWith.ts
function uniqueWith(...args) {
	return purryFromLazy(lazyImplementation$2, args);
}
const lazyImplementation$2 = (isEquals) => (value, index, data) => {
	return data.findIndex((otherValue, otherIndex) => index === otherIndex || isEquals(value, otherValue)) === index ? {
		done: false,
		hasNext: true,
		next: value
	} : SKIP_ITEM;
};

//#endregion
//#region src/values.ts
function values(...args) {
	return purry(Object.values, args);
}

//#endregion
//#region src/when.ts
function when(...args) {
	return args.length === 2 ? (data, ...extraArgs) => whenImplementation(data, ...args, ...extraArgs) : whenImplementation(...args);
}
const whenImplementation = (data, predicate, onTrueOrBranches, ...extraArgs) => predicate(data, ...extraArgs) ? typeof onTrueOrBranches === "function" ? onTrueOrBranches(data, ...extraArgs) : onTrueOrBranches.onTrue(data, ...extraArgs) : typeof onTrueOrBranches === "function" ? data : onTrueOrBranches.onFalse(data, ...extraArgs);

//#endregion
//#region src/zip.ts
function zip(...args) {
	return purry(zipImplementation, args, lazyImplementation$1);
}
const zipImplementation = (first$1, second) => first$1.length < second.length ? first$1.map((item, index) => [item, second[index]]) : second.map((item, index) => [first$1[index], item]);
const lazyImplementation$1 = (second) => (value, index) => ({
	hasNext: true,
	next: [value, second[index]],
	done: index >= second.length - 1
});

//#endregion
//#region src/zipWith.ts
function zipWith(arg0, arg1, arg2) {
	if (typeof arg0 === "function") return (data1, data2) => zipWithImplementation(data1, data2, arg0);
	if (typeof arg1 === "function") return lazyDataLastImpl(zipWithImplementation, [arg0, arg1], lazyImplementation);
	return zipWithImplementation(arg0, arg1, arg2);
}
function zipWithImplementation(first$1, second, fn) {
	const datum = [first$1, second];
	return first$1.length < second.length ? first$1.map((item, index) => fn(item, second[index], index, datum)) : second.map((item, index) => fn(first$1[index], item, index, datum));
}
const lazyImplementation = (second, fn) => (value, index, data) => ({
	next: fn(value, second[index], index, [data, second]),
	hasNext: true,
	done: index >= second.length - 1
});

//#endregion
exports.add = add;
exports.addProp = addProp;
exports.allPass = allPass;
exports.anyPass = anyPass;
exports.capitalize = capitalize;
exports.ceil = ceil;
exports.chunk = chunk;
exports.clamp = clamp;
exports.clone = clone;
exports.concat = concat;
exports.conditional = conditional;
exports.constant = constant;
exports.countBy = countBy;
exports.debounce = debounce;
exports.defaultTo = defaultTo;
exports.difference = difference;
exports.differenceWith = differenceWith;
exports.divide = divide;
exports.doNothing = doNothing;
exports.drop = drop;
exports.dropFirstBy = dropFirstBy;
exports.dropLast = dropLast;
exports.dropLastWhile = dropLastWhile;
exports.dropWhile = dropWhile;
exports.endsWith = endsWith;
exports.entries = entries;
exports.evolve = evolve;
exports.filter = filter;
exports.find = find;
exports.findIndex = findIndex;
exports.findLast = findLast;
exports.findLastIndex = findLastIndex;
exports.first = first;
exports.firstBy = firstBy;
exports.flat = flat;
exports.flatMap = flatMap;
exports.floor = floor;
exports.forEach = forEach;
exports.forEachObj = forEachObj;
exports.fromEntries = fromEntries;
exports.fromKeys = fromKeys;
exports.funnel = funnel;
exports.groupBy = groupBy;
exports.groupByProp = groupByProp;
exports.hasAtLeast = hasAtLeast;
exports.hasSubObject = hasSubObject;
exports.identity = identity;
exports.indexBy = indexBy;
exports.intersection = intersection;
exports.intersectionWith = intersectionWith;
exports.invert = invert;
exports.isArray = isArray;
exports.isBigInt = isBigInt;
exports.isBoolean = isBoolean;
exports.isDate = isDate;
exports.isDeepEqual = isDeepEqual;
exports.isDefined = isDefined;
exports.isEmpty = isEmpty;
exports.isEmptyish = isEmptyish;
exports.isError = isError;
exports.isFunction = isFunction;
exports.isIncludedIn = isIncludedIn;
exports.isNonNull = isNonNull;
exports.isNonNullish = isNonNullish;
exports.isNot = isNot;
exports.isNullish = isNullish;
exports.isNumber = isNumber;
exports.isObjectType = isObjectType;
exports.isPlainObject = isPlainObject;
exports.isPromise = isPromise;
exports.isShallowEqual = isShallowEqual;
exports.isStrictEqual = isStrictEqual;
exports.isString = isString;
exports.isSymbol = isSymbol;
exports.isTruthy = isTruthy;
exports.join = join;
exports.keys = keys;
exports.last = last;
exports.length = length;
exports.map = map;
exports.mapKeys = mapKeys;
exports.mapToObj = mapToObj;
exports.mapValues = mapValues;
exports.mapWithFeedback = mapWithFeedback;
exports.mean = mean;
exports.meanBy = meanBy;
exports.median = median;
exports.merge = merge;
exports.mergeAll = mergeAll;
exports.mergeDeep = mergeDeep;
exports.multiply = multiply;
exports.nthBy = nthBy;
exports.objOf = objOf;
exports.omit = omit;
exports.omitBy = omitBy;
exports.once = once;
exports.only = only;
exports.partialBind = partialBind;
exports.partialLastBind = partialLastBind;
exports.partition = partition;
exports.pathOr = pathOr;
exports.pick = pick;
exports.pickBy = pickBy;
exports.pipe = pipe;
exports.piped = piped;
exports.product = product;
exports.prop = prop;
exports.pullObject = pullObject;
exports.purry = purry;
exports.randomBigInt = randomBigInt;
exports.randomInteger = randomInteger;
exports.randomString = randomString;
exports.range = range;
exports.rankBy = rankBy;
exports.reduce = reduce;
exports.reverse = reverse;
exports.round = round;
exports.sample = sample;
exports.set = set;
exports.setPath = setPath;
exports.shuffle = shuffle;
exports.sliceString = sliceString;
exports.sort = sort;
exports.sortBy = sortBy;
exports.sortedIndex = sortedIndex;
exports.sortedIndexBy = sortedIndexBy;
exports.sortedIndexWith = sortedIndexWith;
exports.sortedLastIndex = sortedLastIndex;
exports.sortedLastIndexBy = sortedLastIndexBy;
exports.splice = splice;
exports.split = split;
exports.splitAt = splitAt;
exports.splitWhen = splitWhen;
exports.startsWith = startsWith;
exports.stringToPath = stringToPath;
exports.subtract = subtract;
exports.sum = sum;
exports.sumBy = sumBy;
exports.swapIndices = swapIndices;
exports.swapProps = swapProps;
exports.take = take;
exports.takeFirstBy = takeFirstBy;
exports.takeLast = takeLast;
exports.takeLastWhile = takeLastWhile;
exports.takeWhile = takeWhile;
exports.tap = tap;
exports.times = times;
exports.toCamelCase = toCamelCase;
exports.toKebabCase = toKebabCase;
exports.toLowerCase = toLowerCase;
exports.toSnakeCase = toSnakeCase;
exports.toTitleCase = toTitleCase;
exports.toUpperCase = toUpperCase;
exports.truncate = truncate;
exports.uncapitalize = uncapitalize;
exports.unique = unique;
exports.uniqueBy = uniqueBy;
exports.uniqueWith = uniqueWith;
exports.values = values;
exports.when = when;
exports.zip = zip;
exports.zipWith = zipWith;