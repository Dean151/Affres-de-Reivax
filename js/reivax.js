$(document).ready(function() {
	var hash = window.location.hash.replace('#', ''); // On récupère l'id de l'affre dans l'anchor
	if (hash.length > 0) {
		$('#'+hash).collapse('show');
	}
});

$('.collapse').on('show.bs.collapse', function () {
  $('.collapse.in').collapse('hide');
  $(this).parent().children('.link').addClass('active');
})

$('.collapse').on('hide.bs.collapse', function () {
  $(this).parent().children('.link').removeClass('active');
})