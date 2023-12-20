import { Project, StructureKind } from "ts-morph"
import { EntityProps } from "../entity"
import { logger } from "../../logger"
import { repoAbstractMethod } from "./repo-abstract-methods"
import { RepositoryProps } from "."

export class PrismaRepository {
	constructor(
		private projectFile: Project,
		private repository: RepositoryProps,
		private dir: string,
		private moduleRelativePath: string
	) {}

	public generateContent() {
		const repositoryName = `${this.repository.entity.className}PrismaRepository`
		const repositoryFileName = `${this.repository.entity.fileName}-prisma-repository`
		const repositoryFilePath = `${this.dir}/${repositoryFileName}.ts`
		const entityName =
			this.repository.entity.className.charAt(0).toLowerCase() +
			this.repository.entity.className.slice(1)

		const repositoryFile = this.projectFile.createSourceFile(
			repositoryFilePath,
			{
				statements: [
					{
						kind: StructureKind.ImportDeclaration,
						namedImports: [
							{
								name: this.repository.entity.className,
							},
						],
						moduleSpecifier: `${this.moduleRelativePath}/${this.repository.entity.fileName}`,
					},
					{
						kind: StructureKind.ImportDeclaration,
						namedImports: [
							{
								name: this.repository.repositoryName,
							},
						],
						moduleSpecifier: `${this.moduleRelativePath}/${this.repository.repositoryFileName}`,
					},

					{
						kind: StructureKind.ImportDeclaration,
						namedImports: [
							{
								name: "PrismaClient",
							},
						],
						moduleSpecifier: "@prisma/client",
					},
					{
						kind: StructureKind.VariableStatement,
						declarations: [
							{
								name: "prisma",
								initializer: "new PrismaClient()",
							},
						],
						isExported: true,
					},
					{
						kind: StructureKind.Class,
						implements: [this.repository.repositoryName],
						name: repositoryName,
						isExported: true,
						isAbstract: true,
						methods: [
							{
								name: "create",
								isAsync: true,
								returnType: `Promise<${this.repository.entity.className}>`,
								parameters: [
									{
										name: entityName,
										type: this.repository.entity.className,
									},
								],
								statements: [
									`const res = await prisma.${entityName}.create({ data: ${entityName} });`,
									`const new${this.repository.entity.className} = new ${this.repository.entity.className}(res);`,
									`return new${this.repository.entity.className};`,
								],
							},
						],
					},
				],
			},
			{ overwrite: true }
		)

		repositoryFile.formatText()

		logger.info(`generated prisma repository ${repositoryName} in ${repositoryFilePath}`)

		return {
			repositoryName,
			repositoryFileName,
			repositoryFilePath,
			repositoryFile,
		}
	}
}
