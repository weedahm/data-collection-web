// const MLAPI_ADDRESS = 'http://192.168.0.8:80'
const MLAPI_ADDRESS = 'http://127.0.0.1:8001'

const get_paitent_list = async () => {
    let results
    try {
        results = await $.ajax({
            url: '/patients/',
            type: "GET",
            dataType: "json"
        })
        return results
    } catch (jqXHR) {
        if (jqXHR.status == 401) {
            throw 'get_paitent_list, unauthorize error'
        } else {
            throw 'get_paitent_list, unknown error'
        }
    }
}

const get_paitent_basic_info = async (chart_id) => {
    let results
    try {
        results = await $.ajax({
            url: '/patient/' + chart_id,
            type: "GET",
            dataType: "json"
        })
        return results.basic_info
    } catch (jqXHR) {
        if (jqXHR.status == 401) {
            throw 'get_paitent_basic_info, unauthorize error'
        } else {
            throw 'get_paitent_basic_info, unknown error'
        }
    }
}

const get_paitent_all = async (chart_id) => {
    let results
    try {
        results = await $.ajax({
            headers: {
                accept: "application/json",
            },
            url: '/patient/' + chart_id,
            type: "GET",
            dataType: "json",
            contentType: "application/json",
        })
        return results
    } catch (jqXHR) {
        if (jqXHR.status == 401) {
            throw 'get_paitent_all, unauthorize error'
        } else {
            throw 'get_paitent_all, unknown error'
        }
    }
}

const request_hexa_point = async (paitent_info) => {
    let results
    try {
        results = await $.ajax({
            url: MLAPI_ADDRESS + '/hexa_point',
            type: "POST",
            data: JSON.stringify(paitent_info),
            dataType: "json",
            contentType: "application/json",
        })
        return results
    } catch (jqXHR) {
        if (jqXHR.status == 401) {
            throw 'request_hexa_point, unauthorize error'
        } else {
            throw 'request_hexa_point, unknown error'
        }
    }
}

function init_chart() {
    var ctx = document.getElementsByClassName("content__right__ai-point__chart")[0].getContext('2d');
    var chart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ["담적", "소화", "신경", "순환", "기타", "특정"],
            datasets: [{
                backgroundColor: "rgba(3, 88, 106, 0.2)",
                borderColor: "rgba(3, 88, 106, 0.80)",
                pointBorderColor: "rgba(3, 88, 106, 0.80)",
                pointBackgroundColor: "rgba(3, 88, 106, 0.80)",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(220,220,220,1)",
            }]
        },
        options: {
            legend: {
                display: false
            },
            scale: {
                ticks: {
                    beginAtZero: true,
                    max: 100
                },
                pointLabels: {
                    fontSize: 16
                },
            },
            responsive: true,
            maintainAspectRatio: false,
        }
    });
    return chart;
}

function update_point_number(datasets) {
    $('#point-damzuk').html(datasets[0])
    $('#point-sohwa').html(datasets[1])
    $('#point-sinkyung').html(datasets[2])
    $('#point-soonhwan').html(datasets[3])
    $('#point-guitar').html(datasets[4])
    $('#point-tukjung').html(datasets[5])
}

function add_drugs(target_id, drug_name, drug_cap) {
    var new_item = ""
    new_item += '<div class="list-group-item list-group-item-action">'
    new_item += '<span class="content__right__ai-medicine__list__item--tag">' + drug_name + '</span>'
    new_item += '<div><span class="content__right__ai-medicine__list__item--gram">' + drug_cap + '</span><span class="content__right__ai-medicine__list__item--tag"> mg</span></div>'
    new_item += '</div>'
    $("#" + target_id).append(new_item)
}

$(document).ready(function ($) {
    get_paitent_list().then((response) => {
        var $list = $('.list-patient')
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
    })

    $('.list-patient').on('click', '.list-group-item', function () {
        $('#input-chart-id').val($(this).attr('href'))
        get_paitent_basic_info($(this).attr('href')).then((basic_info) => {
            $('#input-gender').val(basic_info.gender)
            $('#input-age').val(basic_info.age)
            $('#input-height').val(basic_info.height)
            $('#input-weight').val(basic_info.weight)
            $('#input-blood-high').val(basic_info.blood_high)
            $('#input-blood-low').val(basic_info.blood_low)
        })
    })
    const chart = init_chart()
    $('.content__right__patient-info__btn .btn').on('click', function () {
        const chart_id = $('#input-chart-id').val()
        if (chart_id == "") {
            return
        }
        const origin_btn_html = $(this).html()
        $(this).html('<i class="fas fa-spinner fa-spin"></i>')
        $(this).toggleClass('btn-primary btn-secondary')
        get_paitent_all(chart_id).then((paitent_info) => {
            request_hexa_point(paitent_info).then((result) => {
                $(this).html(origin_btn_html)
                $(this).toggleClass('btn-secondary btn-primary')
                if (result.SCORE) {
                    chart.data.datasets.forEach(function (datasets) {
                        datasets.data = [
                            result.SCORE.담적,
                            result.SCORE.소화,
                            result.SCORE.신경,
                            result.SCORE.순환,
                            result.SCORE.기타,
                            result.SCORE.특정,
                        ]
                    })
                    chart.update();
                    update_point_number(chart.data.datasets[0].data)
                }
                var set1 = document.getElementById("drug-set-1");
                var set2 = document.getElementById("drug-set-2");
                var set3 = document.getElementById("drug-set-3");
                while (set1.firstChild) {
                    set1.removeChild(set1.firstChild);
                }
                while (set2.firstChild) {
                    set2.removeChild(set2.firstChild);
                }
                while (set3.firstChild) {
                    set3.removeChild(set3.firstChild);
                }
                if (result.SET) {
                    if (result.SET.SET1) {
                        for (const [key, value] of Object.entries(result.SET.SET1)) {
                            add_drugs("drug-set-1", key, value)
                        }
                    }
                    if (result.SET.SET2) {
                        for (const [key, value] of Object.entries(result.SET.SET2)) {
                            add_drugs("drug-set-2", key, value)
                        }
                    }
                    if (result.SET.SET3) {
                        for (const [key, value] of Object.entries(result.SET.SET3)) {
                            add_drugs("drug-set-3", key, value)
                        }
                    }
                }

            }).catch((reason) => {
                $(this).html(origin_btn_html)
                $(".modal__request-error").modal('show')
                $(this).toggleClass('btn-secondary btn-primary')
            })
        })
    })
});