BUILD = build

.PHONY: generate
generate: src/* assets/* package.json node_modules/
	npm run build
	@echo 'Generated Blocks site into: ${BUILD}/'

node_modules/: package.json
	npm i --only=prod

.PHONY: clean
clean:
	rm -rf ${BUILD}/ node_modules/
