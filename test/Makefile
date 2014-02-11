
build: components index.css
	@component build --dev

clean:
	@rm -rf components build

components: component.json
	@component install --dev

test: build
	@logo test

.PHONY: clean test
