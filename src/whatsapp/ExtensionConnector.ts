import {browser} from "webextension-polyfill-ts";
import {BridgePortType, WWAProviderCall, WWAProviderResponse} from "./types";
import {generateBasicWWARequest} from "./Utils";
import {Chat} from "./model/Chat";

// TODO from callback hell to Promise hell :)
type PromiseProto = {
  resolve: (value: WWAProviderResponse) => unknown;
  reject: (value: WWAProviderResponse) => unknown;
};

const requestIdToPromiseProto = {};
const pageBridgePort = browser.runtime.connect('%%EXTENSION_GLOBAL_ID%%', { name: BridgePortType.WWA_EXTENSION_CONNECTOR });

pageBridgePort.onMessage.addListener((response: WWAProviderResponse) => {
  const requestId = response.id;
  if (requestId) {
    const callback = requestIdToPromiseProto[requestId];
    if (callback && response.result) {
      callback(response.result);
    }
    delete requestIdToPromiseProto[response.id]
  }
});

function callProviderFunctionWithCallback(call: WWAProviderCall, args: any[], callback?: (result: any) => void) {
  const request = generateBasicWWARequest(call, args);
  requestIdToPromiseProto[request.id] = callback;
  pageBridgePort.postMessage(request);
}

export function findChatByTitle(chatTitle: string, callback?: (chat: Chat) => void): void {
  callProviderFunctionWithCallback(WWAProviderCall.findChatByTitle, [chatTitle], callback);
}

export function updateChatModels(chats: Chat[], callback?: (chats: Chat[]) => void) {
  callProviderFunctionWithCallback(WWAProviderCall.updateChatModels, [chats], callback);
}

export function muteChatLocally(chat: Chat, callback?: () => void) {
  callProviderFunctionWithCallback(WWAProviderCall.muteChatLocally, [chat], callback);
}

export function unmuteChatsLocally(chats: Chat[], callback?: () => void) {
  callProviderFunctionWithCallback(WWAProviderCall.unmuteChatsLocally, [chats], callback);
}

export function muteNonMutedChatsExceptChats(callback?: (mutedChats: Chat[]) => void, ...chats: Chat[]) {
  callProviderFunctionWithCallback(WWAProviderCall.muteNonMutedChatsExceptChat, [chats], callback);
}

export function archiveChatLocally(contactName: string, callback?: () => void) {
  callProviderFunctionWithCallback(WWAProviderCall.archiveChatLocallyByTitle, [contactName], callback);
}

export function unarchiveChatLocally(contactName: string, callback?: () => void) {
  callProviderFunctionWithCallback(WWAProviderCall.unarchiveChatLocallyByTitle, [contactName], callback);
}

export function getChatById(chatId: string, callback?: (chat: Chat) => void): void {
  callProviderFunctionWithCallback(WWAProviderCall.getChatById, [chatId], callback);
}

export function muteAndArchiveChatLocally(chat: Chat, callback?: () => void) {
  callProviderFunctionWithCallback(WWAProviderCall.muteAndArchiveChatLocally, [chat, true, true], callback);
}

export function unmuteAndUnarchiveChatLocally(chat: Chat, callback?: () => void) {
  callProviderFunctionWithCallback(WWAProviderCall.muteAndArchiveChatLocally, [chat, false, false], callback);
}

export function openChat(chat: Chat, callback?: () => void) {
  callProviderFunctionWithCallback(WWAProviderCall.openChat, [chat], callback);
}

export function refreshWWChats(callback?: () => void) {
  callProviderFunctionWithCallback(WWAProviderCall.refreshWWChats, [], callback);
}
