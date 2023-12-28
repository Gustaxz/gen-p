#!/usr/bin/env node

import { Project, StructureKind, SourceFileStructure } from "ts-morph"
import { Entity } from "./file-types/entity"
import path from "path"
import { readFile } from "fs/promises"
import { parseJsonSchema } from "./json-schema/read"
import { logger } from "./logger"
import { Repository } from "./file-types/repository"
import { PrismaRepository } from "./file-types/repository/prisma-repository"
import { formatFileName } from "./utils/format-file-name"
import { DTO } from "./file-types/dto"

import { Command } from "commander"

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

async function generateFiles(jsonSchemaPath: string) {
	try {
		const project = new Project()
		const models = await parseJsonSchema(jsonSchemaPath)

		models.forEach((model) => {
			const dirPath = path
				.join(__dirname, `../gen/${formatFileName(model.name)}`)
				.replace(/\\/g, "/")
			new DTO(project, dirPath, model.name, model.properties).generateContent()
			const entity = new Entity(
				project,
				dirPath,
				model.name,
				model.properties
			).generateContent()
			const repository = new Repository(project, entity, dirPath, ".").generateContent()
			new PrismaRepository(project, repository, dirPath, ".").generateContent()
		})

		project.saveSync()
	} catch (err: any) {
		logger.error("error running main " + err.message)
	}
}

const program = new Command()
program
	.name("gen-p")
	.description("generate dto, entity, repository, prisma repository from prisma-schema")
	.version("0.0.1")

program
	.command("generate <jsonSchemaPath>")
	.description("generate <jsonSchemaPath>")
	.action(async (jsonSchemaPath) => {
		await generateFiles(jsonSchemaPath)
	})

program.parse()
