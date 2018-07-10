function init_datatimepicker() {
    $('.input-daterange').datepicker({
        format: "yyyy/mm/dd",
        language: "kr"
    });
}

function init_vaild_check() {
    $("#input-age").on("change paste keyup", function() {
        var age = $(this).val()
        if (age > 120) {
            $(this).addClass('is-invalid');
        } else {
            $(this).removeClass('is-invalid');
        }
     });
}

$(document).ready(function ($) {
    init_datatimepicker();
    init_vaild_check();

    var ajax_data = [{
            pName: "첩약1",
            amount: "0.0000",
            numOfTime: "1",
            days: "1",
            text: "none"
        },
        {
            pName: "첩약2",
            amount: "7.6000",
            numOfTime: "1",
            days: "1",
            text: "none"
        },
        {
            pName: "첩약3",
            amount: "14.0000",
            numOfTime: "2",
            days: "1",
            text: "none"
        },
        {
            pName: "첩약4",
            amount: "8.5000",
            numOfTime: "1",
            days: "1",
            text: "none"
        },
        {
            pName: "첩약5",
            amount: "13.0000",
            numOfTime: "1",
            days: "1",
            text: "none"
        },
        {
            pName: "첩약6",
            amount: "1.5000",
            numOfTime: "1",
            days: "1",
            text: "none"
        },
        {
            pName: "첩약7",
            amount: "5.0000",
            numOfTime: "1",
            days: "1",
            text: "none"
        },
        {
            pName: "첩약8",
            amount: "38.0000",
            numOfTime: "1",
            days: "1",
            text: "none"
        },
        {
            pName: "첩약9",
            amount: "14.0000",
            numOfTime: "2",
            days: "1",
            text: "none"
        },
        {
            pName: "첩약10",
            amount: "2.0000",
            numOfTime: "1",
            days: "1",
            text: "none"
        },
        {
            pName: "첩약11",
            amount: "12.0000",
            numOfTime: "1",
            days: "1",
            text: "none"
        },
        {
            pName: "첩약12",
            amount: "7.0000",
            numOfTime: "1",
            days: "1",
            text: "none"
        },
        {
            pName: "첩약13",
            amount: "9.0000",
            numOfTime: "1",
            days: "1",
            text: "none"
        },
        {
            pName: "첩약14",
            amount: "2.0000",
            numOfTime: "1",
            days: "1",
            text: "none"
        },
        {
            pName: "첩약15",
            amount: "1.0000",
            numOfTime: "1",
            days: "1",
            text: "none"
        },
        {
            pName: "첩약16",
            amount: "1.7000",
            numOfTime: "2",
            days: "1",
            text: "none"
        },
        {
            pName: "첩약17",
            amount: "16.0000",
            numOfTime: "1",
            days: "1",
            text: "none"
        },
        {
            pName: "첩약18",
            amount: "1.0000",
            numOfTime: "1",
            days: "1",
            text: "none"
        },
        {
            pName: "첩약19",
            amount: "1.8000",
            numOfTime: "1",
            days: "1",
            text: "none"
        },

    ]



    var random_id = function () {
        var id_num = Math.random().toString(9).substr(2, 3);
        var id_str = Math.random().toString(36).substr(2);

        return id_num + id_str;
    }


    //--->create data table > start
    var tbl = '';
    tbl += '<table class="table table-hover table-striped">'

    //--->create table header > start
    tbl += '<thead>';
    tbl += '<tr>';
    tbl += '<th>처방명칭</th>';
    tbl += '<th>용량</th>';
    tbl += '<th>횟수</th>';
    tbl += '<th>일수</th>';
    tbl += '<th>혈명/첩/팩</th>';
    tbl += '</tr>';
    tbl += '</thead>';
    //--->create table header > end


    //--->create table body > start
    tbl += '<tbody>';

    //--->create table body rows > start
    $.each(ajax_data, function (index, val) {
        //you can replace with your database row id
        var row_id = random_id();

        //loop through ajax row data
        tbl += '<tr row_id="' + row_id + '">';
        tbl += '<td scope="col"><div class="row_data" edit_type="click" col_name="pName">' + val['pName'] + '</div></td>';
        tbl += '<td><div class="row_data" edit_type="click" col_name="amount">' + val['amount'] + '</div></td>';
        tbl += '<td><div class="row_data" edit_type="click" col_name="numOfTime">' + val['numOfTime'] + '</div></td>';
        tbl += '<td><div class="row_data" edit_type="click" col_name="days">' + val['days'] + '</div></td>';
        tbl += '<td><div class="row_data" edit_type="click" col_name="text">' + val['text'] + '</div></td>';
        //--->edit options > end
        tbl += '</tr>';
    });

    //--->create table body rows > end

    tbl += '</tbody>';
    //--->create table body > end

    tbl += '</table>'
    //--->create data table > end

    //out put table data
    $(document).find('.section-prescription-table').html(tbl);

    $(document).find('.btn_save').hide();
    $(document).find('.btn_cancel').hide();


    //--->make div editable > start
    $(document).on('click', '.row_data', function (event) {
        event.preventDefault();

        if ($(this).attr('edit_type') == 'button') {
            return false;
        }

        //make div editable
        $(this).closest('div').attr('contenteditable', 'true');
        //add bg css

        $(this).focus();
    })
    //--->make div editable > end


    //--->save single field data > start
    $(document).on('focusout', '.row_data', function (event) {
        event.preventDefault();

        if ($(this).attr('edit_type') == 'button') {
            return false;
        }

        var row_id = $(this).closest('tr').attr('row_id');

        var row_div = $(this)
            .removeClass('bg-warning') //add bg css
            .css('padding', '')

        var col_name = row_div.attr('col_name');
        var col_val = row_div.html();

        var arr = {};
        arr[col_name] = col_val;

        //use the "arr"	object for your ajax call
        $.extend(arr, {
            row_id: row_id
        });

        //out put to show
        $('.post_msg').html('<pre class="bg-success">' + JSON.stringify(arr, null, 2) + '</pre>');

    })
    //--->save single field data > end


    //--->button > edit > start
    $(document).on('click', '.btn_edit', function (event) {
        event.preventDefault();
        var tbl_row = $(this).closest('tr');

        var row_id = tbl_row.attr('row_id');

        tbl_row.find('.btn_save').show();
        tbl_row.find('.btn_cancel').show();

        //hide edit button
        tbl_row.find('.btn_edit').hide();

        //make the whole row editable
        tbl_row.find('.row_data')
            .attr('contenteditable', 'true')
            .attr('edit_type', 'button')
            .css('padding', '3px')

        //--->add the original entry > start
        tbl_row.find('.row_data').each(function (index, val) {
            //this will help in case user decided to click on cancel button
            $(this).attr('original_entry', $(this).html());
        });
        //--->add the original entry > end

    });
    //--->button > edit > end


    //--->button > cancel > start
    $(document).on('click', '.btn_cancel', function (event) {
        event.preventDefault();

        var tbl_row = $(this).closest('tr');

        var row_id = tbl_row.attr('row_id');

        //hide save and cacel buttons
        tbl_row.find('.btn_save').hide();
        tbl_row.find('.btn_cancel').hide();

        //show edit button
        tbl_row.find('.btn_edit').show();

        //make the whole row editable
        tbl_row.find('.row_data')
            .attr('edit_type', 'click')
            .removeClass('bg-warning')
            .css('padding', '')

        tbl_row.find('.row_data').each(function (index, val) {
            $(this).html($(this).attr('original_entry'));
        });
    });
    //--->button > cancel > end


    //--->save whole row entery > start
    $(document).on('click', '.btn_save', function (event) {
        event.preventDefault();
        var tbl_row = $(this).closest('tr');

        var row_id = tbl_row.attr('row_id');


        //hide save and cacel buttons
        tbl_row.find('.btn_save').hide();
        tbl_row.find('.btn_cancel').hide();

        //show edit button
        tbl_row.find('.btn_edit').show();


        //make the whole row editable
        tbl_row.find('.row_data')
            .attr('edit_type', 'click')
            .removeClass('bg-warning')
            .css('padding', '')

        //--->get row data > start
        var arr = {};
        tbl_row.find('.row_data').each(function (index, val) {
            var col_name = $(this).attr('col_name');
            var col_val = $(this).html();
            arr[col_name] = col_val;
        });
        //--->get row data > end

        //use the "arr"	object for your ajax call
        $.extend(arr, {
            row_id: row_id
        });

        //out put to show
        $('.post_msg').html('<pre class="bg-success">' + JSON.stringify(arr, null, 2) + '</pre>')


    });
    //--->save whole row entery > end
});