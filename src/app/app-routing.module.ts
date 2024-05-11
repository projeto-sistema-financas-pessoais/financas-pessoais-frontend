import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [

      {path: '', redirectTo: '/cadastro', pathMatch:'full'},
      {path: '**', redirectTo:'/cadastro'},
  
  {
    path: 'cadastro',
      loadChildren: () =>
        import('./features/auth/auth.module').then((x) => x.AuthModule),
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
