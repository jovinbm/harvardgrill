angular.module('grillApp', [
    'ngAnimate',
    'textAngular',
    'ngSanitize',
    'ui.bootstrap',
    'ngRoute',
    'angular-loading-bar',
    'angulartics',
    'angulartics.google.analytics'
]);
//.config(['$routeProvider', function ($routeProvider) {
//    $routeProvider
//        .when('/home/', {
//            redirectTo: '/1'
//        })
//        .when('/:page/', {
//            templateUrl: 'views/partials/views/home.html'
//        })
//        .when('/fullQuestion/:index/', {
//            templateUrl: 'views/partials/views/question_full.html'
//        })
//        .when('/trending/full/', {
//            templateUrl: 'views/partials/views/trending.html'
//        })
//        .otherwise({redirectTo: '/1'});
//}]);