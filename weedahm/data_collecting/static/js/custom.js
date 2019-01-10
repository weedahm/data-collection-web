function get_table_row(medicine, gram) {
    var tbl = '';
    tbl += '<tr class="prescriptions">';
    tbl += '<td style="width: 50%;" value="' + medicine + '">' + medicine + '</td>'
    tbl += '<td class="dose" style="width: 25%;" value="' + gram + '">' + gram + '</td>'
    tbl += '<td style="width: 25%;"><button type="button" class="close"><span class="fa fa-close"></span></button></td>'
    tbl += '</tr>'
    return tbl
}

function init_datatimepicker() {
    $('.input-daterange').datepicker({
        format: "yyyy/mm/dd",
        language: "kr"
    });
}

function init_vaild_check() {
    $("#input-chart-id").on("change paste keyup", function () {
        var set_chart = function (entry) {
            for (const [key, value] of Object.entries(entry)) {
                var target = $('[name=' + key + ']')
                if (target[0].type == 'text') {
                    target[0].value = value;
                } else if (target[0].type == 'checkbox') {
                    target[0].checked = value
                } else if (target[0].type == 'radio') {
                    if (target[0].value == value) {
                        target[0].checked = true
                    } else if (target[1].value == value) {
                        target[1].checked = true
                    }
                } else {
                    target.val(value)
                }
            }
        }
        var set_prescription = function (entry) {
            $('.prescription').find('tbody').empty()
            for (const [key, value] of Object.entries(entry)) {
                var tokens = key.split("_")
                switch (tokens[0]) {
                    case '처방1':
                        $tbody
                        $('.prescription.first').find('tbody').append(get_table_row(tokens[1], value))
                        break;
                    case '처방2':
                        $('.prescription.second').find('tbody').append(get_table_row(tokens[1], value))
                        break;
                    case '처방3':
                        $('.prescription.third').find('tbody').append(get_table_row(tokens[1], value))
                        break;
                }
            }
            var $tbody = $('.prescription').find('tbody')
            $tbody.find('button.close').on('click', function () {
                $(this).closest('tr').remove()
                sumDoses()
            })
            sumDoses()
        }
        var chart_id = $(this).val()
        if (chart_id.length == 8) {
            $.ajax({
                url: '/patient/' + chart_id,
                type: "GET",
                dataType: "json"
            }).done(function (response) {
                if(response.last_modified != null) {
                    $('.modified-date').attr('hidden', false)
                    $('#last-modified-date').html(response.last_modified)
                }
                if (response.basic_info != null) {
                    set_chart(response.basic_info)
                }
                if (response.bodychart != null) {
                    set_chart(response.bodychart)
                }
                if (response.abdominal != null) {
                    set_chart(response.abdominal)
                }
                if (response.eav != null) {
                    set_chart(response.eav)
                }
                if (response.tongue != null) {
                    set_chart(response.tongue)
                }
                if (response.prescription != null) {
                    set_prescription(response.prescription)
                }
                if ($.isEmptyObject(response)) {
                    $('.prescription').find('tbody').empty()
                    $('#patient-data-submit')[0].reset()
                    $('#input-chart-id').val(chart_id)
                }
            }).always(function (response) {
                // console.log(response)
            });
        }
    });

    $("#input-age").on("change paste keyup", function () {
        var age = $(this).val()
        if (age > 150 || age < 0) {
            $(this).addClass('is-invalid');
        } else {
            $(this).removeClass('is-invalid');
        }
    });

    $("#input-height").on("change paste keyup", function () {
        var height = $(this).val()
        if (height > 300 || height < 0) {
            $(this).addClass('is-invalid');
        } else {
            $(this).removeClass('is-invalid');
        }
    });

    $("#input-weight").on("change paste keyup", function () {
        var weight = $(this).val()
        if (weight > 300 || weight < 0) {
            $(this).addClass('is-invalid');
        } else {
            $(this).removeClass('is-invalid');
        }
    });

    $("#input-blood-high").on("change paste keyup", function () {
        var blood = $(this).val()
        if (blood > 200) {
            $(this).addClass('is-invalid');
        } else {
            $(this).removeClass('is-invalid');
        }
    });

    $("#input-blood-low").on("change paste keyup", function () {
        var blood = $(this).val()
        if (blood < 50) {
            $(this).addClass('is-invalid');
        } else {
            $(this).removeClass('is-invalid');
        }
    });

    $(".bodychart").on("change paste keyup", function () {
        var a = $(this).val()
        if (a > 6) {
            $(this).addClass('is-invalid');
            $(this).css("color", "#BF091C")
        } else {
            $(this).removeClass('is-invalid');
            $(this).css("color", "")
        }
    });
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');

function init_jq_post() {
    $("#patient-data-submit").submit(function (event) {
        event.preventDefault();
        $('#submit-btn').val("저장 중")
        $('#submit-btn').removeClass('btn-info').addClass('btn-secondary disabled')
        $('#submit-btn').children(".fa").addClass('fa-refresh fa-spin')
        var job_done = function () {
            $('#submit-btn').val("저장하기")
            $('#submit-btn').removeClass('btn-primary btn-danger disabled').addClass('btn-info')
            $('#submit-btn').children(".fa").removeClass('fa-refresh fa-spin')
        }

        var $form = $(this);
        url = $form.attr("action");

        var chart_id = $form.find("input[name='id']").val();

        var basic_info = {}
        $.each($('.basic_info'), function (_, value) {
            basic_info[value.name] = value.value
        })

        var bodychart = {}
        $.each($('.bodychart'), function (_, value) {
            if (value.type == 'text') {
                bodychart[value.name] = value.value
            } else if (value.type == 'checkbox') {
                bodychart[value.name] = value.checked
            } else if (value.type == 'radio') {
                if (value.checked) {
                    bodychart[value.name] = value.value
                }
            }
        })

        var abdominal = {}
        $.each($('.abdominal'), function (_, value) {
            abdominal[value.name] = value.value
        })

        var eav = {}
        $.each($('.eav'), function (_, value) {
            eav[value.name] = value.value
        })

        var tongue = {}
        $.each($('.tongue'), function (_, value) {
            if (value.type == 'checkbox') {
                tongue[value.name] = value.checked
            } else if (value.type == 'radio') {
                if (value.checked) {
                    tongue[value.name] = value.value
                }
            }
        })

        var prescription = {}
        $.each($('.prescriptions'), function (_, value) {
            var category = $(this).closest('.prescription').find('h5').attr('value')
            var name = value.children.item(0).innerHTML
            var gram = value.children.item(1).innerHTML
            prescription[category + '_' + name] = gram
        })

        var payload = JSON.stringify({
            chart_id: chart_id,
            basic_info: basic_info,
            bodychart: bodychart,
            abdominal: abdominal,
            eav: eav,
            tongue: tongue,
            prescription: prescription
        });

        $.ajax({
            url: url,
            type: "POST",
            headers: {
                'X-CSRFToken': csrftoken
            },
            data: payload,
        }).done(function (response) {
            $('#submit-btn').removeClass('btn-secondary disabled').addClass('btn-primary')
            $('#submit-btn').children(".fa").removeClass('fa-refresh fa-spin')
            if(response == "Save Success") {
                $('#submit-btn').val("저장성공!")
            } else if(response == "Already Created") {
                $('#submit-btn').val("저장실패!")
                $(".modal__created-by-anoter-user").modal('show')
            }
        }).fail(function (error) {
            $('#submit-btn').removeClass('btn-secondary disabled').addClass('btn-danger')
            $('#submit-btn').children(".fa").removeClass('fa-refresh fa-spin')
            $('#submit-btn').val("저장실패!")
        }).always(function () {
            setTimeout(job_done, 1500)
            init_get_patient_list()
        });
    });
}

function init_get_patient_list() {
    var $list = $(document).find('.list-patient')
    $list.empty()
    $.ajax({
        url: '/patients/',
        type: "GET",
        dataType: "json"
    }).done(function (response) {
        $.each(response, function (_, value) {
            $.each(value, function (_, val) {
                var a_list = document.createElement('a')
                a_list.className = 'list-group-item list-group-item-action'
                a_list.setAttribute('role', 'tab')
                a_list.setAttribute('href', val)
                a_list.setAttribute('data-toggle', 'list')
                a_list.textContent = val
                $list.append(a_list)
            })
        })
        $('#patientList a').on('click', function (e) {
            e.preventDefault()
            $('#patient-data-submit')[0].reset()
            $('#input-chart-id').val($(this).attr('href'))
            $('#input-chart-id').trigger('change')
        })
    }).fail(function (response) {
        console.log("fail")
    })
}

function init_events() {
    $('#delete-btn').on('click', function () {
        var chart_id = $('#input-chart-id').val()
        $('#deleteModalLabel').html('차트번호: ' + chart_id)
        $('#deleteId').val(chart_id)
    });

    $('.pre-btn').on('click', function () {
        var $prescription = $(this).closest('.prescription')
        var $tbody = $prescription.find('tbody')
        var medicine = $(this).closest('.form-row').find('select').val()
        var gram = $(this).closest('.form-row').find('input').val()
        if (gram == '') {
            $(this).closest('.form-row').find('input').addClass('is-invalid')
        } else {
            $(this).closest('.form-row').find('input').removeClass('is-invalid')
            $tbody.append(get_table_row(medicine, gram))
            $tbody.find('button.close').on('click', function () {
                $(this).closest('tr').remove()
                sumDoses()
            })
            sumDoses()
        }
    })
}

function sumDoses() {
    $.each($('.prescription'), function () {
        var currentDose = 0;
        $sum = $(this).find('span.sum')
        $doses = $(this).find('td.dose')
        $.each($doses, function (_, value) {
            currentDose += Number(value.innerHTML)
        })
        $sum.html(currentDose)
    })
}

$(document).ready(function ($) {
    init_datatimepicker();
    init_vaild_check();
    init_jq_post();
    init_get_patient_list();
    init_events();
});