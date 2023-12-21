import { readFile } from "fs/promises"
import { translatePrismaToTypescript } from "../utils/translate-prisma-ts"
import { PrismaModel } from "./types"
import { logger } from "../logger"

interface Model {
	name: string
	properties: PrismaModel[]
}

async function readJsonFile(path: string) {
	logger.info("reading json file " + path)
	try {
		const jsonFile = await readFile(path, "utf-8")
		return JSON.parse(jsonFile)
	} catch (err: any) {
		logger.error("error running readJsonFile " + err.message)
		throw new Error(err)
	}
}

async function parseModels(definitions: any, modelName: string) {
	const modelProperties = definitions[modelName].properties
	const modelPropertiesKeys: PrismaModel[] = []

	Object.keys(modelProperties).forEach((key) => {
		const object: PrismaModel = { name: "", type: "" }

		object.name = key

		const options = Object.keys(modelProperties[key])

		object.type = translatePrismaToTypescript(modelProperties[key], options)

		modelPropertiesKeys.push(object)
	})

	return {
		name: modelName,
		properties: modelPropertiesKeys,
	}
}

export async function parseJsonSchema(path: string) {
	try {
		const models: Model[] = []
		const jsonSchema = await readJsonFile(path)

		const definitions = jsonSchema.definitions

		Object.keys(definitions).forEach(async (key) => {
			const model = await parseModels(definitions, key)
			models.push(model)
		})

		return models
	} catch (err: any) {
		logger.error("error running parseJsonSchema " + err.message)
		throw new Error(err)
	}
}
