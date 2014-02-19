
# PATHS
TOPDIR?=$(shell pwd)/..
BUILDDIR=$(TOPDIR)/build
SCRIPTSDIR=$(TOPDIR)/scripts

SOURCES+=scrumpoker.js

# RULES
build: clean
	test -d $(BUILDDIR)/js || mkdir $(BUILDDIR)/js;
	for src in $(SOURCES); do \
		make $$src; \
	done

%.js:
	@echo produce $$@ from $$^ using $$*

clean:
	@rm -rf $(BUILDDIR)/js;

.PHONY: scrumpoker.js
