from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in tianjy_related_link/__init__.py
version = '0.0.1'

setup(
	name="tianjy_related_link",
	version=version,
	description="Tianjy Related Link",
	author="Tianjy",
	author_email="Tianjy",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
