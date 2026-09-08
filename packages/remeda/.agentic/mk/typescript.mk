PM ?= npm
.PHONY: lint-ts test-ts format-ts audit-ts
lint-ts:
	npx eslint . && npx prettier --check . && npx tsc --noEmit -p tsconfig.json
	npx --no-install knip || echo "knip not installed (npm i -D knip)"
audit-ts:
	$(PM) audit --audit-level=high --omit=dev
test-ts:
	npx vitest run
format-ts:
	npx prettier --write . && npx eslint . --fix
