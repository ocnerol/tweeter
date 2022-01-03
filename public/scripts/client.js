/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */


$(document).ready(() => {
  const characterLimit = 140;
  const tenPercentWindowHeight = ($(window).height() * .10);
  $('#to-top').hide();

  $(window).scroll(function() {
    if ($(document).scrollTop() > tenPercentWindowHeight) {
      $('#to-top').show();
      $('#navbar-compose').hide();
    } else {
      $('#to-top').hide();
      $('#navbar-compose').show();
    }
  });

  $('#to-top').on('click', () => {
    $(document).scrollTop(0);
    $('.new-tweet').slideDown('slow');
    $('.new-tweet').removeClass('hidden');
    $("#tweet-text").focus();
  })

  // toggle new-tweet form hiding when clicking 'Write a new tweet' in right-navbar
  // and set focus on textarea in form
  $(".toggle-compose").on('click', (event) => {
    if ($('.new-tweet').hasClass('hidden')) {
      $('.new-tweet').removeClass('hidden');
      $('.new-tweet').slideDown('slow');
      $("#tweet-text").focus();
    } else {
      $('.new-tweet').slideUp('slow');
      $('.new-tweet').addClass('hidden');
    }
  })

  // function to escape XSS in tweet form data
  const escape = function(str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  const createTweetElement = (tweetObject) => {
    const { user, content, created_at } = tweetObject;
    const { name, avatars, handle } = user;
    const { text } = content;

    const avatarElement = `<img class="avatar" src="${avatars}">`;
    const nameElement = `<p>${name}</p>`;
    const leftNavElement = `<div class="left-nav">${avatarElement}${nameElement}</div>`;

    const handleElement = `<h4>${handle}</h4>`;
    const rightNavElement = `<div class="right-nav">${handleElement}</div>`;
    const headerElement = `<header>${leftNavElement}${rightNavElement}</header>`;

    const tweetTextElement = `<p class="tweet-content">${escape(text)}</p>`;

    const flagIconElement = `<i class="fas tweet-actions fa-flag"></i>`;
    const retweetIconElement = `<i class="fas tweet-actions fa-retweet"></i>`;
    const heartIconElement = `<i class="fas tweet-actions fa-heart"></i>`;
    const tweetActionsElement = `<div class="tweet-actions">${flagIconElement}${retweetIconElement}${heartIconElement}</div>`;

    const createdAtElement = `<p>${timeago.format(created_at)}</p>`;
    const footerElement = `<footer>${createdAtElement}${tweetActionsElement}</footer>`;

    const $tweetArticle = $(`<article class="tweet">${headerElement}${tweetTextElement}${footerElement}</article>`);

    return $tweetArticle;
  };

  const renderTweets = (tweetObjectsArray) => {
    // clear timeline; got idea to put clear timeline here instead of in ajax request thanks to @brenonparry
    $('.posted-tweets').html('');
    
    const $tweetsContainer = $('.posted-tweets');
    const $tweet = tweet => createTweetElement(tweet);

    // add each tweet object to DOM within tweets container
    tweetObjectsArray.forEach(tweet => {
      $tweetsContainer.append($tweet(tweet));
    });
  };

  // fetch tweets stored in database
  const loadTweets = () => {
    $.ajax('/tweets', { method: 'GET' })
      .then(tweets => {
        return renderTweets(tweets.reverse()); // reverse tweets array since it is sorted from oldest to newest by default
      })
      .catch(error => console.log('error:', error));
  };
  
  // fetch all stored tweets upon page load
  loadTweets();

  const resetForm = () => {
    $("#tweet-text").val(''); // clear the textarea value after submitting tweet
    $(".counter").text(characterLimit); // reset the counter back to characterLimit after submitting tweet
  };

  // event handler when a new tweet submission event happens
  $('#tweet-form').submit(function(event) {
    event.preventDefault();

    const inputTweet = $(this).serialize();
    const inputText = $(this).children('#tweet-text').val() // figured out how to get text value with help from @lucyshen7

    // slide any existing error message out of view before displaying new error messages or making successful submission
    $('#error-message').slideUp("slow");

    // form validation checks
    if (inputText === "") { // checks if form input has no content
      // display relevant error message with a slideDown animation
      $('#tweet-form').prepend($('<label for="tweet-text" id="error-message"><i class="fas fa-exclamation-circle"></i> You cannot submit an empty tweet.</label>').hide());
      $('#error-message').slideDown("slow");
    } else if (inputText.length > 140) { // checks if form input exceeds character limit
      // display relevant error message with a slideDown animation
      $('#tweet-form').prepend($('<label for="tweet-text" id="error-message"><i class="fas fa-exclamation-circle"></i> Your tweet exceeds the maximum character limit :(</label>').hide());
      $('#error-message').slideDown("slow");
    } else { // input form passed validation checks, make Ajax POST request to submit tweet to the server
      $.ajax({
        url: '/tweets/',
        method: 'POST',
        data: inputTweet
      })
        .then((response) => {
          resetForm();  // reset the form to its original state
          loadTweets(); // reload all stored tweets (including newly submitted tweet)
        })
        .catch((error) => {
          console.log('error:', error);
        });
    }
  });
});