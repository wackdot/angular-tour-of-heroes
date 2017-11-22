import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { HeroesComponent } from './heroes/heroes.component';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';

// Routes inform the router which view to display when the user clicks a
// link or pastes a URL into the browser address bar
// The router will match the URL to the path and display the
// corresponding component
const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'heroes', component: HeroesComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'detail/:id', component: HeroDetailComponent },
];


@NgModule({
  // Initialise the router and let it start listening for browser location changes
  // forRoot() provides the service providers and directves needed for routing and 
  // performs the initial navigation based on the current browser URL
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
