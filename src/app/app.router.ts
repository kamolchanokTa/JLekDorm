import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoadFileDorm2Components } from './components/load-file-dorm2/load-file-dorm2.component';

const appRoutes: Routes = [
    { path: '', redirectTo: '/load-dorm2', pathMatch: 'full' },
    { path: 'load-dorm2', component: LoadFileDorm2Components},
]

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class RouteModule { }