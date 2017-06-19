var LocalizationManager = {
    currentLanguage: "English",

    getValueByLabel: function (label) {
        var self = this;

        return GameMessages.messagesForLang[self.currentLanguage][label];
    }
}