// public/js/scripts.js
$(document).ready(function () {
    $(".sidebar-toggle").on("click", function () {
        $(".app-container").toggleClass("sidebar-mini");
    });
});
