import { Component } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize, last, switchMap, tap } from 'rxjs/operators';
import {  OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-chat',
  standalone: false,
  templateUrl: './chat.html',
  styleUrl: './chat.scss'
})
export class Chat {
  @ViewChild('dfMessengerContainer', { static: true }) dfMessengerContainer!: ElementRef;
 
  constructor(private renderer: Renderer2) { }
 
  ngOnInit(): void {
    // You can perform any initialization logic here if needed.
  }
 
  ngAfterViewInit(): void {
    // Dynamically create and append the script and df-messenger elements
    // This ensures they are loaded and rendered within Angular's lifecycle.
 
    // 1. Create the link element for the stylesheet
    const linkElement = this.renderer.createElement('link');
    this.renderer.setAttribute(linkElement, 'rel', 'stylesheet');
    this.renderer.setAttribute(linkElement, 'href', 'https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/themes/df-messenger-default.css');
    this.renderer.appendChild(document.head, linkElement); // Append to document head
 
    // 2. Create the script element for df-messenger.js
    const scriptElement = this.renderer.createElement('script');
    this.renderer.setAttribute(scriptElement, 'src', 'https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/df-messenger.js');
    this.renderer.appendChild(document.body, scriptElement); // Append to document body or head
 
    // 3. Create the df-messenger element
    const dfMessengerElement = this.renderer.createElement('df-messenger');
    this.renderer.setAttribute(dfMessengerElement, 'location', 'us-central1');
    this.renderer.setAttribute(dfMessengerElement, 'project-id', 'still-manifest-466507-k0');
    this.renderer.setAttribute(dfMessengerElement, 'agent-id', '270c715b-7ce4-4223-88eb-9d1de1bb9f2c');
    this.renderer.setAttribute(dfMessengerElement, 'language-code', 'en');
    this.renderer.setAttribute(dfMessengerElement, 'max-query-length', '-1');
 
    // Create the df-messenger-chat-bubble child element
    const chatBubbleElement = this.renderer.createElement('df-messenger-chat-bubble');
    this.renderer.setAttribute(chatBubbleElement, 'chat-title', 'Project Raseed AI Assistant');
    this.renderer.appendChild(dfMessengerElement, chatBubbleElement);
 
    // Append the df-messenger element to its container in the template
    this.renderer.appendChild(this.dfMessengerContainer.nativeElement, dfMessengerElement);
  }
 
  ngOnDestroy(): void {
    // Optional: Clean up elements if the component is destroyed.
    // This might be more complex for df-messenger as it's a global web component.
    // For most cases, leaving it active if the component is used across the app is fine.
  }
}
