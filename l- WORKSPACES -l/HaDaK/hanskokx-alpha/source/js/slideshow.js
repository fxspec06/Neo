$(document).ready(function () {
    var bool = true;

    var fadeDefaults = function () {
        $('#default-background').fadeOut(1000, function () {
            $(this).remove();
        });
        $('#li_slideshow_default').remove();
        $('#bullet_container').css({
            'opacity': 1
        });
        bool = false;
    };

    var flipNext = function () {
        if (bool) {
            fadeDefaults();
        }


        object = $('.background-photo.active').fadeOut(1000).toggleClass('active').next();
        if (object.length === 0) {
            object = $('#photos div:first-child');
        }
        object.fadeIn(1000).toggleClass('active');

        bullet = $('.li_slideshow.active').toggleClass('active').next();
        if (bullet.length === 0) {
            bullet = $('#bullet_container span:first-child');
        }
        bullet.toggleClass('active');

        $(window).resize();
    };

    var flipPrev = function () {
        if (bool) {
            fadeDefaults();
        }


        object = $('.background-photo.active').fadeOut(1000).toggleClass('active').prev();
        if (object.length === 0) {
            object = $('#photos div:last-child');
        }
        object.fadeIn(1000).toggleClass('active');

        bullet = $('.li_slideshow.active').toggleClass('active').prev();
        if (bullet.length === 0) {
            bullet = $('#bullet_container span:last-child');
        }
        bullet.toggleClass('active');

        $(window).resize();
    };

    $('.arrow.next').click(function () {
        flipNext();
    }); // Handle right arrow click
    $('.arrow.previous').click(function () {
        flipPrev();
    }); // Handle left arrow click

    $("body").keydown(function (e) {
        if (e.keyCode == 37) { // Handle left arrow key
            flipPrev();
        } else if (e.keyCode == 39) { // Handle right arrow key
            flipNext();
        }
    });

    $(window).resize(function () {
        $('.active .background-photo-img').css({
            top: $('#photos').height() / 2 - $('.active .background-photo-img').outerHeight() / 2
        });

    });

    $(window).resize();
});