import { Component, Input, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { AuthService } from '../auth/shared/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() pageTitle: string = "Finanças Pessoais";
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  isMobile: boolean = true;
  isCollapsed: boolean  = true;
  chargeHtml: boolean = false;


  constructor(
    private readonly observer: BreakpointObserver,
    public authService: AuthService,
    ) {}

  ngOnInit() {
    this.observer.observe(['(max-width: 801px)']).subscribe((screenSize) => {
      if(screenSize.matches){
        this.isMobile = true;
      } else {
        this.isMobile = false;
        const colapse = JSON.parse(localStorage.getItem('collapsed')!) as boolean;
        this.isCollapsed = colapse
      }

    });


    setTimeout( () =>{
      this.chargeHtml = true;

    },500)

    
    
  }

  toggleMenu() {
    if(this.isMobile){
      this.sidenav.toggle();
      this.isCollapsed = false; // On mobile, the menu can never be collapsed
    } else {
      this.sidenav.open(); // On desktop/tablet, the menu can never be fully closed
      this.isCollapsed = !this.isCollapsed;
    }

    localStorage.setItem('collapsed', JSON.stringify(this.isCollapsed));

    console.log("this.is collaspse", this.isCollapsed)

  }

  logout(){
    this.authService.logout();
  }


}
