$(document).ready(function() {

  const $tweetFormTextArea = $('#tweet-text');
  const maxCharacters = $('.counter').text();
  
  $tweetFormTextArea.on('input', function(event) {
    const inputValueLength = $(this).val().length;
    const $counter = $(this).siblings().children('.counter');
    
    $counter.text(maxCharacters - inputValueLength);
  });

});