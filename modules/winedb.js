$(document).ready((function() {

    function getTableData() {

    }
    
    var newRecords = {};
    
    //toggle `popup` / `inline` mode
    $.fn.editable.defaults.mode = 'popup';
    $('#datatable tr > *:nth-child(1)').hide();
    
    // function button to editable mode
    // enable Edit and AddRow Button
    $('#enable').click(function() {
        $('.editable').editable('toggleDisabled');
        $('#addRow').toggle();
        $('#datatable tr > *:nth-child(1)').toggle();
        $('#test').attr("class", "app:saveTest");
        $.get("modules/loadData.php", function(data) {
        // use the result
            printTable(data);
        });
        return false;
    });

    function printTable(data) {
        
    }
    
    function createCellValue(newValue, id, classValue) {
        return '<a href="#" class="'+classValue+' editable editable-click" data-pk="'+id+'">'+newValue+'</a>';
    }
    
    function getCurrentRowCount() {
        return document.getElementById("datatable").rows.length;
    }
    
    function createTempRecordOnTable(newID) {
        var tableRecord = [newID];
        tableRecord.push(createCellValue(document.getElementById('ipName').value,newID,"editName"));
        tableRecord.push(createCellValue(document.getElementById('ipHerst').value,newID,"editHerst"));
        tableRecord.push(createCellValue(document.getElementById('ipLand').value,newID,"editLand"));
        tableRecord.push(createCellValue(document.getElementById('ipReg').value,newID,"editRegion"));
        tableRecord.push(createCellValue(document.getElementById('ipFarb').value,newID,"editSelectColor"));
        tableRecord.push(createCellValue(document.getElementById('ipSort').value,newID,"editSorte"));
        tableRecord.push(createCellValue(document.getElementById('ipJahr').value,newID,"editJahr"));
        tableRecord.push(createCellValue(document.getElementById('ipAnz').value,newID,"editAnzahl"));
        tableRecord.push(createCellValue(document.getElementById('ipPun').value,newID,"editPunkte"));
        tableRecord.push(createCellValue(document.getElementById('ipTAb').value,newID,"editTrinkenAb"));
        tableRecord.push(createCellValue(document.getElementById('ipTBis').value,newID,"editTrinkenBis"));
        
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
    
    $('#addWine').click(function() {
        var newID = getCurrentRowCount();
        
        // Add new temp row to table
        var table = $('#datatable').DataTable();
        var rowNode = table
            .row.add( createTempRecordOnTable(newID) )
            .draw()
            .node();
        $( rowNode )
            .css( 'color', 'red' )
            .animate( { color: 'black' } );
        
        newRecords[newID] = getValuesFromForm();
        
        console.log(newRecords);
        $('.editable').editable();
        $('#saveDB').toggle();
    });
    
    function saveJSON() {
        
        
        
        var data = JSON.stringify({"surname":"rees",
                "name":"tobi"
        });
        $.ajax({
            url: "modules/backend.php",
            type: "post",
            data: data,
            cache: false,
            success: function(jsonStr) {
                $("#result").text(JSON.stringify(jsonStr));
            },
            error: function(xhr, status, error) {
              var err = eval("(" + xhr.responseText + ")");
              alert(err.Message);
            }
        });
    }

    
    // hide Buttons button
    $('#addRow').hide();
    $('#saveDB').hide();
    
    // Single Cell Popup Editable
    $('.editSelectColor').editable({
        value: 0,
        source: [
              {value: 0, text: 'Rot'},
              {value: 1, text: 'Weiss'},
              {value: 2, text: 'Rosé'}
           ],
        type: 'select'
    });
    $('.editName').editable({
            type: 'text',
            url: '/post',
            title: 'Weinname',
            validate: function(value) {
                if($.trim(value) === '') {
                    return 'This field is required';
                }
            },
            tpl: "<input style='width: 200px'>"});
    $('.editHerst').editable({
            type: 'text',
            url: '/post',
            title: 'Hersteller',
            tpl: "<input style='width: 200px'>" });
    $('.editLand').editable({
            type: 'text',
            url: '/post',
            title: 'Herstellungsland',
            tpl: "<input style='width: 200px'>" });
    $('.editRegion').editable({
            type: 'text',
            url: '/post',
            title: 'Region',
            tpl: "<input style='width: 200px'>" });
    $('.editSorte').editable({
            type: 'text',
            url: '/post',
            title: 'Weinsorte',
            tpl: "<input style='width: 200px'>" });
    $('.editJahr').editable({
            type: 'number',
            url: '/post',
            title: 'Herstellungsjahr',
            tpl: "<input style='width: 100px'>" });
    $('.editAnzahl').editable({
            type: 'number',
            url: '/post',
            title: 'Anzahl Flaschen',
            tpl: "<input style='width: 100px'>" });
    $('.editPunkte').editable({
            type: 'number',
            url: '/post',
            title: 'Wertungspunkte',
            tpl: "<input style='width: 75px'>" });
    $('.editTrinkenAb').editable({
            type: 'number',
            url: '/post',
            title: 'Trinken ab',
            tpl: "<input style='width: 100px'>" });
    $('.editTrinkenBis').editable({
            type: 'number',
            url: '/post',
            title: 'Trinken bis',
            tpl: "<input style='width: 100px'>" });
            
    $('.editable').editable('toggleDisabled');
    
    // Sort and Filter
   // $('#datatable').DataTable({
    //    "paging":   false,
    //    "ordering": true,
     //   "order": [[ 4, "asc" ]],
    //    "info":     false
    //});
    
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
