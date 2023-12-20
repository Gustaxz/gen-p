import { AvailableMethods } from "./available-methods"

type Parameters = {
	name: string
	type: string
}

interface MethodsProps {
	name: AvailableMethods
	returnType: string
	parameters?: Parameters[]
}

export function repoAbstractMethod(props: MethodsProps) {
	if (!props.parameters) {
		return {
			name: props.name,
			returnType: props.returnType,
			isAbstract: true,
		}
	}

	return {
		name: props.name,
		returnType: props.returnType,
		isAbstract: true,
		parameters: props.parameters,
	}
}
