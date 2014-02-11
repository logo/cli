
build: components index.css
	@component build --dev --prefix . # hack for relative urls in builder bug

clean:
	@rm -rf build components

components: component.json
	@component install --dev

.PHONY: clean