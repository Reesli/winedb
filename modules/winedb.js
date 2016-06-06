$(document).ready((function() {

  // Init Datatables plugin and load data from XML DB via loadData.php
  var table = $('#datatable').DataTable({
    "processing": true,
       "serverSide": false,
       "ajax": {
           "url": "modules/loadData.php",
           "type": "POST",
           "dataType": "json",
           "contentType": "application/json; charset=utf-8"
       },
       "columns": [
           { "data": "WeinID" },
           { "data": "Name" },
           { "data": "Hersteller" },
           { "data": "Land" },
           { "data": "Region" },
           { "data": "Traubensorte" },
           { "data": "Weinfarbe" },
           { "data": "Jahrgang" },
           { "data": "Anzahl" },
           { "data": "Punkte" },
           { "data": "TrinkenAb"},
           { "data": "TrinkenBis" },
       ],
       "paging": false,
       "ordering": true,
       "order": [[ 6, "asc" ]],
       "info": false,
       "language": {
          "search": "Filter: "
       },
       "columnDefs": [
         {
             "targets": [ 0 ],
             "visible": false,
             "searchable": false
         }
     ]
  })

  // Enable "select datatable row"
  $('#datatable tbody').on( 'click', 'tr', function () {
       if ( $(this).hasClass('selected') ) {
           $(this).removeClass('selected');
       }
       else {
           table.$('tr.selected').removeClass('selected');
           $(this).addClass('selected');
       }
     });

    // Click Edit Wine button to start "edit modal form"
    $('#editRow').click(function() {
        $('#editForm').bootstrapValidator('resetForm', true);
        var rowData = table.row('.selected').data()
        if(rowData == null){
          bootbox.alert("Select a row to edit!", function() {});
        } else {
          fillModalWithRowData(rowData);
        }
    });

    // Click Edit button to start post function
    $('#edWine').click(function(){
       postEditWine();
     });

    // Click Add Wine button to start "add modal form"
    $('#addRow').click(function() {
      $('#addForm').bootstrapValidator('resetForm', true);
      $("#addModalForm").modal();
    });

     // Click Add button to start post function
     $('#addWine').click(function(){
       var bootstrapValidator = $("#addForm").data('bootstrapValidator');
       bootstrapValidator.validate();
       if(bootstrapValidator.isValid()) {
         postAddWine();
       }

     });

    // Click Delete button to get confirm delete
    $('#delWine').click(function() {
      confirmDelete(delWine);
    });

    // Click Show ID button to show or hide WeinID column
    $('#showID').click(function() {
      if($('#showID').hasClass('active')) {
        $(this).removeClass('active');
        table.column( 0 ).visible( false );
      } else if (!$('#showID').hasClass('active')) {
        $(this).addClass('active');
        table.column( 0 ).visible( true );
      }
    });

// Add function section
    // Get highest value in WeinID column
    function getMaxID() {
      var colID = table.column( 0 ).data();
      return Math.max.apply(null,colID);
    }

    // Get values from "add modal form" and put in json
    function getAddValues() {
        var newID = getMaxID() + 1;
        var newRecord = { 'add' : {}};
        newRecord['add'][newID] = {};
        newRecord['add'][newID]['Name'] = $('#addName').val();
        newRecord['add'][newID]['Hersteller'] = $('#addHerst').val();
        newRecord['add'][newID]['Land'] = $('#addLand').val();
        newRecord['add'][newID]['Region'] = $('#addReg').val();
        newRecord['add'][newID]['Weinfarbe'] = $('#addFarb').val();
        newRecord['add'][newID]['Traubensorte'] = $('#addSort').val();
        newRecord['add'][newID]['Jahrgang'] = $('#addJahr').val();
        newRecord['add'][newID]['Anzahl'] = $('#addAnz').val();
        newRecord['add'][newID]['Punkte'] = $('#addPun').val();
        newRecord['add'][newID]['TrinkenAb'] = $('#addTAb').val();
        newRecord['add'][newID]['TrinkenBis'] = $('#addTBis').val();
        return newRecord;
      };

      // Post addForm to XML DB via storeData.php
      function postAddWine() {
        var addData = getAddValues();
        $.ajax({
          type: 'post',
          url: 'modules/storeData.php',
          dataType: 'json',
          data: addData
        });
       // wait 1.5s to be sure that all columns are written
       // in database before reload table
       setTimeout(function(){
               $('#addModalForm').modal('hide');
               table.ajax.reload();}, 1500);
      };

// Edit function section
    // Get updated values from "edit modal form" and put in json
    function getEditValues() {
      var rowData = table.row('.selected').data();
      var WeinID = rowData['WeinID'];
      var editRecord =  {'edit': {}};
      editRecord['edit'][WeinID] = {};
      if($("#edName").val() != rowData['Name']){ editRecord['edit'][WeinID]['Name'] = $("#edName").val()};
      if($("#edHerst").val() != rowData['Hersteller']){ editRecord['edit'][WeinID]['Hersteller'] = $("#edHerst").val()};
      if($("#edLand").val() != rowData['Land']){ editRecord['edit'][WeinID]['Land'] = $("#edLand").val()};
      if($("#edReg").val() != rowData['Region']){ editRecord['edit'][WeinID]['Region'] = $("#edReg").val()};
      if($("#edFarb").val() != rowData['Weinfarbe']){ editRecord['edit'][WeinID]['Weinfarbe'] = $("#edFarb").val()};
      if($("#edSort").val() != rowData['Traubensorte']){ editRecord['edit'][WeinID]['Traubensorte'] = $("#edSort").val()};
      if($("#edJahr").val() != rowData['Jahrgang']){ editRecord['edit'][WeinID]['Jahrgang'] = $("#edJahr").val()};
      if($("#edAnz").val() != rowData['Anzahl']){ editRecord['edit'][WeinID]['Anzahl'] = $("#edAnz").val()};
      if($("#edPun").val() != rowData['Punkte']){ editRecord['edit'][WeinID]['Punkte'] = $("#edPun").val()};
      if($("#edTAb").val() != rowData['TrinkenAb']){ editRecord['edit'][WeinID]['TrinkenAb'] = $("#edTAb").val()};
      if($("#edTBis").val() != rowData['TrinkenBis']){ editRecord['edit'][WeinID]['TrinkenBis'] = $("#edTBis").val()};
      var key, count = 0;
      for(key in editRecord['edit'][WeinID]) {
         if(editRecord['edit'][WeinID].hasOwnProperty(key)) {
            count++;
         }
      }
      editRecord['size'] = count;
      return editRecord;
    }

    // Fill "edit modal form" with data from selected row
    function fillModalWithRowData(rowData) {
      $("#edName").val(rowData['Name']);
      $("#edHerst").val(rowData['Hersteller']);
      $("#edLand").val(rowData['Land']);
      $("#edReg").val(rowData['Region']);
      $("#edFarb").val(rowData['Weinfarbe']);
      $("#edSort").val(rowData['Traubensorte']);
      $("#edJahr").val(rowData['Jahrgang']);
      $("#edAnz").val(rowData['Anzahl']);
      $("#edPun").val(rowData['Punkte']);
      $("#edTAb").val(rowData['TrinkenAb']);
      $("#edTBis").val(rowData['TrinkenBis']);
      $("#editModalForm").modal();
    }

    // Post editForm to XML DB via storeData.php
    function postEditWine() {
      var editData = getEditValues();
      if(editData['size'] > 0) {
        $.ajax({
          type: 'post',
          url: 'modules/storeData.php',
          dataType: 'json',
          data: editData
        });
        // wait 1.5s to be sure that all columns are written
        // in database before reload table
        setTimeout(function(){
                $('#editModalForm').modal('hide');
                table.ajax.reload();}, 1500);
      } else {
        bootbox.alert("Nothing edited!", function() {
        });
      }
    };

// Delete function section

    // Get WeinID from selected row
    function getIdToDel(){
      var rowData = table.row('.selected').data();
      var WeinID = rowData['WeinID'];
      var editRecord =  {'del': WeinID};
      return editRecord;
    }

    // Show confirm box before post delete
    function confirmDelete() {
      var rowData = table.row('.selected').data();
      weinName = rowData['Name'];
      bootbox.dialog({
       title: 'Confirm delete',
       message: 'Der Wein: "' + weinName + '" wird gelöscht!',
       buttons: {
         cancel: {
           label: 'Cancel',
           className: 'btn-default',
           callback: function() {
             $('#editModalForm').modal();
           }
         },
         delete: {
           label: 'DELETE',
           className: 'btn-danger',
           callback: function() {
             postDelWine();
           }
       }
     }
     })
    };

    // Post ID to delete to XML DB via storeData.php
    function postDelWine() {
      var delData = getIdToDel();
      $.ajax({
        type: 'post',
        url: 'modules/storeData.php',
        dataType: 'json',
        data: delData
      });
      // wait 1.5s to be sure that all columns are written
      // in database before reload table
      setTimeout(function(){
          $('#editModalForm').modal('hide');
          table.ajax.reload();}, 1500);
      };

    // Validator AddRow
    $("#addForm").bootstrapValidator({
        framework: 'bootstrap',
        excluded: ':disabled',
        icon: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            weinname: {
                validators: {
                    notEmpty: {
                        message: 'Der Weinname fehlt.'
                    }
                }
            },
            hersteller: {
                validators: {
                    notEmpty: {
                        message: 'Der Hersteller fehlt.'
                    }
                }
            },
            land: {
                validators: {
                    notEmpty: {
                        message: 'Das Herstellungsland fehlt.'
                    }
                }
            },
            region: {
                validators: {
                    notEmpty: {
                        message: 'Die Region fehlt.'
                    }
                }
            },
            sorte: {
                validators: {
                    notEmpty: {
                        message: 'Die Weinsorte(n) fehlen.'
                    }
                }
            },
            jahr: {
                validators: {
                    notEmpty: {
                        message: 'Der Jahrgang fehlt.'
                    },
                    greaterThan: {
                        value: 0,
                        message: 'Der Jahrgang muss grösser als 0 sein.'
                    }
                }
            },
            anzahl: {
                validators: {
                    notEmpty: {
                        message: 'Anzahl Flaschen fehlt'
                    },
                    greaterThan: {
                        value: -1,
                        message: 'Anzahl Flaschen muss 0 oder grösser sein.'
                    }
                }
            },
            punkte: {
                validators: {
                    between: {
                        min: 1,
                        max: 10,
                        message: 'Die Punktewertung muss von 1 bis 10 sein.'
                    }
                }
            }
        }
    })
    .on('error.field.bv', function(e, data) {
            data.bv.disableSubmitButtons(true); // disable submit buttons on errors
        })
    .on('status.field.bv', function(e, data) {
            data.bv.disableSubmitButtons(false); // enable submit buttons on valid
    });

    // Validator EditRow
    $("#editForm").bootstrapValidator({
        framework: 'bootstrap',
        excluded: ':disabled',
        icon: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            weinname: {
                validators: {
                    notEmpty: {
                        message: 'Der Weinname fehlt.'
                    }
                }
            },
            hersteller: {
                validators: {
                    notEmpty: {
                        message: 'Der Hersteller fehlt.'
                    }
                }
            },
            land: {
                validators: {
                    notEmpty: {
                        message: 'Das Herstellungsland fehlt.'
                    }
                }
            },
            region: {
                validators: {
                    notEmpty: {
                        message: 'Die Region fehlt.'
                    }
                }
            },
            sorte: {
                validators: {
                    notEmpty: {
                        message: 'Die Weinsorte(n) fehlen.'
                    }
                }
            },
            jahr: {
                validators: {
                    notEmpty: {
                        message: 'Der Jahrgang fehlt.'
                    },
                    greaterThan: {
                        value: 0,
                        message: 'Der Jahrgang muss grösser als 0 sein.'
                    }
                }
            },
            anzahl: {
                validators: {
                    notEmpty: {
                        message: 'Anzahl Flaschen fehlt'
                    },
                    greaterThan: {
                        value: -1,
                        message: 'Anzahl Flaschen muss 0 oder grösser sein.'
                    }
                }
            },
            punkte: {
                validators: {
                    between: {
                        min: 1,
                        max: 10,
                        message: 'Die Punktewertung muss von 1 bis 10 sein.'
                    }
                }
            }
        }
    })
    .on('error.field.bv', function(e, data) {
            data.bv.disableSubmitButtons(true); // disable submit buttons on errors
        })
    .on('status.field.bv', function(e, data) {
            data.bv.disableSubmitButtons(false); // enable submit buttons on valid
    });
}));
