import { Routes } from '@angular/router';
import { VinilComponent } from './vinil/vinil.component';
import { LoginComponent } from './login/login.component';
import { TimelineComponent } from './timeline/timeline.component';
import { ServicesComponent } from './services/services.component';
import { LetsTalkComponent } from './lets-talk/lets-talk.component';
import { AboutComponent } from './about/about.component';

export const routes: Routes = [
  {
    path: '',
    component: VinilComponent,
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'timeline',
    component: TimelineComponent
  },
  {
    path: 'services',
    component: ServicesComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'letstalk',
    component: LetsTalkComponent
  }
];

 