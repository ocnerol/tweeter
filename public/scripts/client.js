/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(() => {

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
    const $tweetsContainer = $('.posted-tweets');
    const $tweet = tweet => createTweetElement(tweet);
    tweetObjectsArray.forEach(tweet => {
        $tweetsContainer.append($tweet(tweet))
    });
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

    $('#error-message').remove();

    if (inputTextOnly === "") {
      $('#tweet-form').prepend($('<label for="tweet-text" id="error-message"><i class="fas fa-exclamation-circle"></i> You cannot submit an empty tweet.</label>'));
    } else if (inputTextOnly.length > 140) {
      $('#tweet-form').prepend($('<label for="tweet-text" id="error-message"><i class="fas fa-exclamation-circle"></i> Your tweet exceeds the maximum character limit :(</label>'));
    } else {
      $.ajax({
        url: '/tweets/',
        method: 'POST',
        data: inputTweet
      })
        .then((response) => {
          $('.posted-tweets').html('') // clear the html for the posted tweets container so there are no repeat tweets
          loadTweets();
        })
        .catch((error) => {
          console.log('error:', error);
        });
    }

  });
});