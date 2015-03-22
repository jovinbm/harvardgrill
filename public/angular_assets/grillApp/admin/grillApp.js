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
        $http.get('views/admin/views/edit.html', {cache: $templateCache});
        $http.get('views/admin/views/home.html', {cache: $templateCache});
        //partials
        $http.get('views/admin/partials/incoming_orders.html', {cache: $templateCache});
        //partials->navs
        $http.get('views/admin/partials/navs/admin_top_nav.html', {cache: $templateCache});
        //partials->dashboard
        $http.get('views/admin/partials/dashboard/available_card.html', {cache: $templateCache});
        $http.get('views/admin/partials/dashboard/dashboard_column.html', {cache: $templateCache});
        $http.get('views/admin/partials/dashboard/grill_status_card.html', {cache: $templateCache});
        //partials->modals
        $http.get('views/admin/partials/modals/confirm_available.html', {cache: $templateCache});
    })

    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider
            .when("", '/home')
            .when("/", '/home')
            .otherwise('/home');

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'views/admin/views/home.html'
            })
            .state('edit', {
                url: '/edit',
                templateUrl: 'views/admin/views/edit.html'
            })
            .state("otherwise", {
                url: "*path",
                templateUrl: "views/admin/views/home.html"
            });
    }]);