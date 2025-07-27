import { NgModule,importProvidersFrom ,makeEnvironmentProviders,provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing-module';
import { HttpClientModule } from '@angular/common/http';
import { App } from './app';
import { Home } from './home/home';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ToastrModule } from 'ngx-toastr';
import { firebaseConfig } from '../environments/firebase';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { Login } from './login/login';
import { Chat } from './chat/chat';
import { ReceiptHistory } from './receipt-history/receipt-history';
import { GroceryList } from './grocery-list/grocery-list';
import { Notifications } from './notifications/notifications';
import { Test } from './test/test';
import { Insights } from './insights/insights';
import {
  CUSTOM_ELEMENTS_SCHEMA
} from '@angular/core';

@NgModule({
  declarations: [
    App,
    Home,
    Login,
    Chat,
    ReceiptHistory,
    GroceryList,
    Notifications,
    Test,
    Insights
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-left',
      enableHtml: true,
      toastClass: 'ngx-toastr custom-toast',
      timeOut: 3000,
      preventDuplicates: true,
      closeButton: true,

    }),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireStorageModule,
    AngularFireAuthModule,
    FormsModule,
    MatIconModule,
    BrowserAnimationsModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideClientHydration(withEventReplay()),
  ],
  bootstrap: [App],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA 
  ]
})
export class AppModule { }
