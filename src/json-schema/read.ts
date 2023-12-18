import { readFile } from "fs/promises"
import { translatePrismaToTypescript } from "../utils/translate-prisma-ts"
import { PrismaModel } from "./types"

async function readJsonFile(path: string) {
	const jsonFile = await readFile(path, "utf-8")
	return JSON.parse(jsonFile)
}

export async function parseJsonSchema(path: string) {
	const jsonSchema = await readJsonFile(path)

	const definitions = jsonSchema.definitions

	const modelName = Object.keys(definitions).map((key) => key)[0]
	const modelProperties = definitions[modelName].properties
	const modelPropertiesKeys: PrismaModel[] = []

	Object.keys(modelProperties).forEach((key) => {
		const object: PrismaModel = { name: "", type: "" }

		object.name = key

		if (modelProperties[key].type instanceof Array) {
			object.type = modelProperties[key].type.map((type: string) =>
				translatePrismaToTypescript(type)
			)
		} else {
			object.type = translatePrismaToTypescript(modelProperties[key].type)
		}

		modelPropertiesKeys.push(object)
	})

	return {
		name: modelName,
		properties: modelPropertiesKeys,
	}
}
