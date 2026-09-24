// Local scaffold: supplies the pieces the original ngdistance app provided.
//  - $rootScope.$storage (originally ngStorage's $localStorage), persisted to localStorage
//  - a stub $state (originally ui-router; injected but unused by Lab2Ctrl)
angular.module("lab2App", ["ngdistance.controllers.egr1010.lab2"])
    .factory("$state", function() {
        return {};
    })
    .run(["$rootScope", function($rootScope) {
        var saved = null;
        try { saved = localStorage.getItem("lab2mode"); } catch (err) {}
        $rootScope.$storage = { lab2mode: saved === "two" ? "two" : "one" };
        $rootScope.$watch("$storage.lab2mode", function(mode) {
            try { localStorage.setItem("lab2mode", mode); } catch (err) {}
        });
    }]);
