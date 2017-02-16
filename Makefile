
.PHONY: check
check:
	pep8 vcapp

.PHONY: test
test:
	python setup.py test
