import angular from 'angular/index'
import confirmTemplate from './confirmed.partial.html'

export default class NotificationCtrl {
  constructor(service, modal){
    this.types = service.getTypes()
    this.service = service
    this.editedParameters = {}
    this.editedParameters.original = service.getParameters()
    this.editedParameters.newDisplayEnabledTypes = service.getDisplayEnabledTypes()
    this.editedParameters.newPhoneEnabledTypes = service.getPhoneEnabledTypes()
    this.editedParameters.newMailEnabledTypes = service.getMailEnabledTypes()
    this.editedParameters.newRssEnabledTypes = service.getRssEnabledTypes()
    this.nbDisplayChecked = this.getNbDisplayChecked()
    this.nbPhoneChecked = this.getNbPhoneChecked()
    this.nbMailChecked = this.getNbMailChecked()
    this.nbRssChecked = this.getNbRssChecked()
    this.collapse = {} // we show the subcheckboxes if one of them is checked

    this.types.forEach(type => {
      this.collapse[type.name] = false
      type.children.forEach(c => {
        if (
            this.editedParameters.newDisplayEnabledTypes[c] ||
            this.editedParameters.newPhoneEnabledTypes[c] ||
            this.editedParameters.newMailEnabledTypes[c] ||
            this.editedParameters.newRssEnabledTypes[c]
        ) {
          this.collapse[type.name] = true
        }
      })
    })

    this._modalFactory = modal
    this._modalInstance = null
    this.allowPhoneAndMail = this.service.getAllowPhoneAndMail()
    this.mode = this.service.getMode()
    this.isAdmin = this.mode === 'admin'

  }

  changeAllowPhoneAndMail() {
    this.allowPhoneAndMail = !this.allowPhoneAndMail
    this.service.setAllowPhoneAndMail(this.allowPhoneAndMail)
  }

  _closeModal() {
    this._modalInstance.close()
  }

  _modal(template, errorMessage, errors) {
    if (errorMessage) {
      this.errorMessage = errorMessage
    }
    if (errors) {
      this.errors = errors
    }
    this._modalInstance = this._modalFactory.open(template)
  }

  getNbRssChecked(){
    return Object.keys(this.editedParameters.newRssEnabledTypes).filter((index) => {
        return this.editedParameters.newRssEnabledTypes[index]
    }).length
  }

  getNbDisplayChecked(){
    return Object.keys(this.editedParameters.newDisplayEnabledTypes).filter((index) => {
      return this.editedParameters.newDisplayEnabledTypes[index]
    }).length
  }

  getNbPhoneChecked(){
    return Object.keys(this.editedParameters.newPhoneEnabledTypes).filter((index) => {
      return this.editedParameters.newPhoneEnabledTypes[index]
    }).length
  }

  getNbMailChecked(){
    return Object.keys(this.editedParameters.newMailEnabledTypes).filter((index) => {
      return this.editedParameters.newMailEnabledTypes[index]
    }).length
  }

  isEditable(){
    let cptDisplay = this.getNbDisplayChecked()
    let cptPhone = this.getNbPhoneChecked()
    let cptMail = this.getNbMailChecked()
    let cptRss = this.getNbRssChecked()
    return this.nbDisplayChecked != cptDisplay || this.nbPhoneChecked != cptPhone || this.nbMailChecked != cptMail || this.nbRssChecked != cptRss
  }

  isRssEnabled(){
    let cpt = this.getNbRssChecked()
    return this.nbRssChecked != cpt
  }

  toggleAll(type, column){

    let toggleStatus = null
    let table = null

    if (angular.equals(column,'visible')){
      toggleStatus = this.editedParameters.newDisplayEnabledTypes[type.name]
      table = this.editedParameters.newDisplayEnabledTypes
    } else if (angular.equals(column,'phone')) {
      toggleStatus = this.editedParameters.newPhoneEnabledTypes[type.name]
      table = this.editedParameters.newPhoneEnabledTypes
    } else if (angular.equals(column,'mail')){
      toggleStatus = this.editedParameters.newMailEnabledTypes[type.name]
      table = this.editedParameters.newMailEnabledTypes
    } else if (angular.equals(column, 'rss')){
      toggleStatus = this.editedParameters.newRssEnabledTypes[type.name]
      table = this.editedParameters.newRssEnabledTypes
    } else {
      return
    }
    type.children.forEach(c=>{
      table[c] = toggleStatus
    })
  }


  optionToggled(type, column){

    let table = null

    if (angular.equals(column,'visible')){
      table = this.editedParameters.newDisplayEnabledTypes
    } else if (angular.equals(column,'phone')) {
      table = this.editedParameters.newPhoneEnabledTypes
    } else if (angular.equals(column,'mail')){
      table = this.editedParameters.newMailEnabledTypes
    } else if (angular.equals(column, 'rss')){
      table = this.editedParameters.newRssEnabledTypes
    } else {
      return
    }

    table[type.name] = type.children.every(c=>{
      return table[c]
    })

  }

  save(){
    this.service.saveParameters(
        this.editedParameters.original,
        this.editedParameters.newDisplayEnabledTypes,
        this.editedParameters.newPhoneEnabledTypes,
        this.editedParameters.newMailEnabledType,
        this.editedParameters.newRssEnabledTypes
    )
    this._modal(confirmTemplate)
  }
}