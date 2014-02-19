
var serverPath = 'https://dev-scrumpoker.appspot.com';
var imagesPath = serverPath + '/images/cards/';
var iconsPath = serverPath + '/images/icons/';

var cardSchema=["0","1_2","1","2","3","5","8","13","20","40","80","100","ignore","coffee"];

function loadCardsSchema() {
  $.each( cardSchema, function( key, value ) {
    var imgPath = imagesPath + value + '.jpg';
    $('#cardsDiv').append(
     $('<img class="card" id="'+ key +'" src="'+ imgPath +'"/>')
     );
  });
}

function sharedDataUpdated() {
  updateCardsStatus();
  updateTableStatus();
  updateAverageStatus();
}

function updateAverageStatus() {
  var hiddenCards = gapi.hangout.data.getValue("hiddenCards");
  $("#averageDiv").empty();
  if (hiddenCards == "false") {
    var average = calculateAverage();
    $("#averageDiv").append(
        $('<span class="">Average:  ' + average + '</span>')
      );
  }
}

function updateTableStatus() {
  var sharedKeys = gapi.hangout.data.getState();
  var hiddenCards = gapi.hangout.data.getValue("hiddenCards");

  // FIXME: Removing all cards in the table make a blink effect. participantsDiv should be
  // updated incrementally
  var cardsInTheTable = $("#participantsDiv").append('<ul></ul>').find('ul').find('div').find('img');
  cardsInTheTable.remove();

  // Votes
  $.each( sharedKeys, function( personId, vote ) {
    if (personId != "hiddenCards") { 
      var list = $("#participantsDiv").append('<ul></ul>').find('ul');
      var imgDiv = list.find('#'+personId).find("div");
      imgDiv.empty();
      var cardImage = (hiddenCards == "false") ? cardSchema[vote] : "back";

      imgDiv.prepend(
          $('<img src="' + imagesPath + cardImage + '.jpg" />')
       );
    }
  });
}

function calculateAverage() {
    var sharedKeys = gapi.hangout.data.getState();
    var numberOfVotes = 0;
    var totalVotes = 0;
    var average = 0;

    $.each( sharedKeys, function( personId, vote ) {
      if (personId != "hiddenCards") {
        if (vote) {
          if (cardSchema[vote] == "coffee") {
            average = "Coffee";
          }
          else if (cardSchema[vote] != "ignore") {
            numberOfVotes++;
            totalVotes = totalVotes + parseInt(cardSchema[vote]);

            average = (totalVotes/numberOfVotes);
          }
        }
      }
    });
    return average;
}

function updateCardsStatus() {
  var hiddenCards = gapi.hangout.data.getValue("hiddenCards");

  if (hiddenCards == "false") {
    $(".card").unbind( "click" );
    $(".card").addClass("disabled");
  }
  else {
    $('.card').removeClass('selected');
    $('.card').removeClass('disabled');
    $('.card').click(cardClicked);
  }
}

function cardClicked() {
  // Mark card as selected
  $('.card').removeClass('selected');
  $(this).addClass('selected');
  var cardId = $(this).attr('id');

  // Set the vote in the shared Object
  var selfId = gapi.hangout.getLocalParticipant().person.id;
  gapi.hangout.data.setValue(selfId, cardId);
}


function loadParticipants() {
  var participants = gapi.hangout.getParticipants();

  var list = $("#participantsDiv").append('<ul></ul>').find('ul');
  $.each( participants, function( key, value ) {
    var personId = value.person.id;
    var connectionIcon = iconsPath + (value.hasAppEnabled ? "icon_green.png" : "icon_red.png");

    // Create new li for the new participant
    list.append('<li id="'+ value.person.id +'"> \
          <img id="connectionIcon" src="' + connectionIcon + '"/> \
          <div id="cardInTableDiv"/> \
          <span class="nickname">' + value.person.displayName  + '</span> \
          </li>');
    });
}

function reset() {
  var sharedKeys = gapi.hangout.data.getKeys();
  $.each( sharedKeys, function( key, value ) {
    gapi.hangout.data.clearValue(value);
  });
}

function showTheCards() {
  gapi.hangout.data.setValue("hiddenCards", "false");
}

function initHiddenCards () {
  var hiddenCards = gapi.hangout.data.getValue("hiddenCards");
  if (hiddenCards == 'undefined') {
    gapi.hangout.data.setValue("hiddenCards", "false");
  }
}

function createCallbacks() {
  $('.buttonCancel').click(reset);
  $('.buttonAccept').click(showTheCards);
  $('.card').click(cardClicked);

  gapi.hangout.onParticipantsChanged.add(function(eventObj) {
    // FIXME: Removing all participants makes a blink effect. participantsDiv should be
    // updated incrementally
    $("#participantsDiv").empty();

    loadParticipants();
  });
  gapi.hangout.data.onStateChanged.add(function(eventObj) {
   sharedDataUpdated();
 });

}

function init() {
  var apiReady = function(eventObj) {
    if (eventObj.isApiReady) {
      initHiddenCards();
      loadCardsSchema();
      loadParticipants();
      createCallbacks();
      sharedDataUpdated();
    }
  };

  gapi.hangout.onApiReady.add(apiReady);
}

gadgets.util.registerOnLoadHandler(init);
