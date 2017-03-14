import {Router, RouterConfiguration} from 'aurelia-router';
import * as AdminLTE from 'admin-lte';

export class App {
  public router: Router;

  public configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'Aurelia';
    config.map([
      { route: ['', 'spiritvms'], name: 'spiritvms',      moduleId: 'modules/spirit/vms',      nav: true, title: 'SPIRIT VMs' },
      { route: 'spiritbuilds', name: 'spiritbuilds',      moduleId: 'modules/spirit/builds',      nav: true, title: 'SPIRIT Builds' }
    ]);

    this.router = router;
  }

    attached(){
      $.AdminLTE.layout.fix();
    }
}
