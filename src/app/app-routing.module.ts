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
    path: 'cartao-de-credito',
    canActivate: [authGuard],
    data: {title: 'Cartões de Crédito'},
    loadChildren: () =>
    import('./features/pages/credit-card/credit-card.module').then((x)=> x.CreditCardModule)
  },


  {
    path: 'membros-da-familia',
    canActivate: [authGuard],
    data: {title: 'Membros da Família'},
    loadChildren: () =>
    import('./features/pages/family-members/family-members.module').then((x)=> x.FamilyMembersModule)
  },

  {
    path: 'configuracoes-de-usuario',
    canActivate: [authGuard],
    data: {title: 'Usuário'},
    loadChildren: () =>
    import('./features/pages/user/user.module').then((x)=> x.UserModule)
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
