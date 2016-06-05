<?php
include ('../resources/eXist.php');

    # Update a record/row in XML Wine DB
    if (!empty($_POST['edit'])) {
      # Create XQuery Scripts from POST data with title edit
      echo count($_POST['edit']);
      echo $_POST['edit']['Name'];
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
        'where some $id in  $record/@WeinID satisfies $id = "'. $id .'"'.
        'return update value $record/'.$key.' with "'.$value.'""');
      }
    }
  } else {
    echo "nothing add post";
  }

function updateDB($XQueryUpdate,$XQueryCheckUpdate){
  $checkOK = true;
  echo "update";
  foreach($XQueryUpdate as $xQuery ){
    try{
      updateValue($xQuery);
    } catch (Exception $e){
      echo "Error update: " . $e->getMessage();
    }
  }
  foreach($XQueryCheckUpdate as $xQuery=>$value ){
    try {
     $checkOK = checkUpdatedValue($xQuery,$value);
    } catch (Exception $e){
      echo "Error check: " . $e->getMessage();
    }


    }

  return $checkOK;
}

function createXQueryUpdate($updateArray) {
  $XQueryStringArray = [];
  foreach ($updateArray as $id=>$weinEdit) {
    foreach($weinEdit as $key=>$value) {
      array_push($XQueryStringArray,'for $record in doc('."'".'/db/apps/WineDBxml/resources/WeinDB.xml'."'".')//WeinDB/Wein '.
      'where some $id in  $record/@WeinID satisfies $id  = "'. $id .'" '.
      'return update value $record/'.$key.' with "'.$value.'"');
    }
  }
  return $XQueryStringArray;
}

function createXQueryCheck($updateArray) {
  $XQueryStringArray = [];
  foreach($updateArray as $id=>$weinEdit) {
    foreach($weinEdit as $key=>$value) {
      $string = 'for $record in doc('."'".'/db/apps/WineDBxml/resources/WeinDB.xml'."'".')//WeinDB/Wein '.
      'where some $id in  $record/@WeinID satisfies $id = "'. $id .'" '.
      'return $record/'.$key.'/text()';
      $XQueryStringArray[$string] = $value;
    }
  }
  return $XQueryStringArray;
}

  function updateValue($xQuery) {
      $db = new eXist('webmoder', 'Test2016', 'http://localhost:8080/exist/services/Query?wsdl');
      # Connect
      if (!$db->connect()) {
        throw new Exception($db->getError());
        echo "error connect update";
      }

      # Set options
      $db->setDebug(FALSE);
      $db->setHighlight(FALSE);
      # XQuery execution
      $answer = $db->xquery($xQuery);
      if (!$answer){
        if(!$db->getError() == "ERROR: No data found!"){
          throw new Exception($db->getError());
          echo "error answer update";
        }
      }

       if ($db->disconnect()) {
          throw new Exception($db->getError());
      }

  }

  function checkUpdatedValue($xQuery, $value) {

      $db = new eXist('webmoder', 'Test2016', 'http://localhost:8080/exist/services/Query?wsdl');

      if (!$db->connect()) {
          throw new Exception($db->getError());
          echo "error connect check";
      }
      # Connect
      # XQuery execution
      $db->setDebug(FALSE);
      $db->setHighlight(FALSE);
      $answer = $db->xquery($xQuery);
      if (!$answer) {
          throw new Exception($db->getError());
          echo "error answer check";
      }


      if ($db->disconnect()) {
          throw new Exception($db->getError());
      }
        return $value == $answer["XML"];
  }

?>
