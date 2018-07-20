function init_events() {
    $('.wd_ab').hover(
        function () {
            $(this).css("border-bottom", "2px solid #45AB41");
        },
        function () {
            $(this).css("border-bottom", "0");
        }
    )
}

$(document).ready(function ($) {
    init_events();
});