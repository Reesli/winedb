<?php
include ('../resources/eXist.php');
    $xqueryEdit = [];
    $xqueryAdd = [];
    if (!empty($_POST['edit'])) {
      $editArray = json_decode()$_POST['edit']);
      foreach ($editArray as $weinEdit=>$id) {
        foreach($weinEdit as $key=>$value) {
          array_push($xqueryEdit, 'for $record in doc('."'".'/db/apps/WineDBxml/resources/WeinDB.xml'."'".')//WeinDB/Wein'.
          'where some $id in $record/@WeinID staisfies $id = "'. $id .'"'.
          'return update value $record/'.$key.' with '.$value);
        }
      }
      echo array_values( $xqueryEdit );
    } else {
      echo "nothing edit post"
    }
    if (!empty($_POST['add'])) {
      $addArray = json_decode()$_POST['add']);
      foreach ($addArray as $weinAdd=>$id) {
        foreach($weinAdd as $key=>$value) {
          array_push($xqueryAdd, 'for $record in doc('."'".'/db/apps/WineDBxml/resources/WeinDB.xml'."'".')//WeinDB/Wein'.
          'where some $id in $record/@WeinID staisfies $id = "'. $id .'"'.
          'return update value $record/'.$key.' with '.$value);
        }
      }
      echo array_values( $xqueryAdd );
  } else {
    echo "nothing add post"
  }
?>
