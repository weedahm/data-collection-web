function init_events() {
    $('.header__menu__item').hover(
        function () {
            // $(this).css("border-bottom", "2px solid #45AB41");
            $(this).addClass("header__menu__item--active-on")
        },
        function () {
            // $(this).css("border-bottom", "0");
            $(this).removeClass("header__menu__item--active-on")
        }
    )
}

$(document).ready(function ($) {
    init_events();
});