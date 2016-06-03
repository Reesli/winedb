<?php
include ('../resources/eXist.php');

        $query = '
        for $record in doc('."'".'/db/apps/WineDBxml/resources/WeinDB.xml'."'".')//WeinDB/Wein
<<<<<<< .merge_file_bVOiU6
        return $record';

=======
        let $id := $record/@WeinID/string()
        let $name := $record/Name/text()
        let $herst := $record/Hersteller/text()
        let $land := $record/Land/text()
        let $region := $record/Region/text()
        let $weinfarbe := $record/Weinfarbe/text()
        let $sorte := $record/Traubensorte/text()
        let $jahr := $record/Jahrgang/text()
        let $anzahl := $record/Anzahl/text()
        let $punkte := $record/Punkte/text()
        let $ab := $record/TrinkenAb/text()
        let $bis := $record/TrinkenBis/text()
        return
          { "ID": "{$id}",
            "Weinname": "$name",
            "Hersteller": "{$herst}",
            "Herstellungsland": "{$land}",
            "Region": "{$region}",
            "Weinfarbe": "{$weinfarbe}",
            "Traubensorte": "{$sorte}",
            "Jahrgang": "{$jahr}",
            "Anzahl": "{$anzahl}",
            "Wertung": "{$punkte}",
            "TrinkenAb": "{$ab}",
            "TrinkenBis": "{$bis}"
          }';
>>>>>>> .merge_file_ro8OeZ
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
            if (!$answer) {
                throw new Exception($db->getError());
<<<<<<< .merge_file_bVOiU6
            } 
            # Get results
            $records = "<WeinDB>";
            if ( !empty($answer["XML"]) ) {
                    foreach ( $answer["XML"] as $xml) {
                            $records .= $xml . "\n";
                        }
                    }
            $records .= "</WeinDB>";
=======
            }

            # Get results
            $records = '{
              "data" : [ ';
            if ( !empty($answer["XML"]) ) {
                    foreach ( $answer["XML"] as $xml) {
                      if ($xml === end($answer)){
                        $records .= $xml
                      }
                        else {
                            $records .= $xml . ",";
                            }
                        }
                    }
            $records .= ' ]}';
>>>>>>> .merge_file_ro8OeZ
            if ($db->disconnect()) {
                throw new Exception($db->getError());
            }
            return $records;
<<<<<<< .merge_file_bVOiU6
        } 
        $records;
=======
        }

>>>>>>> .merge_file_ro8OeZ
        try {
            $records = queryDB($query); 
        } catch (Exception $e) {
            echo "Error: " . $e->getMessage();
        }
<<<<<<< .merge_file_bVOiU6
        $xmlLoad = simplexml_load_string($records);
        $output = json_encode($xmlLoad);
=======

>>>>>>> .merge_file_ro8OeZ
        echo $output;
?>
