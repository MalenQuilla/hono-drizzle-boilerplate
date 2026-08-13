import { $auth } from "$libs/auth";

export default async () => {
	const rawAuthDoc = await $auth().api.generateOpenAPISchema();

	const paths: typeof rawAuthDoc.paths = {};

	for (const key in rawAuthDoc.paths) {
		paths[`/api/auth${key}`] = rawAuthDoc.paths[key];
	}

	const pathConvertedDocs = { ...rawAuthDoc, paths };

	const docAsString = JSON.stringify(pathConvertedDocs).replace(
		/"Default"/g,
		'"Auth"',
	);
	return JSON.parse(docAsString);
};
