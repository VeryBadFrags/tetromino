ASSETS = assets
SRC = src

BUILD = build
DIST = dist

NODE_DEPS = package.json node_modules/

.PHONY: generate
generate: ${DIST}/index.html ${DIST}/style.css ${DIST}/main.js
	@echo 'Generated site into: ${DIST}/'

${DIST}/index.html: ${BUILD}/index.html ${DIST}
	cp ${BUILD}/index.html ${DIST}/

${DIST}/main.js: ${SRC}/*.js ${DIST}
	cp ${SRC}/*.js ${DIST}

${DIST}/style.css: ${SRC}/*.scss ${NODE_DEPS}
	npm run sass

# Inject favicons into ${BUILD}/index.html
${BUILD}/index.html: ${SRC}/index.html ${BUILD}/faviconData.json ${NODE_DEPS}
	npm run favicon-inject

# Generate favicons
${BUILD}/faviconData.json: ${ASSETS}/brick-wall.svg faviconDescription.json ${BUILD} ${NODE_DEPS}
	npm run favicon-generate

${BUILD}:
	mkdir -p ${BUILD}

${DIST}:
	mkdir -p ${DIST}

node_modules/:
	npm install

.PHONY: clean
clean:
	rm -rf ${BUILD}/ ${DIST}/ ${SRC}/*.css ${SRC}/*.css.map
