import { Component, OnInit } from '@angular/core';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  //The singleton MessageService will be injected when HeroService is created 
  // The messageService must be public because it is used to bind to the template
  // Note: Angular only binds to public component properties
  constructor(public messageService: MessageService) { }

  ngOnInit() {
  }

}
