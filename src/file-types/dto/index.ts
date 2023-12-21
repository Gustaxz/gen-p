import {
	Project,
	StructureKind,
	Scope,
	SourceFile,
	OptionalKind,
	PropertyDeclarationStructure,
} from "ts-morph"
import { formatFileName } from "../../utils/format-file-name"
import { logger } from "../../logger"
import { formatClassName } from "../../utils/format-class-name"
import { handleMultipleTypes } from "../../utils/handle-multiple-types"
import { validateTypes } from "./validate-types"

export interface Attribute {
	name: string
	type: string
}
export class DTO {
	constructor(
		private projectFile: Project,
		private dir: string,
		private name: string,
		private attributes: Attribute[]
	) {}

	public generateContent() {
		const dtoName = `${formatClassName(this.name)}DTO`
		const dtoFileName = `${formatFileName(this.name)}-dto`
		const dtoFilePath = `${this.dir}/${dtoFileName}.ts`

		const importDecorators: Set<string> = new Set()
		const classProperties: OptionalKind<PropertyDeclarationStructure>[] = []

		this.attributes.forEach((attribute) => {
			const type = handleMultipleTypes(attribute.type)
			const decorators = validateTypes(attribute.type)

			decorators.forEach((decorator) => {
				importDecorators.add(decorator.replace(/\(\)/g, ""))
			})

			classProperties.push({
				decorators: [
					...decorators.map((decorator) => ({
						name: decorator,
					})),
				],
				name: attribute.name,
				type: type,
				scope: Scope.Public,
			})
		})

		const classFile = this.projectFile.createSourceFile(
			dtoFilePath,
			{
				statements: [
					"// Make sure that the tsconfig.json file has the following compiler options:",
					"// strictPropertyInitialization: false",
					"// experimentalDecorators: true",
					"\n",
					{
						kind: StructureKind.ImportDeclaration,
						namedImports: [...importDecorators],
						moduleSpecifier: "class-validator",
					},
					{
						kind: StructureKind.Class,
						name: dtoName,
						isExported: true,
					},
				],
			},
			{ overwrite: true }
		)

		const classDeclaration = classFile.getClass(dtoName)

		this.attributes.forEach((attribute) => {
			const type = handleMultipleTypes(attribute.type)
			const decorators = validateTypes(attribute.type)
			classDeclaration!.addProperty({
				decorators: [
					...decorators.map((decorator) => ({
						name: decorator,
					})),
				],
				name: attribute.name,
				type: type,
				scope: Scope.Public,
			})
		})

		classFile.formatText()

		logger.info(`generated dto class ${dtoName} in ${dtoFilePath}`)
	}
}
