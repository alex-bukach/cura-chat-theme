/* This script is called when the connection to the chat server (now.js) has been established */
(function ($) {
  var chatStatus = {};

  // The following callback is called by the server in order to
  // advertise its status.
  now.updateStatus = function (attributes) {
    chatStatus = attributes;
    $(window).trigger('opekaChatStatusUpdate', [attributes]);
  };

  // When the DOM is ready, set up the widget.
  $(function () {
    var statusTab = $('.status-tab'),
        chatButton = $('#join-pair-chat');

    chatButton.hide();

    // Updates the actual status text.
    var updateDisplay = function (attributes) {

     //For debugging...
      var debugchat = false;
      if (debugchat) {
        statusTab.removeClass('chat-busy chat-open').addClass('chat-closed');
        statusTab.text("Closed");
        chatButton.hide();
        return;
      }

      // If chat is open and there are active one-to-one rooms (chat open).
      if (chatStatus.chatOpen && chatStatus.rooms && chatStatus.rooms.pair.active > 0) {
        statusTab.removeClass('chat-closed chat-busy').addClass('chat-open');
        statusTab.text("Open");
        chatButton.show();
      // If not, it might be busy? Check if chat app is open (chat busy).
      } else if (chatStatus.chatOpen && chatStatus.rooms) {
        statusTab.removeClass('chat-closed chat-open').addClass('chat-busy');
        statusTab.text("Busy");
        chatButton.hide();
      // The chat app is closed or now.js is unreachable (chat closed / no now.js).
      } else {
        statusTab.removeClass('chat-busy chat-open').addClass('chat-closed');
        statusTab.text("Closed");
        chatButton.hide();
      }

     };
     
    // When the document is ready, update the status, and bind the event
    // to have it update automatically later.
    $(window).bind('opekaChatStatusUpdate', updateDisplay);
    
    // When the user clicks the button, ask the chat server to join a room.
    chatButton.click(function () {
      if(!$.browser.opera){
        var w = open_window('_blank', baseURL+'/opeka', 600, 700);
      } else {
        window.parent.location = baseURL+"/chat-on-opera";
      }

      now.getDirectSignInURL('pair', function (signInURL) {
        if (!(chatStatus.rooms && chatStatus.rooms.pair.active > 0) && !(chatStatus.rooms && chatStatus.rooms.pair.full > 0)) {
          w.close();
          window.location = baseURL;
        }
        else {
          w.location = signInURL;
        }
      });
    });

    // Run updateDisplay once manually so we have the initial text
    // nailed down.
    updateDisplay();
  });
}(jQuery));

// Build pop-up window
function open_window(window_name,file_name,width,height) {
  parameters = "width=" + width;
  parameters = parameters + ",height=" + height;
  parameters = parameters + ",status=no";
  parameters = parameters + ",resizable=no";
  parameters = parameters + ",scrollbars=no";
  parameters = parameters + ",menubar=no";
  parameters = parameters + ",toolbar=no";
  parameters = parameters + ",directories=no";
  parameters = parameters + ",location=no";

  vindue = window.open(file_name,window_name,parameters);
  return vindue;
}
