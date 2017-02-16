
.PHONY: check
check:
	pep8 vcapp

.PHONY: test
test:
	python setup.py test

.PHONY: run
run:
	flask initdb # TODO: don't want to do this in production, as database will be non-empty
	flask run
