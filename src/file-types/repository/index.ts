import { Project, StructureKind } from "ts-morph"
import { EntityProps } from "../entity"
import { logger } from "../../logger"
import { repoAbstractMethod } from "./repo-abstract-methods"

export class Repository {
	constructor(
		private projectFile: Project,
		private entity: EntityProps,
		private dir: string,
		private entityRelativePath: string
	) {}

	public generateContent() {
		const repositoryName = `${this.entity.className}Repository`
		const repositoryFileName = `${this.entity.fileName}-repository.ts`
		const repositoryFilePath = `${this.dir}/${repositoryFileName}`
		const entityName =
			this.entity.className.charAt(0).toLowerCase() + this.entity.className.slice(1)

		const repositoryFile = this.projectFile.createSourceFile(
			repositoryFilePath,
			{
				statements: [
					{
						kind: StructureKind.ImportDeclaration,
						namedImports: [
							{
								name: this.entity.className,
							},
						],
						moduleSpecifier: `${this.entityRelativePath}/${this.entity.fileName}`,
					},
					{
						kind: StructureKind.Class,
						name: repositoryName,
						isExported: true,
						isAbstract: true,
						methods: [
							repoAbstractMethod({
								name: "create",
								returnType: `Promise<${this.entity.className}>`,
								parameters: [
									{
										name: entityName,
										type: this.entity.className,
									},
								],
							}),
							repoAbstractMethod({
								name: "update",
								returnType: `Promise<${this.entity.className}>`,
								parameters: [
									{
										name: entityName,
										type: this.entity.className,
									},
								],
							}),
							repoAbstractMethod({
								name: "delete",
								returnType: `Promise<${this.entity.className}>`,
								parameters: [
									{
										name: entityName,
										type: this.entity.className,
									},
								],
							}),
							repoAbstractMethod({
								name: "findById",
								returnType: `Promise<${this.entity.className}>`,
								parameters: [
									{
										name: "id",
										type: "string",
									},
								],
							}),
							repoAbstractMethod({
								name: "findAll",
								returnType: `Promise<${this.entity.className}[]>`,
							}),
						],
					},
				],
			},
			{ overwrite: true }
		)

		repositoryFile.formatText()

		logger.info(`generated repository ${repositoryName} in ${repositoryFilePath}`)

		return {
			repositoryName,
			repositoryFileName,
			repositoryFilePath,
			repositoryFile,
		}
	}
}
