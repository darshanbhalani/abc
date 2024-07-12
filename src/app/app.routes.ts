import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ConfigurationsComponent } from './components/configurations/configurations.component';
import { OverspeedComponent } from './components/incidents/overspeed/overspeed.component';
import { AqiComponent } from './components/incidents/aqi/aqi.component';
import { TemperatureComponent } from './components/incidents/temperature/temperature.component';
import { ResolveincidentComponent } from './components/incidents/resolveincident/resolveincident.component';

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, 
    { path: 'dashboard', component: DashboardComponent },
    { path: 'configurations', component: ConfigurationsComponent },
    {
        path: 'incident/overspeed',
        component: OverspeedComponent
    },
    {
        path: 'incident/aqi',
        component: AqiComponent
    },
    {
        path: 'incident/temperature',
        component: TemperatureComponent
    },
    {
        path: 'incident/overspeed/resolveincident',
        component: ResolveincidentComponent
    },
   
];
