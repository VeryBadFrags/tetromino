DIST = dist

.PHONY: generate
generate: src/* assets/* package.json node_modules/
	npm run build
	@echo 'Generated Blocks site into: ${DIST}/'

node_modules/:
	npm ci --only=prod --no-optional

.PHONY: clean
clean:
	rm -rf ${DIST}/
