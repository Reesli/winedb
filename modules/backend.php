<?php
include ('../resources/eXist.php');
// Handling data in JSON format on the server-side using PHP
//
header("Content-Type: application/json");
// build a PHP variable from JSON sent using POST method
$test = $_POST['weinname'];

    try {
  	$db = new eXistAdmin('admin', '32pommes', 'http://127.0.0.1:8080/exist/services/Admin?wsdl');
	$db->connect() or die ($db->getError());
    
	// Store Document
	$db->store('<Wein WeinID="'.$test.'">'.$test.'</Wein>',
				'UTF-8',
				'/db/apps/WineDBxml/testload.xml', true);
				
	$db->disconnect() or die ($db->getError());
	}
	  catch( Exception $e )
    {
    echo "die";
	die($e);
	
}

?>