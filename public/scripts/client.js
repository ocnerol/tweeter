/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(() => {

  const tweetData = {
    "user": {
      "name": "Newton",
      "avatars": "https://i.imgur.com/73hZDYK.png",
        "handle": "@SirIsaac"
      },
    "content": {
        "text": "If I have seen further it is by standing on the shoulders of giants"
      },
    "created_at": 1461116232227
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

    const tweetTextElement = `<p class="tweet-content">${text}</p>`;

    const flagIconElement = `<i class="fas tweet-actions fa-flag"></i>`;
    const retweetIconElement = `<i class="fas tweet-actions fa-retweet"></i>`;
    const heartIconElement = `<i class="fas tweet-actions fa-heart"></i>`;
    const tweetActionsElement = `<div class="tweet-actions">${flagIconElement}${retweetIconElement}${heartIconElement}</div>`;

    const createdAtElement = `<p>${created_at}</p>`;
    const footerElement = `<footer>${createdAtElement}${tweetActionsElement}</footer>`;

    const $tweetArticle = $(`<article class="tweet">${headerElement}${tweetTextElement}${footerElement}</article>`);

    return $tweetArticle;
  };
  const $tweet = createTweetElement(tweetData)
  console.log($tweet);
  $('.posted-tweets').append($tweet);

});