describe('Village Game Test', function() {
    beforeEach(function() {
        return browser.ignoreSynchronization = true;
    });

    it('should have a title', function() {
        browser.get(browser.baseUrl);

        expect(browser.getTitle()).toEqual('Village Makeover');
    });

    it('should start with tutorial', function() {
        var elementToInteract = element(by.id('skipTutorial'));
        browser.wait(function(){
            return elementToInteract.isPresent();
        }, 20000).then(function(){
            browser.driver.sleep(1000);
        });

        browser.executeScript(function () {
            window.API.state.cash = 1000;
            window.API.state.coins = 1000;
            window.API.reloadState();
            window.API.saveState();
        });

        var currentStateName = browser.executeScript('return window.ige.client.fsm.currentStateName()');
        expect(currentStateName).toEqual('tutorial');
    });

    it('should show first problem when user skips tutorial', function() {
        element(by.id('skipTutorial')).click();

        var currentStateName = browser.executeScript('return window.ige.client.fsm.currentStateName()');
        expect(currentStateName).toEqual('showMessage');
    });

    it('should have first problem id in state', function() {
        var  currentProblemID = browser.executeScript('return window.API.state.currentProblemID');

        expect(currentProblemID).toEqual("P001");
    });

    it('should transition to select state after closing first problem message', function() {
        browser.driver.sleep(1000);

        element(by.id('messageDialogOK')).click();

        var currentStateName = browser.executeScript('return window.ige.client.fsm.currentStateName()');
        expect(currentStateName).toEqual('select');
    });

    it('should transition to marketDialog state when user clicks on market button', function() {
        browser.driver.sleep(1000);

        element(by.id('marketButton')).click();

        var currentStateName = browser.executeScript('return window.ige.client.fsm.currentStateName()');
        expect(currentStateName).toEqual('marketDialog');
    });

    it('should transition to buyConfirmDialog state when user clicks on unlockwell2 button', function() {
        browser.driver.sleep(1000);

        element(by.id('unlockWell2')).click();

        var currentStateName = browser.executeScript('return window.ige.client.fsm.currentStateName()');
        expect(currentStateName).toEqual('buyConfirmDialog');
    });

    it('should show item is unlocked message when user approves are you sure message', function() {
        browser.driver.sleep(1000);

        element(by.id('buyConfirmYes')).click();

        var  currentStateName = browser.executeScript('return window.ige.client.fsm.currentStateName()');
        expect(currentStateName).toEqual('showMessage');
    });

    it('should have 998 bucks after user pays to unlock well2', function() {
        browser.executeScript('return window.API.state.cash').then(function(currentVBucks){
            browser.executeScript("return window.GameObjects.catalogLookup['Well2'].unlockValue").then(function(unlockValue){
                expect(currentVBucks).toEqual(1000 - unlockValue);
            });
        });
    });

    it('should transition to select state after closing item is unlocked message', function() {
        browser.driver.sleep(1000);

        element(by.id('messageDialogOK')).click();

        var currentStateName = browser.executeScript('return window.ige.client.fsm.currentStateName()');
        expect(currentStateName).toEqual('select');
    });

    it('should transition to marketDialog state when user clicks on market button second time', function() {
        browser.driver.sleep(1000);

        element(by.id('marketButton')).click();

        var currentStateName = browser.executeScript('return window.ige.client.fsm.currentStateName()');
        expect(currentStateName).toEqual('marketDialog');
    });

    it('should transition to build state when user clicks on marketItemButtonWell2 button', function() {
        browser.driver.sleep(1000);

        element(by.id('marketItemButtonWell2')).click();

        var currentStateName = browser.executeScript('return window.ige.client.fsm.currentStateName()');
        expect(currentStateName).toEqual('build');
    });

    it('should show next item is unlocked message when current item is built', function() {
        browser.driver.sleep(500);

        element(by.id('igeFrontBuffer')).click();

        browser.driver.sleep(500);

        var currentStateName = browser.executeScript('return window.ige.client.fsm.currentStateName()');
        expect(currentStateName).toEqual('showMessage');
    });

    it('should transition to select state after closing item is unlocked message second time', function() {
        browser.driver.sleep(1000);

        element(by.id('messageDialogOK')).click();

        var currentStateName = browser.executeScript('return window.ige.client.fsm.currentStateName()');
        expect(currentStateName).toEqual('select');
    });

    it('should have 900 coins after user builds well2', function() {
        browser.executeScript('return window.API.state.coins').then(function(currentCoins){
            browser.executeScript("return window.GameObjects.catalogLookup['Well2'].coins").then(function(coins){
                expect(currentCoins).toEqual(1000 - coins);
            });
        });
    });

    it('should have 1 object in state after user builds well2', function() {
        var  currentObjectCountInState = browser.executeScript('return window.API.state.objects.length');

        expect(currentObjectCountInState).toEqual(1);
        browser.driver.sleep(2000);
    });
});