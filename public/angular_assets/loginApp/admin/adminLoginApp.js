angular.module('adminLoginApp', [
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
        //forms
        $http.get('views/admin/login_partials/forms/admin_info_login.html', {cache: $templateCache});
        $http.get('views/admin/login_partials/forms/admin_registration.html', {cache: $templateCache});
        //partials->navs
        $http.get('views/admin/login_partials/navs/admin_login_top_nav.html', {cache: $templateCache});
        $http.get('views/admin/login_partials/navs/admin_login_footer.html', {cache: $templateCache});
        //sections
        $http.get('views/admin/login_partials/sections/grill_edit.html', {cache: $templateCache});
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