$(document).ready(function () {
    //using bootstrap validator for form validation
    $("#studentLoginForm").bootstrapValidator();

    $('.logoutHarvardLogin').click(function () {
        sendLogoutHarvardLogin();
    });

    //js for logout from harvard ID
    function sendLogoutHarvardLogin() {
        $.ajax({
            url: "/api/logoutHarvardLogin",
            type: "POST",
            success: function () {
                window.location = "//" + window.location.hostname + ":" + window.location.port;
            }
        });
    }

    function getUserUniqueCuid() {
        $.ajax({
            url: "/api/getUserUniqueCuid",
            type: "GET",
            success: function (resp) {
                if (document.location.hostname.search("harvardgrill") !== -1) {
                    ga('set', '&uid', resp.userUniqueCuid); // Set the user ID using signed-in user_id.
                }
            },
            error: function (resp) {
                //the resp is an error string from the database
                console.log("Error while getting user uniqueCuid, err = " + resp);
            }
        });
    }

    //getUserUniqueCuid();
});