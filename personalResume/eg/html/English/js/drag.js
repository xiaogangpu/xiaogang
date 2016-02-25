var start = {};
var drag_distance = {};
var order,know;
var isP = false,isG = false;       //isP是否点击了短文中空格,isG是否已经计算出得出结果
var arr = [], arrTrue = [0, 1, 3, 2, 4, 5, 6, 7, 8, 9];          //arrTrue存储正确的答案,实际中通过服务器请求JSON数据
$(document).ready(function(){
    $(".drag").bind("mousedown",function(event){
        drag_distance.start = event.clientY;
        start.top = parseInt($(".body-1").css("height"));
        start.bottom = parseInt($(".body-2").css("height"));
        return false;
    });
    /*&& parseInt($(".body-1").css("height"))>100 && parseInt($(".body-2").css("height"))>100*/
    $(".drag").bind("mousemove", function (event) {
        if(start.top>=0  ){
            var distance;
            drag_distance.end = event.clientY;
            distance = drag_distance.end - drag_distance.start;
            if ((distance > 0 && parseInt($(".body-2").css("height")) > 100) || (distance < 0 && parseInt($(".body-1").css("height")) > 100)) {
                $(".body-1").css("height", start.top + distance + "px");
                $(".body-2").css("height", start.bottom - distance + "px");
            }
        }
        console.log(parseInt($(".body-1").css("height"))+parseInt($(".body-2").css("height")));
        return false;
    });
    $("body").bind("mouseup",function(){
        start.top = -1;
        start.bottom = -1;
        return false;
    });
    know = $(".article").html().replace(/\-{3,}/g, "<div class='label'></div>");   //进行替换空数字符
    $(".article").html(know);                              
    $(".article").on("click", ".label", function () {
        if (isG) {
            $(".details").each(function () { $(this).css("display","none");});
            $(".details").eq($(this).attr("name")).css("display", "block");
            return;
        }
        isP = true;
        order = $(this).index();
        $(this).css("background-color", "rgb(111,211,241)");
        $(".choice").css("display", "block");
        $(".button").eq($(this).index()).addClass("active");
        $(".triangle").eq($(this).index()).addClass("active");
        $(this).removeClass("make")
        $(".table .td").eq($(".label")[order].getOrd).removeClass("delete");
    });
    $(".table").on("mouseover", ".td", function () {
        if (isP&&!$(this).hasClass("delete")) {
            $(this).addClass("active");
            $(".label").eq(order).html($(this).html());
        }
    });
    $(".table").on("click", ".td", function () {
        if (isP && !$(this).hasClass("delete")) {
            $(this).addClass("delete");
            $(".label").eq(order).html($(this).html());
            $(".label").eq(order).addClass("make");
            var num = $(this).parent().index();
            switch (num) {
                case 0: num = 0; break;
                case 1: num = 3; break;
                case 2: num = 6; break;
                case 3: num = 9; break;
                case 4: num = 12; break;
            }
            $(".label")[order].getOrd = $(this).index() + num;       //1.标记为已操作2.记录编号
            isP = false;
        }
    });
    $(".table").on("mouseout", ".td", function () {
        $(this).removeClass("active");
    });
    $(".submit").on("click", function () {
        isG = true;
        var getArr = makeTrue();
        doAdjust(getArr);
         $(".notice-bg").css("display", "block");
         $(".notice").css("display", "block");
     });
    $(".server.outline").on("click",function(){
        $(".notice-bg").css("display","none");
        $(".notice").css("display", "none");
        $(".choice").css("display", "none");
        $("#answer").css("display", "block");
    });
    $(".server.return").on("click",function(){
        $(".notice-bg").css("display","none");
        $(".notice").css("display", "none");
        $(".choice").css("display", "none");
        $("#answer").css("display", "block");
    });
    function makeTrue() {
        for (var i = 0; i < 10; i++) {
            $(".label").eq(i).attr("name", i);
            if ($(".label")[i].getOrd==undefined) {
                arr[i] = 11;
            } else {
                arr[i] = $(".label")[i].getOrd;
            }
        }
        var yeild;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == 11) {
                arr[i] = 0;             //空，未填写
                yeild = $(".table .td")[arrTrue[i]].innerHTML;    
                $(".label").eq(i).html("-").after("<span>" + yeild + "</span>");
                debugger
            } else if (arr[i] == arrTrue[i]) {
                arr[i] = 1;             //正确
            } else {
                arr[i] = 2;             //错误
                yeild = $(".table .td")[arrTrue[i]].innerHTML;
                $(".label").eq(i).addClass("false");
                $(".label").eq(i).after("<span>" + yeild + "</span>");
            }         
        }
        return arr;
       
    }
    function doAdjust(getA) {
        var value=0;
        for (i = 0; i < getA.length; i++) {
            $(".nav-bar .button").eq(i).removeClass("active");
            switch (getA[i]) {
                case 0: $(".showN li").eq(i).addClass("error"); $(".nav-bar .button").eq(i).addClass("error");  break;
                case 1: $(".showN li").eq(i).addClass("bingGo"); $(".nav-bar .button").eq(i).addClass("true"); value++;  break;
                case 2: $(".showN li").eq(i).addClass("error"); $(".nav-bar .button").eq(i).addClass("error");  break;
            }
        }
        value = value / 10 * 100 + "%";
        $(".showP p").html(value);
    }
    function createDetails() {             //暂时模拟Json写入答案解析
             var oBox = document.getElementById("answer");
             var oFrag = document.createDocumentFragment();
             for (var i = 0; i < 10; i++)
             {
                var oLi = document.createElement("div");
                oLi.className = "details";
                oLi.innerHTML = "<p class='zh'>answer：" + i + 1 + "</p><p class='zh'>本题的答案解析为:" + $(".table .td")[arrTrue[i]].innerHTML + "</p>";
                oFrag.appendChild(oLi)
             }
             oBox.appendChild(oFrag);
    }
    createDetails();
});