/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(() => {
  const characterLimit = 140;
  $(".right-nav").on('click', (event) => {
    $("#tweet-text").focus();
  })
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
    $('.posted-tweets').html(''); // clear timeline; got idea to put clear timeline here instead of in ajax request thanks to @brenonparry
    const $tweetsContainer = $('.posted-tweets');
    const $tweet = tweet => createTweetElement(tweet);
    tweetObjectsArray.forEach(tweet => {
      $tweetsContainer.append($tweet(tweet));
    });
  };

  const resetTimeline = () => {
    $("#tweet-text").val(''); // clear the textarea value after submitting tweet
    $(".counter").text(characterLimit); // reset the counter back to characterLimit after submitting tweet
  };

  //renderTweets(data);

  const loadTweets = () => {
    console.log('fetching tweets ...');
    $.ajax('/tweets', { method: 'GET' })
      .then(tweets => {
        return renderTweets(tweets.reverse());
      })
      .catch(error => console.log('error:', error));
  };
  loadTweets();

  $('#tweet-form').submit(function(event) {
    event.preventDefault();
    const inputTweet = $(this).serialize();
    const inputTextStartingIndexInSerializedString = 5;
    const inputTextOnly = inputTweet.substring(inputTextStartingIndexInSerializedString);

    $('#error-message').slideUp("slow");

    if (inputTextOnly === "") {
      $('#tweet-form').prepend($('<label for="tweet-text" id="error-message"><i class="fas fa-exclamation-circle"></i> You cannot submit an empty tweet.</label>').hide());
      $('#error-message').slideDown("slow");
    } else if (inputTextOnly.length > 140) {
      $('#tweet-form').prepend($('<label for="tweet-text" id="error-message"><i class="fas fa-exclamation-circle"></i> Your tweet exceeds the maximum character limit :(</label>').hide());
      $('#error-message').slideDown("slow");
    } else {
      $.ajax({
        url: '/tweets/',
        method: 'POST',
        data: inputTweet
      })
        .then((response) => {
          resetTimeline();
          loadTweets();
        })
        .catch((error) => {
          console.log('error:', error);
        });
    }

  });
});