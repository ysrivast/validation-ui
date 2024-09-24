import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileRoutingModule } from './file/file-routing.module';
import { HomeModule } from './home/home.module';

const routes: Routes = [
  {path:'file', loadChildren: ()=>FileRoutingModule},
  {path:'', loadChildren: ()=>HomeModule}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
