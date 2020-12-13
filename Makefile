src = src
assets = assets
build = build
dist = dist
node = package.json node_modules/

.PHONY: generate
generate: ${dist}/index.html ${dist}/style.css ${dist}/main.js
	@echo 'Generated site into: ${dist}/'

${dist}/index.html: ${build}/index.html ${dist}
	cp ${build}/index.html ${dist}/

${dist}/main.js: ${src}/*.js ${dist}
	cp ${src}/*.js ${dist}

${dist}/style.css: ${src}/*.scss ${node}
	npm run sass

# Inject favicons into ${build}/index.html
${build}/index.html: ${src}/index.html ${build}/faviconData.json ${node}
	npm run favicon-inject

# Generate favicons
${build}/faviconData.json: ${assets}/brick-wall.svg faviconDescription.json ${build} ${node}
	npm run favicon-generate

${build}:
	mkdir -p ${build}

${dist}:
	mkdir -p ${dist}

.PHONY: clean
clean:
	rm -rf ${build}/ ${dist}/
