install:
	npm install

dev:
	npx webpack-dev-server

build:
	rm -rf dist
	NODE_ENV=production npx webpack

lint:
	npx eslint .

publish:
	npm publish
