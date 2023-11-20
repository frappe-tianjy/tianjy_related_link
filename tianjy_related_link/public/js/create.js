// @ts-check

import { parse as parseOptions, getFilters } from './filter';

/**
 *
 * @param {typeof frappe.ui.form.ControlLink} Class
 * @returns
 */
export default function create(Class) {
	return class ControlTianjyRelatedLink extends Class {
		/** @type {string} */
		__oldOptions = '';
		/** @type {import('./filter').Options?} */
		__parsedOptions = null;
		/** @return {import('./filter').Options?} */
		getParsedOptions() {
			let options = super.get_options();
			if (!options || typeof options !== 'string') { return null; }
			if (options === this.__oldOptions) { return this.__parsedOptions; }
			const __parsedOptions = parseOptions(options);
			this.__parsedOptions = __parsedOptions;
			this.__oldOptions = options;
			return __parsedOptions;
		}
		get_options() {
			return this.getParsedOptions()?.doctype || '';
		}
		/**
		 * @param {string} field
		 */
		getFieldValue(field) {
			if (this.frm) {
				return frappe.model.get_value(this.df.parent, this.docname, field);
			}
			if (this.docname == null && cur_dialog) {
				return cur_dialog.get_value(field);
			} else if (cur_frm) {
				return frappe.model.get_value(this.df.parent, this.docname, field);
			}
			const selector = `input[data-fieldname="${field}"]`;
			let input = null;
			if (cur_list) {
				input = cur_list.filter_area.standard_filters_wrapper.find(selector);
			}
			if (cur_page) {
				input = $(cur_page.page).find(selector);
			}
			if (input) { return input.val(); }
		}
		set_custom_query(args) {
			const filters = getFilters(f=> this.getFieldValue(f), this.getParsedOptions()?.filters);
			if (!filters?.length) { return; }
			args.filters = filters;
		}
	};


}
