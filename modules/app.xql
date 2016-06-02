xquery version "3.0";

module namespace app="http://winedb.resgear.ch/templates";

import module namespace templates="http://exist-db.org/xquery/templates" ;
import module namespace config="http://winedb.resgear.ch/config" at "config.xqm";
declare namespace request="http://exist-db.org/xquery/request";

declare variable $app:SESSION := "app:results";

(:~
 : This is a sample templating function. It will be called by the templating module if
 : it encounters an HTML element with an attribute data-template="app:test" 
 : or class="app:test" (deprecated). The function has to take at least 2 default
 : parameters. Additional parameters will be mapped to matching request or session parameters.
 : 
 : @param $node the HTML node with the attribute which triggered this call
 : @param $model a map containing arbitrary data - used to pass information between template calls
 :)

declare function app:createTableHeader($node as node(), $model as map(*)){
    <th style="display:none;">ID</th>,
    <th>Weinname</th>,
    <th>Hersteller</th>,
    <th>Herstellungsland</th>,
    <th>Region</th>,
    <th>Weinfarbe</th>,
    <th>Weinsorte</th>,
    <th>Jahrgang</th>,
    <th>Anzahl</th>,
    <th>Wertung</th>,
    <th>Trinken ab</th>,
    <th>Trinken bis</th>
};

declare function app:fillBodyData($node as node(), $model as map(*)){
      for $record in doc('/db/apps/WineDBxml/resources/WeinDB.xml')//WeinDB/Wein
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
};
declare function app:getNewRecord($node as node()*, $model as map(*)) {
    let $n1 := request:get-parameter("hersteller", "")
    let $n2 := request:get-parameter("weinname", "")
    return <p>{$n1}</p>
};


