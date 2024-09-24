import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';


const routes: Routes = [

  {path: '', redirectTo: 'login', pathMatch:'full'},
  // {path: '**', redirectTo:'inicio'},

  {
    path: 'inicio',
    canActivate: [authGuard],
    data: {title: 'Início'},
    loadChildren: () =>
    import('./features/pages/landing-page/landing-page.module').then((x)=> x.LandingPageModule)
  },


  {
    path: 'contas',
    canActivate: [authGuard],
    data: {title: 'Contas'},
    loadChildren: () =>
    import('./features/pages/account/account.module').then((x)=> x.AccountModule)
  },
  {
    path: 'login',
    data: {title: 'Finanças Pessoais'},

      loadChildren: () =>
        import('./features/auth/auth.module').then((x) => x.AuthModule),
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
