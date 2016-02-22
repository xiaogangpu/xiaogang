/**
 * Created by zhou on 2016/1/13.
 *
 */

    $(function(){
        $i = 1;
            var $rs_show_bg = $("#rs_show h1 span");
            //$rs_show_bg.eq($i).addClass("rs_span_bg").find("a").css("color", "#fff");
            //$rs_show_bg.mouseenter(function () {
            //    $(this).addClass("rs_span_bg")
            //        .find("a").css("color", "#fff");
            //})
            //$rs_show_bg.mouseleave(function () {
            //    $(this).removeClass("rs_span_bg")
            //        .find("a").css("color", "#bf0000")
            //    $rs_show_bg.eq($i).addClass("rs_span_bg").find("a").css("color", "#fff");
            //});
            $rs_show_bg.hover(
                function(){
                    $(this).addClass("rs_span_bg")
                        .find("a").css("color", "#fff");
                },
                function(){
                    $(this).removeClass("rs_span_bg")
                        .find("a").css("color", "#bf0000")
                    //$rs_show_bg.eq($i).addClass("rs_span_bg").find("a").css("color", "#fff");
                }
            )
            //$rs_show_bg.eq($i).siblings().mouseenter(function () {
            //    $rs_show_bg.eq($i).removeClass("rs_span_bg").find("a").css("color", "#bf0000");
            //})
    })
