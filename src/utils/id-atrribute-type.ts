import { EntityProps } from "../file-types/entity"

export function idAttributeType(entity: EntityProps): string {
	const idAttribute = entity.attributes.find((atr) => atr.name === "id")
	if (!idAttribute) {
		throw new Error(`Entity ${entity.className} has no id attribute`)
	}
	return idAttribute.type
}
