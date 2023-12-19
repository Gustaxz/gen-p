import { Project, StructureKind, SourceFileStructure } from "ts-morph"
import { Entity } from "./file-types/entity"
import path from "path"
import { readFile } from "fs/promises"
import { parseJsonSchema } from "./json-schema/read"
import { logger } from "./logger"
import { Repository } from "./file-types/repository"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// export type PrismaAction =
//     | 'findUnique'
//     | 'findUniqueOrThrow'
//     | 'findMany'
//     | 'findFirst'
//     | 'findFirstOrThrow'
//     | 'create'
//     | 'createMany'
//     | 'update'
//     | 'updateMany'
//     | 'upsert'
//     | 'delete'
//     | 'deleteMany'
//     | 'executeRaw'
//     | 'queryRaw'
//     | 'aggregate'
//     | 'count'
//     | 'runCommandRaw'
//     | 'findRaw'
//     | 'groupBy'

const jsonSchemaPath = path.join(__dirname, "../prisma/json-schema/json-schema.json")

async function main() {
	try {
		const model = await parseJsonSchema(jsonSchemaPath)

		const project = new Project()
		const dirPath = path.join(__dirname, "../gen").replace(/\\/g, "/")

		const entity = new Entity(project, dirPath, model.name, model.properties).generateContent()
		new Repository(project, entity, dirPath, ".").generateContent()

		project.saveSync()
	} catch (err: any) {
		logger.error("error running main " + err.message)
	}
}

main()
