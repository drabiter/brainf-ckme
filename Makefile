CS=node_modules/coffee-script/bin/coffee
ISTANBUL=node_modules/istanbul/lib/cli.js
MOCHA=node_modules/mocha/bin/mocha
_MOCHA=node_modules/mocha/bin/_mocha
COVERALLS=node_modules/coveralls/bin/coveralls.js

build:
	@$(CS) -c lib/ test/

test.coverage: build
	@$(ISTANBUL) cover $(_MOCHA) -- --reporter spec --recursive test/*.js \
		&& cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js \
		&& rm -rf ./coverage
