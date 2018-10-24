var totalQuestionCount

function setProgress(index) {
    var $progressBar = $('.progress .progress-bar')
    percentage = parseInt((index/totalQuestionCount) * 100)
    $progressBar.css({width: percentage+'%'})
}

function moveToQuestion(index) {
    var $newSlide = $('.question[data-question-index="'+ index +'"]')
    $newSlide.removeClass('hidden').addClass('visible')
    var $newGif = $('.gif_bottom[data-question-index="'+ index +'"]')
    $newGif.removeClass('hidden').addClass('visible')
    setProgress(index)
}

$(document).on('click', '.move-backward-btn', function() {
    var $currentQuestion = $('.question.visible')
    var $currentGif = $('.gif_bottom.visible')
    var currentQuestionIndex = parseInt($currentQuestion.attr('data-question-index'))
    if(currentQuestionIndex == 1) return
    $currentQuestion.addClass('hidden').removeClass('visible')
    $currentGif.addClass('hidden').removeClass('visible')
    moveToQuestion(currentQuestionIndex - 1);
})

$(document).on('click', '.move-forward-btn', function() {
    var $currentQuestion = $('.question.visible')
    var $currentGif = $('.gif_bottom.visible')
    var currentQuestionIndex = parseInt($currentQuestion.attr('data-question-index'))
    if(currentQuestionIndex == totalQuestionCount) return
    $currentQuestion.addClass('hidden').removeClass('visible')
    $currentGif.addClass('hidden').removeClass('visible')
    moveToQuestion(currentQuestionIndex + 1);
})

$(document).ready(function(){
    totalQuestionCount = parseInt($('.question.last').attr('data-question-index'))
    setProgress(1)
}) 