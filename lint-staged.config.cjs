module.exports = {
	"*.{js,ts,cjs,mjs,json}": [
		() => "pnpm run format-and-lint:fix",
		() => "pnpm run check",
	],
};
