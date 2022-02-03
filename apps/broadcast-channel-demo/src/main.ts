import BroadcastChannel from '@lnsd/broadcast-channel';

const channel = new BroadcastChannel<string>('demo');
channel.onmessage = function(message) {
  displayReceivedMessage(message.data);
};

const messageInput = <HTMLInputElement>document.getElementById('message-input');
const submitButton = <HTMLInputElement>document.getElementById('submit-button');
const messagesBox = document.getElementById('messages');

messageInput.onkeyup = function (event) {
  const message = messageInput.value;

  if (message !== '' && event.key === 'Enter') {
    postMessage(message);
    clearMessageInput();
    disableSubmitButton();
    return;
  }

  if (message === '') {
    disableSubmitButton();
  } else {
    enableSubmitButton();
  }
};

submitButton.onclick = function () {
  const message = messageInput.value;
  if (message === '') {
    return;
  }

  postMessage(message);
  clearMessageInput();
  disableSubmitButton();
};

function postMessage(message: string) {
  if (message === '') {
    return;
  }

  channel.postMessage(message);
  displayEmittedMessage(message);
}

function disableSubmitButton() {
  submitButton.classList.add('is-disabled');
}

function enableSubmitButton() {
  submitButton.classList.remove('is-disabled');
}

function clearMessageInput() {
  messageInput.value = '';
}

function messageBalloon(message: string, side: 'left' | 'right'): HTMLElement {
  const section = document.createElement('div');
  section.classList.add('message');
  section.classList.add(`-${side}`);

  const balloon = document.createElement('div');
  balloon.classList.add('nes-balloon');
  balloon.classList.add(`from-${side}`);

  const messageContainer = document.createElement('p');

  const text = document.createTextNode(message);

  section.appendChild(balloon);
  balloon.appendChild(messageContainer);
  messageContainer.appendChild(text);

  return section;
}

function displayEmittedMessage(message: string): void {
  const balloon = messageBalloon(message, 'left');
  messagesBox.appendChild(balloon);
}

function displayReceivedMessage(message: string): void {
  const balloon = messageBalloon(message, 'right');
  messagesBox.appendChild(balloon);
}

