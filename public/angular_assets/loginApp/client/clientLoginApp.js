angular.module('clientLoginApp', [
    'ui.bootstrap',
    'angular-loading-bar',
    'angulartics',
    'angulartics.google.analytics',
    'angularMoment',
    'ui.router',
    'duScroll',
    'ngFx',
    'ngAnimate'
])

    .run(function ($templateCache, $http) {
        //forms
        $http.get('views/client/login_partials/forms/client_info_login.html', {cache: $templateCache});
        $http.get('views/client/login_partials/forms/client_registration.html', {cache: $templateCache});
        //partials->navs
        $http.get('views/client/login_partials/navs/client_login_top_nav.html', {cache: $templateCache});
        $http.get('views/client/login_partials/navs/client_login_footer.html', {cache: $templateCache});
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