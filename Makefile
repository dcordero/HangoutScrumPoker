
# PATHS
TOPDIR?=$(shell pwd)
BUILDDIR=$(TOPDIR)/build

SOURCES+=
SOURCES+=index.html
SOURCES+=app.yaml

DIRS+=css
DIRS+=icons
DIRS+=js
DIRS+=images

css:
icons:
images:

# RULES
build: clean
	@echo "+++ Building up...";
	test -d $(BUILDDIR) || mkdir $(BUILDDIR);
	for subdir in $(DIRS); do \
	  	make -C $$subdir; \
	done
	for src in $(SOURCES); do \
		cp $$src ${BUILDDIR}; \
	done
	@echo "+++ Built";

deploy:
	@echo "+++ Deployment launched...";
	appcfg.py update $(BUILDDIR)/;
	@echo "+++ Deployed";

deploy_dev:
	@echo "+++ Deployment of dev environment launched..."
	appcfg.py update .
	@echo "+++ Dev environment deployed"

clean:
	@echo "+++ Cleaning...";
	@rm -rf $(BUILDDIR);
	@echo "+++ Cleaned";
