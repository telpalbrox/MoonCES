SRC = $(shell find src -name "*.js" -type f)
TEST_TIMEOUT = 2000
TEST_REPORTER = spec

dist/ces-browser.js: $(SRC)
	node_modules/typescript/bin/tsc src/*.ts --module commonjs --outFile dist/ces-browser.js --declaration
	node_modules/uglify-js/bin/uglifyjs dist/ces-browser.js > dist/ces-browser.min.js

test:
	rm -rf js/
	node_modules/typescript/bin/tsc src/*.ts test/*.ts --module commonjs --outFile js/test.js
	@NODE_ENV=test \
		./node_modules/.bin/mocha js/test \
		    --ui bdd \
			--require chai \
			--timeout $(TEST_TIMEOUT) \
			--reporter $(TEST_REPORTER) \
			--bail

clean:
	rm -f dist/*.js
	rm -rf js/

.PHONY: test clean
