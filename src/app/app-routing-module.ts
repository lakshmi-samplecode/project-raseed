import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './login/login';
import { Chat } from './chat/chat';
import { ReceiptHistory } from './receipt-history/receipt-history';
import { GroceryList } from './grocery-list/grocery-list';
import { Notifications } from './notifications/notifications';
import { Test } from './test/test';
import { Insights } from './insights/insights';

const routes: Routes = [
  {path:'',component:Login},
  {path:'home',component:Home},
  {path:'receipt',component:ReceiptHistory},
  {path:'shopping-list',component:GroceryList},
  {path:'chat',component:Chat},
  {path:'insights',component:Insights},
  {path:'notification',component:Notifications},
  {path:'test',component:Test},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
