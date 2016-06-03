<?php
include ('../resources/eXist.php');

		$db = new eXist();

        # Connect
        $db->connect() or die ($db->getError());

        $query = '
		for $record in doc('."'".'/db/apps/WineDBxml/resources/WeinDB.xml'."'".')//WeinDB/Wein
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
        <tr>
            <td>{$id}</td>
            <td><a href="#" class="editName" data-pk="{$id}">{$name}</a></td>
            <td><a href="#" class="editHerst" data-pk="{$id}">{$herst}</a></td>
            <td><a href="#" class="editLand" data-pk="{$id}">{$land}</a></td>
            <td><a href="#" class="editRegion" data-pk="{$id}">{$region}</a></td>
            <td><a href="#" class="editSelectColor" data-pk="{$id}">{$weinfarbe}</a></td>
            <td class="sorteTD"><a href="#" class="editSorte" data-pk="{$id}">{$sorte}</a></td>
            <td><a href="#" class="editJahr" data-pk="{$id}">{$jahr}</a></td>
            <td><a href="#" class="editAnzahl" data-pk="{$id}">{$anzahl}</a></td>
            <td><a href="#" class="editPunkte" data-pk="{$id}">{$punkte}</a></td>
            <td><a href="#" class="editTrinkenAb" data-pk="{$id}">{$ab}</a></td>
            <td><a href="#" class="editTrinkenBis" data-pk="{$id}">{$bis}</a></td>
        </tr>
        ';

        $file = 'result.index';
		// Schreibt den Inhalt in die Datei zurück

        # XQuery execution
        $db->setDebug(FALSE);
     	$db->setHighlight(FALSE);
     	$result = $db->xquery($query) or die ($db->getError());
        # Get results
        $output = "";
                # Show results
        if ( !empty($result["XML"]) )
                foreach ( $result["XML"] as $xml)
                        $output .= $xml;

      //  $queryTime = $result["QUERY_TIME"];
      //  $collections = $result["COLLECTIONS"];


        $db->disconnect() or die ($db->getError());
				$output = "Test"
        echo json_encode($output);

?>
