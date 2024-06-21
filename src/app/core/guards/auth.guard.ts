import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { inject } from "@angular/core";
import { AlertModalService } from "src/app/shared/services/alert-modal.service";
import { AuthService } from "src/app/features/auth/shared/services/auth.service";

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  if (inject(AuthService).token())
    return true;
  else {
    inject(AlertModalService).showAlertInfo('Você precisa fazer o login antes!');
    return inject(Router).createUrlTree(['/login']);
  }
};
