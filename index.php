<?
	// Loading composer libraries
	require_once __DIR__ . '/inc/sql.php';
	require_once __DIR__ . '/vendor/autoload.php';
	Twig_Autoloader::register();

	$loader = new Twig_Loader_Filesystem('view');
	$twig = new Twig_Environment($loader);//, array('cache' => '/path/to/compilation_cache'));
	
	$data = array();

	echo $twig->render('home.html', $data);