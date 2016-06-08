<?php
  include ('../../plugins/Phexistdb/eXist.php');
  $DBPath = '/db/apps/WineDB/WeinDB.xml';

    # Update a record/row in XML Wine DB
  if (!empty($_POST['edit'])) {
      # Create XQuery Scripts from POST data with title edit
      $XQueryUpdate = createXQueryUpdate($_POST['edit']);
      $XQueryCheckUpdate = createXQueryCheck($_POST['edit']);
      if(!updateDB($XQueryUpdate,$XQueryCheckUpdate)){
          echo "[Update XML DB failed: Edit POST]";
      }
    }

    # Insert a new record/row to XML Wine DB
  if (!empty($_POST['add'])) {
    # Create XQuery Scripts from POST data with title add
    $XQueryAdd = createXQueryAdd($_POST['add']);
    $XQueryCheckAdd = createXQueryCheck($_POST['add']);
    if(!updateDB($XQueryAdd,$XQueryCheckAdd)){
        echo "[Update XML DB failed: Add POST]";
    }
  }
  if (!empty($_POST['del'])) {
    # Create XQuery Scripts from POST data with title add
    $XQueryDel = createXQueryDelete($_POST['del']);
    $XQueryNotCheck = [];
    if(!updateDB($XQueryDel,$XQueryNotCheck)){
        echo "[Update XML DB failed: Del POST]";
    }
  }

  function updateDB($XQueryUpdate,$XQueryCheckUpdate){
    $checkOK = true;
    if(empty($XQueryUpdate)){
       echo "[Error Update XQuery Array: is empty]";
       return false;
    }
    foreach($XQueryUpdate as $xQuery ){
      try{
        echo  $xQuery;
        updateValue($xQuery);
      } catch (Exception $e){
        echo "[Error update: " . $e->getMessage()."]";
        return false;
      }
    }
    foreach($XQueryCheckUpdate as $xQuery=>$value ){
      try {
        $checkOK = checkChangedValue($xQuery,$value);
      } catch (Exception $e){
        echo "[Error check: " . $e->getMessage()."]";
        return false;
      }
    }
    return $checkOK;
  }

  function createXQueryAdd($addArray) {
    $XQueryStringArray = [];
    foreach ($addArray as $id=>$wineAdd) {
      array_push($XQueryStringArray,'for $record in doc('."'".$GLOBALS["DBPath"]."'".')//WeinDB '.
      'return update insert <Wein WeinID="'.$id.'"></Wein> into $record');
      foreach($wineAdd as $key=>$value) {
        array_push($XQueryStringArray,'for $record in doc('."'".$GLOBALS["DBPath"]."'".')//WeinDB/Wein '.
        'where some $id in  $record/@WeinID satisfies $id  = "'. $id .'" '.
        'return update insert <'.$key.'>'.$value.'</'.$key.'> into $record');
      }
    }
    return $XQueryStringArray;
  }

  function createXQueryUpdate($updateArray) {
    $XQueryStringArray = [];
    foreach ($updateArray as $id=>$wineEdit) {
      foreach($wineEdit as $key=>$value) {
        array_push($XQueryStringArray,'for $record in doc('."'".$GLOBALS["DBPath"]."'".')//WeinDB/Wein '.
        'where some $id in  $record/@WeinID satisfies $id  = "'.$id.'" '.
        'return update value $record/'.$key.' with "'.$value.'"');
      }
    }
    return $XQueryStringArray;
  }

  function createXQueryCheck($checkArray) {
    $XQueryStringArray = [];
    foreach($checkArray as $id=>$wine) {
      foreach($wine as $key=>$value) {
        $string = 'for $record in doc('."'".$GLOBALS["DBPath"]."'".')//WeinDB/Wein '.
        'where some $id in  $record/@WeinID satisfies $id = "'. $id .'" '.
        'return $record/'.$key.'/text()';
        $XQueryStringArray[$string] = $value;
      }
    }
    return $XQueryStringArray;
  }

  function createXQueryDelete($delID) {
    $XQueryStringArray = [];
      array_push($XQueryStringArray,'for $record in doc('."'".$GLOBALS["DBPath"]."'".')//WeinDB/Wein '.
      'where some $id in  $record/@WeinID satisfies $id = "'.$delID .'" '.
      'return update delete $record');
    return $XQueryStringArray;
  }

  function updateValue($xQuery) {
    $db = new eXist('webmoder', 'Test2016', 'http://localhost:8080/exist/services/Query?wsdl');
    # Connect
    if (!$db->connect()) {
      echo "[Error connect XML DB to update]";
      throw new Exception($db->getError());
    }

    # Set options
    $db->setDebug(TRUE);
    $db->setHighlight(FALSE);
    # XQuery execution
    $answer = $db->xquery($xQuery);
    if (!$answer){
      if(!$db->getError() == "ERROR: No data found!"){
        echo "[Error xQuery answer to update]";
        throw new Exception($db->getError());
      }
    }

    if ($db->disconnect()) {
      throw new Exception($db->getError());
    }

  }

  function checkChangedValue($xQuery, $value) {

      $db = new eXist('webmoder', 'Test2016', 'http://localhost:8080/exist/services/Query?wsdl');

      if (!$db->connect()) {
          echo "[Error connect to XML DB to check values]";
          throw new Exception($db->getError());
      }
      # Connect
      # XQuery execution
      $db->setDebug(FALSE);
      $db->setHighlight(FALSE);
      $answer = $db->xquery($xQuery);
      if (!$answer) {
          echo "[Error xQuery answer to check values]";
          throw new Exception($db->getError());
      }

      if ($db->disconnect()) {
          throw new Exception($db->getError());
      }
        return $value == $answer["XML"];
  }

?>
