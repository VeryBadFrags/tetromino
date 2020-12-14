ASSETS = assets
SRC = src

BUILD = build
DIST = dist

NODE_DEPS = package.json node_modules/

.PHONY: generate
generate: ${DIST}/index.html ${DIST}/style.css ${DIST}/main.js
	@echo 'Generated site into: ${DIST}/'

# Minify HTML
${DIST}/index.html: ${BUILD}/index.html ${NODE_DEPS}
	npm run html-minifier

# Inject favicons into ${BUILD}/index.html
${BUILD}/index.html: ${SRC}/index.html ${BUILD}/faviconData.json ${NODE_DEPS}
	npm run favicon-inject

# Compile Typescript
${DIST}/main.js: ${SRC}/*.ts
	npm run typescript

# Compile SASS
${DIST}/style.css: ${SRC}/*.scss ${NODE_DEPS}
	npm run sass

# Generate favicons
${BUILD}/faviconData.json: ${ASSETS}/four-squares-line.svg faviconDescription.json ${BUILD} ${NODE_DEPS}
	npm run favicon-generate

${BUILD}:
	mkdir -p ${BUILD}

${DIST}:
	mkdir -p ${DIST}

node_modules/:
	npm install

.PHONY: clean
clean:
	rm -rf ${BUILD}/ ${DIST}/
