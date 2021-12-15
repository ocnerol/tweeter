$(document).ready(function() {

  const $tweetFormTextArea = $('#tweet-text');
  
  $tweetFormTextArea.on('input', function(event) {
    console.log($(this).val().length);
  });

});