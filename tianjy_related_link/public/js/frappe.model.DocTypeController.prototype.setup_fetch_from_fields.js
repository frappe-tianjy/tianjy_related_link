frappe.model.DocTypeController.prototype.setup_fetch_from_fields = function setup_fetch_from_fields(doc, doctype, docname) {
	let {frm} = this;
	// Render two select fields for Fetch From instead of Small Text for better UX
	let field = frm.cur_grid.grid_form.fields_dict.fetch_from;
	$(field.input_area).hide();

	let $doctype_select = $(`<select class="form-control">`);
	let $field_select = $(`<select class="form-control">`);
	let $wrapper = $('<div class="fetch-from-select row"><div>');
	$wrapper.append($doctype_select, $field_select);
	field.$input_wrapper.append($wrapper);
	$doctype_select.wrap('<div class="col"></div>');
	$field_select.wrap('<div class="col"></div>');

	let row = frappe.get_doc(doctype, docname);
	let curr_value = { doctype: null, fieldname: null };
	if (row.fetch_from) {
		let [doctype, fieldname] = row.fetch_from.split('.');
		curr_value.doctype = doctype;
		curr_value.fieldname = fieldname;
	}

	let doctypes = frm.doc.fields
		.filter(df => df.fieldtype == 'Link' || df.fieldtype === 'Tianjy Related Link')
		.filter(df => df.options && df.fieldname != row.fieldname)
		.map(df => ({fieldname: df.fieldname, options: df.options.split('\n')[0]}))
		.filter(df => df.options)
		.sort((a, b) => a.options.localeCompare(b.options))
		.map(df => ({
			label: `${df.options} (${df.fieldname})`,
			value: df.fieldname,
		}));
	$doctype_select.add_options([
		{ label: __('Select DocType'), value: '', selected: true },
		...doctypes,
	]);

	$doctype_select.on('change', () => {
		row.fetch_from = '';
		frm.dirty();
		update_fieldname_options();
	});

	function update_fieldname_options() {
		$field_select.find('option').remove();

		let link_fieldname = $doctype_select.val();
		if (!link_fieldname) { return; }
		let link_field = frm.doc.fields.find(df => df.fieldname === link_fieldname);
		let link_doctype = link_field.options.split('\n')[0];
		frappe.model.with_doctype(link_doctype, () => {
			let fields = frappe.meta
				.get_docfields(link_doctype, null, {
					fieldtype: ['not in', frappe.model.no_value_type],
				})
				.map(a =>({
					label: a.label || a.fieldname || '',
					fieldname: a.fieldname,
					fieldtype: a.fieldtype,
				}))
				.sort((a, b) => a.label.localeCompare(b.label))
				.map(df => ({
					label: `${df.label} (${df.fieldtype})`,
					value: df.fieldname,
				}));
			$field_select.add_options([
				{
					label: __('Select Field'),
					value: '',
					selected: true,
					disabled: true,
				},
				...fields,
			]);

			if (curr_value.fieldname) {
				$field_select.val(curr_value.fieldname);
			}
		});
	}

	$field_select.on('change', () => {
		let fetch_from = `${$doctype_select.val()}.${$field_select.val()}`;
		row.fetch_from = fetch_from;
		frm.dirty();
	});

	if (curr_value.doctype) {
		$doctype_select.val(curr_value.doctype);
		update_fieldname_options();
	}
};
