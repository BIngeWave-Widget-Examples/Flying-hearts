let wiggleContainerID = BWProperties.namespace + '_' + BWProperties.participant.account_id  +  '_wiggle_container';

let wiggleButtonID = BWProperties.namespace  + '_' + BWProperties.participant.account_id + '_wiggle_button';

let emojiEvent = BWProperties.namespace + '_emoji_event';

let emojiHex = '&#128512';

let events = [];

function sendEmojiOnScreen(icon) {

    let emoji = document.createElement('div');

    emoji.innerHTML = `
   	<div class="flying-emojis">
  		<div class="emoji wiggle-1">
    		${icon}
  		</div>
	</div>
  `;
    let container = document.getElementById(wiggleContainerID);
    container.appendChild(emoji);

    setTimeout(() => {
        container.removeChild(emoji);
    }, 5000);
}

function convertToHex(emoji){
  	return emoji.codePointAt(0).toString(16);
}

function convertFromHex(hex){
  	return String.fromCodePoint("0x"+hex);
}

function init() {

    let margin = 10;
  
  	document.getElementById(wiggleButtonID).innerHTML = emojiHex;

    let selector = new emojiButtonList(wiggleButtonID, {
        dropDownYAlign: "top",
        dropDownXAlign: "left",
        onEmojiClick: function(emojiText) {

            sendEmojiOnScreen(emojiText);

            BWEvents.publish(emojiEvent, {
                emoji: convertToHex(emojiText)
            }).then(response => {
                events.push(response.id);
            });

        },
        yAlignMargin: margin,
        xAlignMargin: margin
    });
}

BWEvents.subscribe(emojiEvent, 'listener_1', function(response, message_id) {
    if (!events.includes(message_id)) {

        if (response.emoji) {
            sendEmojiOnScreen(convertFromHex(response.emoji));
        }

        events.push(message_id);
    }
});

init();
