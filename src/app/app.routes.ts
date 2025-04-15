import { Routes } from '@angular/router';
import { TripPlanComponent } from './trip-plan/trip-plan.component';

export const routes: Routes = [
    { path:'',redirectTo:'trip-map',pathMatch:'full'},
    { path:'trip-map',component:TripPlanComponent }
];
