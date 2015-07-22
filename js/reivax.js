$(document).ready(function() {
	$(".affre-link").click(function (e) { e.preventDefault(); })
});

$('.collapse').on('show.bs.collapse', function () {
  $('.collapse.in').collapse('hide');
  $(this).parent().children('.link').addClass('active');
})

$('.collapse').on('hide.bs.collapse', function () {
  $(this).parent().children('.link').removeClass('active');
})