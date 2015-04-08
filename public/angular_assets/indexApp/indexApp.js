angular.module('indexApp', [
    'ui.bootstrap',
    'angular-loading-bar',
    'angulartics',
    'angulartics.google.analytics',
    'angularMoment',
    'ui.router'
])

//.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
//    $urlRouterProvider
//        .when("", '/home')
//        .when("/", '/home')
//        .otherwise('/home');
//
//    $stateProvider
//        .state('home', {
//            url: '/home',
//            templateUrl: 'views/client/views/home.html'
//        })
//        .state("otherwise", {
//            url: "*path",
//            templateUrl: "views/client/views/home.html"
//        });
//}]);