/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(() => {

  const createTweetElement = (tweetObject) => {
    const { user, content, created_at } = tweetObject;
    const { name, avatars, handle } = user;
    const { text } = content;
    
    const $avatar = $(`<img class="avatar" src="${avatars}">`);
    const $name = $(`<p>${name}</p>`);
    const $leftNav = $(`<div class="left-nav">${$avatar}${$name}</div>`);

    const $handle = $(`<h4>${handle}</h4>`);
    const $rightNav = $(`<div class="right-nav">${$handle}</div>`);
    const $header = $(`<header>${$leftNav}${$rightNav}</header>`);

    const $tweetText = $(`<p class="tweet-content">${text}</p>`);

    const $flagIcon = $(`<i class="fas tweet-actions fa-flag"></i>`);
    const $retweetIcon = $(`<i class="fas tweet-actions fa-retweet"></i>`);
    const $heartIcon = $(`<i class="fas tweet-actions fa-heart"></i>`);
    const $tweetActions = $(`<div class="tweet-actions">${$flagIcon}${$retweetIcon}${$heartIcon}</div>`);

    const $createdAt = $(`<p>${created_at}</p>`);
    const $footer = $(`<footer>${$tweetActions}${$createdAt}</footer>`);

    const $tweetArticle = $(`<article class="tweet">${$header}${$tweetText}${$footer}</article>`);

    return $tweetArticle;
  };

});