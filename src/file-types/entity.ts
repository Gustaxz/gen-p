import { Project, StructureKind, Scope } from "ts-morph"
import { formatFileName } from "../utils/format-file-name"
import { logger } from "../logger"
import { formatClassName } from "../utils/format-class-name"

export type SupportedTypes = "string" | "number" | "boolean"

export interface Attribute {
	name: string
	type: SupportedTypes
}

// TODO: generate with getters and setters
export class Entity {
	constructor(
		private projectFile: Project,
		private dir: string,
		private name: string,
		private attributes: Attribute[]
	) {}

	public generateContent() {
		const fileName = formatFileName(this.name)
		const filePath = `${this.dir}/${fileName}.ts`

		const classFile = this.projectFile.createSourceFile(
			filePath,
			{
				statements: [
					{
						kind: StructureKind.Class,
						name: formatClassName(this.name),
						isExported: true,
					},
				],
			},
			{ overwrite: true }
		)

		const classDeclaration = classFile.getClass(formatClassName(this.name))

		classDeclaration!.addConstructor({
			parameters: this.attributes.map((attribute) => ({
				scope: Scope.Private,
				name: `${attribute.name}_`,
				type: attribute.type,
			})),
		})

		classDeclaration!.addGetAccessors(
			this.attributes.map((attribute) => ({
				name: attribute.name,
				type: attribute.type,
				scope: Scope.Public,
				statements: [`return this.${attribute.name}_`],
			}))
		)

		classFile.formatText()

		logger.info(`Generated class ${formatClassName(this.name)} in ${filePath}`)
		return {
			fileName,
			filePath,
			className: formatClassName(this.name),
			file: classFile,
		}
	}
}
