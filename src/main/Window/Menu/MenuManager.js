import { EventEmitter } from 'events'
import { Menu } from 'electron'
import { setupMaster } from 'cluster'
import menu from './menu.json'
import keymap from './keymap.json'
import { convertTemplate, flattenMenuItems } from './menu'
import logger from '../../Helpers/Logger'
function MenuManager(options) {
  let  items = {}
 
 
  build()
  // setup()
  this.updateMenuItemEnabledState = function(id, flag) {
    const enabledStates = {
      [id]: flag
    }
    updateMenuStates(null, enabledStates, null)
  }
  
  this.updateMenuStates  = function(visibleStates, enabledStates, checkedStates) {
    updateStates(this.items, visibleStates, enabledStates, checkedStates)
  }
  function build() {
    const keystrokesByCommand = {}
    for (const item in keymap) {
      keystrokesByCommand[keymap[item]] = item
    }
    const template = JSON.parse(JSON.stringify(menu.menu))
    const tpl = convertTemplate(template, keystrokesByCommand)
    const men = Menu.buildFromTemplate(tpl)
    return men
  }

  this.setup = function() {
    const menu = build()
    Menu.setApplicationMenu(menu)
    items = flattenMenuItems(menu)
  }

}



export default MenuManager