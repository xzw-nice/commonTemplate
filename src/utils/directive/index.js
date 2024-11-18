import { hasPermission } from "./hasPermission.js"

const directives = [hasPermission]
export const directive = (app) => {
	directives.forEach((item) => app.directive(item.name, item.value))
}
