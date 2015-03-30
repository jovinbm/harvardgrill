angular.module('grillApp', [
    'ngAnimate',
    'textAngular',
    'ngSanitize',
    'ui.bootstrap',
    'ngRoute',
    'angular-loading-bar',
    'angulartics',
    'angulartics.google.analytics',
    'angularMoment',
    'ui.router'
])

    .run(function ($templateCache, $http) {
        //views
        $http.get('views/client/views/home.html', {cache: $templateCache});
        //partials->navs
        $http.get('views/client/partials/navs/client_top_nav.html', {cache: $templateCache});
        //partials->sections
        $http.get('views/client/partials/sections/my_recent_orders.html', {cache: $templateCache});
        $http.get('views/client/partials/sections/recent_order_stream.html', {cache: $templateCache});
        $http.get('views/client/partials/sections/main_order_card.html', {cache: $templateCache});
        //partials->modals
    })

    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider
            .when("", '/home')
            .when("/", '/home')
            .otherwise('/home');

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'views/client/views/home.html'
            })
            .state("otherwise", {
                url: "*path",
                templateUrl: "views/client/views/home.html"
            });
    }]);