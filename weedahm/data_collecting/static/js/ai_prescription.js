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

function generateData() {
    return [Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)]
}

function update_point_number(datasets) {
    $('#point-damzuk').html(datasets[0])
    $('#point-sohwa').html(datasets[1])
    $('#point-sinkyung').html(datasets[2])
    $('#point-soonhwan').html(datasets[3])
    $('#point-guitar').html(datasets[4])
    $('#point-tukjung').html(datasets[5])
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
        chart.data.datasets.forEach(function (datasets) {
            datasets.data = generateData()
        })
        chart.update();
        update_point_number(chart.data.datasets[0].data)
    })
});