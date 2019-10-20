install:
	npm install

dev:
	npm run dev

build:
	rm -rf dist
	npm run build

lint:
	npx eslint .

publish:
	npm publish
