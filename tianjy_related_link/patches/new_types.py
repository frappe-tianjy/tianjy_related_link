import frappe
import frappe.model
import frappe.model.create_new
import frappe.model.meta
import frappe.core.report.permitted_documents_for_user.permitted_documents_for_user
import frappe.desk.form.load
from frappe.database.mariadb.database import MariaDBDatabase




import frappe.utils.formatters
import frappe

from frappe.utils import formatdate

# 增加自定义类型
data_fieldtypes = ("Tianjy Related Link",)
frappe.model.create_new.data_fieldtypes += data_fieldtypes
frappe.model.meta.data_fieldtypes += data_fieldtypes
frappe.core.report.permitted_documents_for_user.permitted_documents_for_user.data_fieldtypes += data_fieldtypes
frappe.model.data_fieldtypes += data_fieldtypes

# apps/frappe/frappe/desk/link_preview.py
# apps/frappe/frappe/model/__init__.py
# apps/frappe/frappe/model/meta.py
# apps/frappe/frappe/model/utils/rename_field.py
# no_value_fields = ("Tianjy Table Related MultiSelect", )

# table_fields



# 增加新类型映射的数据库类型
old_setup_type_map = MariaDBDatabase.setup_type_map
def setup_type_map(self):
	self.db_type = "mariadb"
	old_setup_type_map(self)
	self.type_map.update({
		"Tianjy Related Link": ("varchar", self.VARCHAR_LEN),
	})
MariaDBDatabase.setup_type_map = setup_type_map
if hasattr(frappe.local, "db") and frappe.local.db.db_type == "mariadb":
	setup_type_map(frappe.local.db)



# 返回标签名
old_get_title_values_for_link_and_dynamic_link_fields = frappe.desk.form.load.get_title_values_for_link_and_dynamic_link_fields
def get_title_values_for_link_and_dynamic_link_fields(doc, link_fields=None):
	link_titles = old_get_title_values_for_link_and_dynamic_link_fields(doc, link_fields)
	if not link_fields:
		meta = frappe.get_meta(doc.doctype)
		link_fields = meta.get("fields", {"fieldtype": "Tianjy Related Link"})

	for field in link_fields:
		if not doc.get(field.fieldname):
			continue
		if field.fieldtype != "Tianjy Related Link":
			continue

		doctype = field.options.split('\n')[0]

		meta = frappe.get_meta(doctype)
		if not meta or not (meta.title_field and meta.show_title_field_in_link):
			continue

		link_title = frappe.db.get_value(
			doctype, doc.get(field.fieldname), meta.title_field, cache=True, order_by=None
		)
		link_titles.update({doctype + "::" + doc.get(field.fieldname): link_title})

	return link_titles

frappe.desk.form.load.get_title_values_for_link_and_dynamic_link_fields = get_title_values_for_link_and_dynamic_link_fields
