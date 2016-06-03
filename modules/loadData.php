<?php
include ('../resources/eXist.php');

        $query = '
        for $record in doc('."'".'/db/apps/WineDBxml/resources/WeinDB.xml'."'".')//WeinDB/Wein
        return $record';

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
                "<recordsFiltered>$hits</recordsFiltered>".
                "<data>";
            if ( !empty($answer["XML"]) ) {
                    foreach ( $answer["XML"] as $xml) {
                            $records .= $xml . "\n";
                        }
                    }
            $records .= "</data>".
            "</DB>";
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
        $output = json_encode($xmlLoad);
        echo $output;

?>
