import { Injectable } from '@angular/core';

@Injectable()
export class MessageService {

  messages: string[] = [];

  // Stores the argument /input message and stores it in the
  // local property message 
  add(message: string) {
    this.messages.push(message);
  }

  // Clears all messages stored in the local message property
  // Basically every time the add method is called a new
  // string message is stored.
  clear() {
    this.messages = [];
  }
}
