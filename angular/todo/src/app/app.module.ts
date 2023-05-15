import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppComponent } from './app.component'
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module'
import { AuthComponent } from './components/auth/auth.component';
import { AccountComponent } from './components/account/account.component';
import { AvatarComponent } from './components/avatar/avatar.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { TodoComponent } from './components/todo/todo.component';

@NgModule({
  declarations: [AppComponent, AuthComponent, AccountComponent, AvatarComponent, HomeComponent, NavbarComponent, FooterComponent, TodoComponent],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }