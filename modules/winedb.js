$(document).ready((function() {


  var storeTemp = {"add": [],
                    "edit":[]};
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

    // function button to editable mode
    // enable Edit and AddRow Button
    $('#edit').click(function() {
        var rowData = table.row('.selected').data()
        if(rowData == null){
	alert("Select a row to edit!")
        } else {
          editRow(rowData)
        }

    });

    $('#addWine').click(function() {
        var newID = getCurrentRowCount();

        // Add new temp row to table
      //  var table = $('#datatable').DataTable();
    //    var rowNode = table
      //      .row.add( createTempRecordOnTable(newID) )
      //      .draw()
        //    .node();
      //  $( rowNode )
        //    .css( 'color', 'red' )
        //    .animate( { color: 'black' } );

        var testID = '1'
        var newID = 1
        storeTemp.edit[testID]= { "Name" : "Testwein",
                                  "Jahrgang" : 2005
                                }
        storeTemp.add[newID]= { "Name" : "Neuerwein",
                                  "Jahrgang" : 2323
                                }

        $('#saveDB').toggle();
    });
      $('#saveDB').click() {
        saveJSON()
      }

    // hide Buttons button
    $('#addRow').hide();
    $('#saveDB').hide();


    //functions
    function editRow(rowData) {
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

    function getValuesFromForm() {
        var newRecord = { "weinname":document.getElementById('ipName').value,
                        "hersteller":document.getElementById('ipHerst').value,
                        "land":document.getElementById('ipLand').value,
                        "region":document.getElementById('ipReg').value,
                        "farbe":document.getElementById('ipFarb').value,
                        "sorte":document.getElementById('ipSort').value,
                        "jahr":document.getElementById('ipJahr').value,
                        "anzahl":document.getElementById('ipAnz').value,
                        "punkte":document.getElementById('ipPun').value,
                        "trinkab":document.getElementById('ipTAb').value,
                        "trinkbis":document.getElementById('ipTBis').value
        };

        return newRecord;
    }



    function saveJSON() {
        $.ajax({
            url: "modules/storeData.php",
            type: "post",
            data: storeTemp,
            cache: false,
            success: function(res) {
                    console.log(res)
                    },
            error: function () {
                $('#status').html('Failed').slideDown();
            }
        });
    }

    // Validator AddRow
    $("#wineform").bootstrapValidator({
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
            farbe: {
                validators: {
                    notEmpty: {
                        message: 'Die Weinfarbe fehlt.'
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
    });
}));
