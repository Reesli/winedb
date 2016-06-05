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
           { "data": "TrinkenAb", DefaultContent: '' },
           { "data": "TrinkenBis" },
       ],
     "paging":   false,
     "ordering": true,
     "order": [[ 5, "asc" ]],
     "info":     false,
     "columnDefs": [
         {
             "targets": [ 0 ],
             "visible": false,
             "searchable": false
         }
     ]
  })

  // Buttons section
  $('#datatable tbody').on( 'click', 'tr', function () {
       if ( $(this).hasClass('selected') ) {
           $(this).removeClass('selected');
       }
       else {
           table.$('tr.selected').removeClass('selected');
           $(this).addClass('selected');
       }
   } );

    // function button to edit row
    $('#editRow').click(function() {
        $('#editForm').bootstrapValidator('resetForm', true);
        var rowData = table.row('.selected').data()
        if(rowData == null){
	         alert("Select a row to edit!")
        } else {
          fillModalWithRowData(rowData);
        }

    });

    // Save editForm to XML DB via storeData.php
    $('#editForm').on('submit', function (e) {
       e.preventDefault();
       var editData = getEditValues();
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
     });

     // Save editForm to XML DB via storeData.php
     $('#addForm').on('submit', function (e) {
        e.preventDefault();
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
               $('#editModalForm').modal('hide');
               table.ajax.reload();}, 1500);

      });

    $('#addRow').click(function() {
      getMaxID();
      $("#addModalRow").modal();
      $('#addForm').bootstrapValidator('validate');
    });

    $('#delWine').click(function() {
      var delData = deleteRow();
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
    });

    $('#showID').click(function() {
      if($('#showID').hasClass('active')) {
        $(this).removeClass('active');
        $('#datatable tr > *:nth-child(0)').hide();
      } else if (!$('#showID').hasClass('active')) {
        $(this).addClass('active');
        $('#datatable tr > *:nth-child(0)').show();
      }
    });



    // function section
    function getMaxID() {
      var colID = table.column( 0 ).data();
      return Math.max.apply(null,colID);
    }

    function getAddValues() {
        var newID = getMaxID() + 1;
        var newRecord = { "add" : newID};
        newRecord[newID] = {"Name":$("#ipName").val(),
                            "Hersteller":$("#ipHerst").val(),
                            "Land":$("#ipLand").val(),
                            "Region":$("#ipReg").val(),
                            "Weinfarbe":$("#ipFarb").val(),
                            "Traubensorte":$("#ipSort").val(),
                            "Jahrgang":$("#ipJahr").val(),
                            "Anzahl":$("#ipAnz").val(),
                            "Punkte":$("#ipPun").val(),
                            "TrinkenAb":$("#ipTAb").val(),
                            "TrinkenBis":$("#ipTBis").val()}
        return newRecord;
      };

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

    function deleteRow(){
      var rowData = table.row('.selected').data();
      var WeinID = rowData['WeinID'];
      var editRecord =  {'del': WeinID};
      return editRecord;
    }

    // Validator AddRow
    $("#addForm").bootstrapValidator({
        framework: 'bootstrap',
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
