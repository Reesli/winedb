$(document).ready((function() {

  // Sort and Filter
  var table = $('#datatable').DataTable({
    "processing": true,
       "serverSide": false,
       "ajax": {
           "url": "modules/loadData.php",
           "type": "POST"
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
           { "data": "TrinkenAb" },
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
  });

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
        var rowData = table.row('.selected').data()
        if(rowData == null){
	         alert("Select a row to edit!")
        } else {
          fillModalWithRowData(rowData);
        }

    });

    $('#edWine').click(function() {
      if(count(getEditValues()) > 0) {
        console.log(getEditValues())
      } else {
        console.log("nix geladen");
      }

      //saveJSON(getEditValues());
    });

    $('#addRow').click(function() {
      $("#addModalRow").modal();
      $('#addForm').bootstrapValidator('validate');
    });

    $('#addWine').click(function() {
        var newID = getCurrentRowCount();
        saveJSON(storeTemp);
      });

    // hide Buttons button
  //  $('#saveDB').hide();


    //functions
    function fillModalWithRowData(rowData) {
      $("#edName").val(rowData['Name'])
      $("#edHerst").val(rowData['Hersteller'])
      $("#edLand").val(rowData['Land'])
      $("#edReg").val(rowData['Region'])
      $("#edFarb").val(rowData['Weinfarbe'])
      $("#edSort").val(rowData['Traubensorte'])
      $("#edJahr").val(rowData['Jahrgang'])
      $("#edAnz").val(rowData['Anzahl'])
      $("#edPun").val(rowData['Punkte'])
      $("#edTAb").val(rowData['TrinkenAb'])
      $("#edTBis").val(rowData['TrinkenBis'])
      $("#editModalForm").modal()
    }

    function getCurrentRowCount() {
        return document.getElementById("datatable").rows.length;
    }

    function createTempRecordOnTable(newID) {
        var tableRecord = [newID];
        tableRecord.push(document.getElementById('ipName').value);
        tableRecord.push(document.getElementById('ipHerst').value);
        tableRecord.push(document.getElementById('ipLand').value);
        tableRecord.push(document.getElementById('ipReg').value);
        tableRecord.push(document.getElementById('ipFarb').value);
        tableRecord.push(document.getElementById('ipSort').value);
        tableRecord.push(document.getElementById('ipJahr').value);
        tableRecord.push(document.getElementById('ipAnz').value);
        tableRecord.push(document.getElementById('ipPun').value);
        tableRecord.push(document.getElementById('ipTAb').value);
        tableRecord.push(document.getElementById('ipTBis').value);

        return tableRecord;
    }

    function getAddValues() {
        var newRecord = { "Name":document.getElementById('ipName').value,
                        "Hersteller":document.getElementById('ipHerst').value,
                        "Land":document.getElementById('ipLand').value,
                        "Region":document.getElementById('ipReg').value,
                        "Weinfarbe":document.getElementById('ipFarb').value,
                        "Traubensorte":document.getElementById('ipSort').value,
                        "Jahrgang":document.getElementById('ipJahr').value,
                        "Anzahl":document.getElementById('ipAnz').value,
                        "Punkte":document.getElementById('ipPun').value,
                        "TrinkenAb":document.getElementById('ipTAb').value,
                        "TrinkenBis":document.getElementById('ipTBis').value
        };

        return newRecord;
    }
    function getEditValues() {
      var rowData = table.row('.selected').data()
      var editRecord = {"edit": []}
      if($("#edName").val() != rowData['Name']){ editRecord['edit'] = {'Name':$("#edName").val()}};
      if($("#edHerst").val() != rowData['Hersteller']){ editRecord['edit'] = {'Hersteller':$("#edHerst").val()}};
      if($("#edLand").val() != rowData['Land']){ editRecord['edit'] = {'Land':$("#edLand").val()}};
      if($("#edReg").val() != rowData['Region']){ editRecord['edit'] = {'Region':$("#edReg").val()}};
      if($("#edFarb").val() != rowData['Weinfarbe']){ editRecord['edit'] = {'Weinfarbe':$("#edFarb").val()}};
      if($("#edSort").val() != rowData['Traubensorte']){ editRecord['edit'] = {'Traubensorte':$("#edSort").val()}};
      if($("#edJahr").val() != rowData['Jahrgang']){ editRecord['edit'] = {'Jahrgang':$("#edJahr").val()}};
      if($("#edAnz").val() != rowData['Anzahl']){ editRecord['edit'] = {'Anzahl':$("#edAnz").val()}};
      if($("#edPun").val() != rowData['Punkte']){ editRecord['edit'] = {'Punkte':$("#edPun").val()}};
      if($("#edTAb").val() != rowData['TrinkenAb']){ editRecord['edit'] = {'TrinkenAb':$("#edTAb").val()}};
      if($("#edTBis").val() != rowData['TrinkenBis']){ editRecord['edit'] = {'TrinkenBis':$("#edTBis").val()}};
      return editRecord['edit'];
    }



    function saveJSON(storeData) {
        $.ajax({
            url: "modules/storeData.php",
            type: "POST",
            data: storeData,
            success: function(res) {
                    console.log(res);
                    },
            error : function(data)
                {
                console.log(data);
                }
        });
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
                    },
                    different: {
                        field: 'weinname',
                        message: 'Keine Änderung.'
                    }
                }
            },
            hersteller: {
                validators: {
                    notEmpty: {
                        message: 'Der Hersteller fehlt.'
                    },
                    different: {
                        field: 'hersteller',
                        message: 'Keine Änderung.'
                    }
                }
            },
            land: {
                validators: {
                    notEmpty: {
                        message: 'Das Herstellungsland fehlt.'
                    },
                    different: {
                        field: 'land',
                        message: 'Keine Änderung.'
                    }
                }
            },
            region: {
                validators: {
                    notEmpty: {
                        message: 'Die Region fehlt.'
                    },
                    different: {
                        field: 'region',
                        message: 'Keine Änderung.'
                    }
                }
            },
            farbe: {
                validators: {
                    different: {
                        field: 'farbe',
                        message: 'Keine Änderung.'
                    }
                }
            },
            sorte: {
                validators: {
                    notEmpty: {
                        message: 'Die Weinsorte(n) fehlen.'
                    },
                    different: {
                        field: 'sorte',
                        message: 'Keine Änderung.'
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
                    },
                    different: {
                        field: 'jahr',
                        message: 'Keine Änderung.'
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
                    },
                    different: {
                        field: 'anzahl',
                        message: 'Keine Änderung.'
                    }
                }
            },
            punkte: {
                validators: {
                    between: {
                        min: 1,
                        max: 10,
                        message: 'Die Punktewertung muss von 1 bis 10 sein.'
                    },
                    different: {
                        field: 'punkte',
                        message: 'Keine Änderung.'
                    }
                }
            },
            trinkenab: {
                validators: {
                    between: {
                        min: 1,
                        max: 10,
                        message: 'Die Punktewertung muss von 1 bis 10 sein.'
                    },
                    different: {
                        field: 'trinkenab',
                        message: 'Keine Änderung.'
                    }
                }
            },
            trinkenbis: {
                validators: {
                    between: {
                        min: 1,
                        max: 10,
                        message: 'Die Punktewertung muss von 1 bis 10 sein.'
                    },
                    different: {
                        field: 'trinkenbis',
                        message: 'Keine Änderung.'
                    }
                }
            }
        }
    })
    .on('err.field.bv', function(e, data) {
        if (data.fv.getSubmitButton()) {
            data.fv.disableSubmitButtons(false);
        }
    })
    .on('success.field.bv', function(e, data) {
        if (data.fv.getSubmitButton()) {
            data.fv.disableSubmitButtons(false);
        }
    });
}));
