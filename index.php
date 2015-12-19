<?php
	// Loading composer libraries
	require_once __DIR__ . '/inc/sql.php';
	require_once __DIR__ . '/vendor/autoload.php';
	Twig_Autoloader::register();

	$loader = new Twig_Loader_Filesystem('view');
	$twig = new Twig_Environment($loader);//, array('cache' => '/path/to/compilation_cache'));
	
	$data = array();

	if (isset($_GET['tag'])) {
		if (preg_match("#^([a-zA-Z0-9\-]+)$#", $_GET['tag'])) {
			$data['tag'] = $_GET['tag'];
		}
	}

	// PDO MySQL connexion
	try {
		$dbh = new PDO($dsn, $user, $password, array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8'));
	    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	    // Fetching stories
	    $req = $dbh->prepare('SELECT bonus_id as id,
	    							 bonus_tag as tag,
	    							 bonus_titre as title,
	    							 DATE_FORMAT(bonus_date,"%d/%m/%Y") as date,
	    							 bonus_texte as description,
	    							 bonus_file as file
	    					  FROM v3_bonus 
	    					  WHERE bonus_type = "reivax" AND bonus_online = "1" AND bonus_date < NOW()');
	    $req->execute();
	    $data['affres'] = $req->fetchAll();

	} catch (PDOException $e) {
	    echo 'Échec SQL : ' . $e->getMessage();
	}
	// Closing PDO connexion
	$dbh = null;

	echo $twig->render('home.html', $data);