angular.module('adminHomeApp', [
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
        $http.get('views/admin/login_partials/forms/admin_info_login.html', {cache: $templateCache});
        //partials->navs
        $http.get('views/admin/login_partials/navs/admin_home_top_nav.html', {cache: $templateCache});
        //sections
        $http.get('views/admin/login_partials/sections/grill_edit.html', {cache: $templateCache});
    });