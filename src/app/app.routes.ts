import { Routes } from '@angular/router';
import { VinilComponent } from './vinil/vinil.component';
import { LoginComponent } from './login/login.component';
import { Component } from '@angular/core';
import { TimelineComponent } from './timeline/timeline.component';

export const routes: Routes = [
  {
    path: '',
    component: VinilComponent,
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "timeline",
    component: TimelineComponent
  }
];

 