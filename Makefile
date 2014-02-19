
# PATHS
TOPDIR?=$(shell pwd)
BUILDDIR=$(TOPDIR)/build
SCRIPTSDIR=$(TOPDIR)/scripts

SOURCES+=scrumpoker.xml
SOURCES+=index.html
SOURCES+=app.yaml

DIRS+=css
DIRS+=icons
DIRS+=js
DIRS+=images

# RULES
clean:
	@echo "+++ Cleaning...";
	@rm -rf $(BUILDDIR);
	@echo "+++ Cleaned";
	
build: clean
	@echo "+++ Building up...";
	test -d $(BUILDDIR) || mkdir $(BUILDDIR);
	for subdir in $(DIRS); do \
	  	cp -r $$subdir ${BUILDDIR}; \
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
