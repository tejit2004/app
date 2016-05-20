import {Page, MenuController} from 'ionic-angular';


@Page({
  templateUrl: 'build/pages/hello-ionic/hello-ionic.html'
})
export class HelloIonicPage {
  constructor(private menu: MenuController) {
    this.menu.swipeEnable(true);
  }
}
