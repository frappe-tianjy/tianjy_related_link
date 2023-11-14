// @ts-check

import create from './create';
frappe.ui.form.ControlTianjyRelatedLink = create(frappe.ui.form.ControlLink);
frappe.ui.form.ControlTianjyTableRelatedMultiSelect = class extends create(frappe.ui.form.ControlTableMultiSelect) {

	get_link_field() {
		if (!this._link_field) {
			const meta = frappe.get_meta(this.df.options);
			this._link_field = meta.fields.find(df => df.fieldtype === 'Tianjy Related Link');
			if (!this._link_field) {
				throw new Error('Table MultiSelect requires a Table with atleast one Link field');
			}
		}
		return this._link_field;
	}
};
