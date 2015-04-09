angular.module('clientHomeApp', [
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
        //partials->navs
        $http.get('views/client/login_partials/navs/client_home_top_nav.html', {cache: $templateCache});
    });