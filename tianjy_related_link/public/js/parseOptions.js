// @ts-check
const eqRegex = /^([^\n~!@#$%^&*()<>?+{}[\]|\\:;"',=]+)([%]|#[^:=#\n]+#)?(\$?)(:|=)(.*)$/;

/** @param {string} t */
function parseOp(t) {
	if (!t) { return '='; }
	const op = t[0] === '#' ? t.slice(1, -1) : t;
	if (op === '%') { return 'Like'; }
	return op;

}
/**
 * @typedef {object} FilterValue
 * @property {string} key
 * @property {string} op
 * @property {boolean} required
 * @property {string} [value]
 * @property {string} [field]
 */
/**
 * @typedef {object} Options
 * @property {string} doctype
 * @property {FilterValue[]} filters
 */
/**
 *
 * @param {string} options
 * @returns {Options?}
 */
export default function parseOptions(options) {
	if (!options || typeof options !== 'string') { return null; }
	const list = options.split('\n').filter(Boolean);
	const doctype = list.shift();
	if (!doctype) { return null; }
	/** @type {FilterValue[]} */
	const filters = [];
	for (const line of list) {
		const s = eqRegex.exec(line);
		if (!s) { continue; }
		const key = s[1].trim();
		const op = parseOp(s[2]);
		const required = Boolean(s[3]);
		const isField = s[4] === ':';
		const value = s[5].trim();
		if (isField) {
			if (!value) { continue; }
			filters.push({ key, op, required, field: value });
			continue;
		}
		filters.push({ key, op, required, value });
	}
	return { doctype, filters };

}
