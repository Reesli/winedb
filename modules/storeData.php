<?php
include ('../resources/eXist.php');

    $storeTemp.['edit']['1'] = { "Name" : "AlterTestwein",
                                "Jahrgang" : 2000}
    # Update a record/row in XML Wine DB
    if (!empty($storeTemp['edit'])) {
      # Create XQuery Scripts from POST data with title edit
      $XQueryUpdate = createXQueryUpdate($_POST['edit']);
      $XQueryCheckUpdate = createXQueryCheck($_POST['edit']);
      if(!updateDB($XQueryUpdate,$XQueryCheckUpdate)){
          echo "Some Error while updating";
      }
    } else {
      echo "No edit post recieved";
    }

    # Insert a new record/row to XML Wine DB
  if (!empty($_POST['add'])) {
    # Create XQuery Scripts from POST data with title add
    $addArray = json_decode($_POST['add']);
    foreach ($addArray as $id=>$weinAdd) {
      foreach($weinAdd as $key=>$value) {
        array_push($xqueryAdd, 'for $record in doc('."'".'/db/apps/WineDBxml/resources/WeinDB.xml'."'".')//WeinDB/Wein'.
        'where some $id in $record/@WeinID staisfies $id = "'. $id .'"'.
        'return update value $record/'.$key.' with "'.$value.'""');
      }
    }
  } else {
    echo "nothing add post";
  }

function updateDB($XQueryUpdate,$XQueryCheckUpdate){
  $checkOK = true;
  foreach($XQueryUpdate as $xQuery ){
    updateValue($xQuery);
  }
  foreach($XQueryCheckUpdate as $xQuery=>$value ){
    if(!checkUpdatedValue($xQuery,$value)){
      $checkOK = false;
    }
  }
  return $checkOK;
}

function createXQueryUpdate($updateArray) {
  $XQueryStringArray = [];
  foreach ($updateArray as $id=>$weinEdit) {
    foreach($weinEdit as $key=>$value) {
      array_push($XQueryStringArray, 'for $record in doc('."'".'/db/apps/WineDBxml/resources/WeinDB.xml'."'".')//WeinDB/Wein'.
      'where some $id in $record/@WeinID staisfies $id = "'. $id .'"'.
      'return update value $record/'.$key.' with "'.$value.'"');
    }
  }
  return $XQueryStringArray;
}

function createXQueryCheck($updateArray) {
  $XQueryStringArray = [];
  foreach ($updateArray as $id=>$weinEdit) {
    foreach($weinEdit as $key=>$value) {
      $XQueryStringArray['for $record in doc('."'".'/db/apps/WineDBxml/resources/WeinDB.xml'."'".')//WeinDB/Wein'.
      'where some $id in $record/@WeinID staisfies $id = "'. $id .'"'.
      'return $record/'.$key.'/text()'] = $value;
    }
  }
  return $XQueryStringArray;
}

  function updateValue($xQuery) {
      $db = new eXistAdmin('admin', '32pommes', 'http://127.0.0.1:8080/exist/services/Admin?wsdl');
      # Connect
      if (!$db->connect()) {
        throw new Exception($db->getError());
      }

      # Set options
      $db->setDebug(FALSE);
      $db->setHighlight(FALSE);
      # XQuery execution
      if (!$db->xquery($xQuery)){
        throw new Exception($db->getError());
      }
  }

  function checkUpdatedValue($xQuery, $value) {

      $db = new eXistAdmin('admin', '32pommes', 'http://127.0.0.1:8080/exist/services/Admin?wsdl');

      if (!$db->connect()) {
          throw new Exception($db->getError());
      }
      # Connect
      # XQuery execution
      $db->setDebug(FALSE);
      $db->setHighlight(FALSE);
      $answer = $db->xquery($xQuery);
      if (!$answer) {
          throw new Exception($db->getError());
      }

      if ($db->disconnect()) {
          throw new Exception($db->getError());
      }
        return $value == $answer;
  }

?>
