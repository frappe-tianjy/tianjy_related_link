const oldSetVueGlobals = window.SetVueGlobals;

window.SetVueGlobals = function(app) {
	const DataControl = app.component('DataControl');
	if (DataControl) {
		app.component('TianjyRelatedLinkControl', DataControl);
	}
	const TableMultiSelectControl = app.component('TableMultiSelectControl');
	if (TableMultiSelectControl) {
		app.component('TianjyTableRelatedMultiSelectControl', TableMultiSelectControl);
	}
	return oldSetVueGlobals.apply(this, arguments);
};
