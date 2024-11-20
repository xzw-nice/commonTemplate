import {hasPermission} from "./hasPermission.js"
import {ClickOutside, Mousewheel, vRepeatClick, TrapFocus} from 'element-plus'

const directives = [hasPermission]
export const directive = (app) => {
    directives.forEach((item) => app.directive(item.name, item.value))
    app.directive('ClickOutside', ClickOutside)
    app.directive('MouseWheel', Mousewheel)
    app.directive('RepeatClick', vRepeatClick)
    app.directive('TrapFocus', TrapFocus)
}
