<?php
include ('../resources/eXist.php');

        $query = '
        for $record in doc('."'".'/db/apps/WineDBxml/resources/WeinDB.xml'."'".')//WeinDB/Wein
        let $id := $record/@WeinID/string()
        let $name := $record/Name
        let $herst := $record/Hersteller
        let $land := $record/Land
        let $region := $record/Region
        let $weinfarbe := $record/Weinfarbe
        let $sorte := $record/Traubensorte
        let $jahr := $record/Jahrgang
        let $anzahl := $record/Anzahl
        let $punkte := $record/Punkte
        let $ab := $record/TrinkenAb
        let $bis := $record/TrinkenBis
        return 
        <data>
            <WeinID>{$id}</WeinID>
            {$name}
            {$herst}
            {$land}
            {$region}
            {$weinfarbe}
            {$sorte}
            {$jahr}
            {$anzahl}
            {$punkte}
            {$ab}
            {$bis}
        </data>';

        // Schreibt den Inhalt in die Datei zurück
        $output;
        function queryDB($query) {
            $db = new eXist();
            if (!$db) {
                throw new Exception($db->getError());
            }
            # Connect
            $db->connect();
            # XQuery execution
            $db->setDebug(FALSE);
            $db->setHighlight(FALSE);
            $answer = $db->xquery($query);
            $hits = $answer["HITS"];
            if (!$answer) {
                throw new Exception($db->getError());
            }
            # Get results
            $records = "<DB>".
                "<draw>1</draw>".
                "<recordsTotal>$hits</recordsTotal>".
                "<recordsFiltered>$hits</recordsFiltered>";
            if ( !empty($answer["XML"]) ) {
                    foreach ( $answer["XML"] as $xml) {
                            $records .= $xml . "\n";
                        }
                    }
            $records .= "</DB>";
            if ($db->disconnect()) {
                throw new Exception($db->getError());
            }
            return $records;
        }
        $records;
        try {
            $records = queryDB($query);
        } catch (Exception $e) {
            echo "Error: " . $e->getMessage();
        }
        $xmlLoad = simplexml_load_string($records);
        $jsonData = json_encode($xmlLoad);
	# replace empty value brackets {} to "" (workaround)
        $output = str_replace ( "{}",'""',$jsonData);
        echo $output;

?>
