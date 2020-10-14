import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { TrackerComponent } from './pages/tracker/tracker.component';

const routes: Routes = [
  {path: '', pathMatch: 'full' ,component: HomeComponent},
  {path: 'about',component: TrackerComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
