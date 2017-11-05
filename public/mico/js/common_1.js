

$(function(){
   $("#myNavbar li").click(function () {
       $("#myNavbar li").removeClass("active");
       $(this).addClass("active");
   })
});