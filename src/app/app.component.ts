import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  pageTitle: string = '';  // Título padrão

  constructor(private readonly router: Router, private readonly route : ActivatedRoute) {}

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const routeData = this.route.root.firstChild?.snapshot.data;
        this.pageTitle = routeData?.['title'] || '';  // Define o título baseado nos dados da rota
      });
  }
}
