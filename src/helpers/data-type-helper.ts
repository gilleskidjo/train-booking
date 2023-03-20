export function boolVal(val: unknown, options: { varName?: string } = {}): boolean {
	if (typeof val === "boolean") return val;
	if (val === 0 || val === "0" || val === "f" || val === "false") return false;
	if (val === 1 || val === "1" || val === "t" || val === "true") return true;
	if (val === undefined || val === null)
		throw new Error(`Missing boolean value for '${options.varName}'`);
	return !!val;
}

export function boolValOrUndef(
	val: unknown,
	options: { varName?: string } = {},
): boolean | undefined {
	return val === undefined || val === null ? undefined : boolVal(val, options);
}

export function strVal(
	val: unknown,
	options: { allowEmpty?: boolean; varName?: string } = {},
): string {
	if (val === undefined || val === null || (val === "" && !options.allowEmpty))
		throw new Error(`Missing string value for '${options.varName}'`);
	if (typeof val === "string") return val;
	return (val as object).toString();
}

export function strValOrUndef(
	val: unknown,
	options: { allowEmpty?: boolean; varName?: string } = {},
): string | undefined {
	return val === undefined || val === null || (val === "" && !options.allowEmpty)
		? undefined
		: strVal(val, options);
}

export function strValOrNull(
	val: unknown,
	options: { allowEmpty?: boolean; varName?: string } = {},
): string | null {
	return val === undefined || val === null || (val === "" && !options.allowEmpty)
		? null
		: strVal(val, options);
}

export function numberVal(val: unknown, options: { varName?: string } = {}): number {
	if (typeof val === "number") return val;
	if (val === undefined || val === null)
		throw new Error(`Missing number value for '${options.varName}'`);
	if (typeof val === "string" && isNumeric(val)) return Number(val);
	throw new Error(
		`Cannot convert to number the value of type '${typeof val}' for '${options.varName}'`,
	);
}

export function numberValOrUndef(val: unknown, options: { varName?: string } = {}): number | undefined {
	return val === undefined || val === null ? undefined : numberVal(val, options);
}

export function numberValOrNull(val: unknown, options: { varName?: string } = {}): number | null {
	return val === undefined || val === null ? null : numberVal(val, options);
}

export function dateVal(val: unknown, options: { varName?: string } = {}): Date {
	if (val instanceof Date) return val;
	if (val === undefined || val === null || val === "")
		throw new Error(`Missing number value for '${options.varName}'`);
	if (typeof val === "string") return new Date(val);
	if (typeof val === "number") return new Date(val);
	throw new Error(
		`Cannot convert to date the value of type '${typeof val}' for '${options.varName}'`,
	);
}

function to2Digits(val: any): string {
	return val.toString().padStart(2, "0")
}

export function dateToStr(val: unknown): string {
	const date = dateVal(val);
	const month = to2Digits(date.getMonth() + 1);
	const day = to2Digits(date.getDate());
	
	return `${date.getFullYear()}-${month}-${day}`
}

export function dateToStrOrNull(val: unknown): string | null {
	if (val === undefined || val === null || val === "") return null;

	return dateToStr(val)
}

export function dateValOrUndef(val: unknown, options: { varName?: string } = {}): Date | undefined {
	return val === undefined || val === null || val === "" ? undefined : dateVal(val, options);
}

export function listVal<T>(
	val: unknown,
	valueFormater: (val: unknown) => T,
	options: { varName?: string } = {},
): T[] {
	if (!Array.isArray(val))
		throw new Error(`Invalid array '${typeof val}' for '${options.varName}'`);
	return val.map(valueFormater);
}

export function listValOrUndef<T>(
	val: unknown,
	valueFormater: (val: unknown) => T,
	options: { varName?: string } = {},
): T[] | undefined {
	return val === undefined || val === null ? undefined : listVal(val, valueFormater, options);
}

/**
 * @see https://stackoverflow.com/a/175787/3786294
 */
function isNumeric(str: string): boolean {
	return (
		// use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
		!isNaN(str as any as number) && !isNaN(parseFloat(str))
	); // ...and ensure strings of whitespace fail
}
