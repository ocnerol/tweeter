$(document).ready(function() {

  const $tweetFormTextArea = $('#tweet-text');
  const maxCharacters = $('.counter').text();
  
  $tweetFormTextArea.on('input', function(event) {
    const inputValueLength = $(this).val().length;
    const $counter = $(this).siblings().children('.counter');

    $counter.text(maxCharacters - inputValueLength);
    if ($counter.text() < 0) {
      $counter.addClass('negative-value');
    }
    if ($counter.hasClass('negative-value') && $counter.text() >= 0) {
      $counter.removeClass('negative-value');
    }
  });

});