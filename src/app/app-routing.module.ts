import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [

  {path: '', redirectTo: 'login', pathMatch:'full'},
  // {path: '**', redirectTo:'login'},

  {
    path: 'login',
      loadChildren: () =>
        import('./features/auth/auth.module').then((x) => x.AuthModule),
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
