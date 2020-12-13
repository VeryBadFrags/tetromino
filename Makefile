.PHONY: generate
generate: dist/index.html dist/style.css dist/main.js
	@echo 'Generated site into: dist/'

dist/index.html: build/index.html dist/
	cp build/index.html dist/

dist/style.css: src/*.scss
	npm run sass

dist/main.js: src/*.js dist/
	cp src/*.js dist/

# Inject favicons into build/index.html
build/index.html: node_modules/ src/index.html package.json build/faviconData.json
	npm run favicon-inject

# Generate favicons
build/faviconData.json: assets/brick-wall.svg faviconDescription.json node_modules/ package.json build/
	npm run favicon-generate

build/:
	mkdir -p build

dist/:
	mkdir -p dist

.PHONY: clean
clean:
	rm -rf build/ dist/
