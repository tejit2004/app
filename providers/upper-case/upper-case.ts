import { Directive, ElementRef, Renderer} from 'angular2/core';

/*
  Generated class for the UpperCase provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

@Directive({
  selector:'[upperCase][ngFormControl]',
  host:{'(keyup)':'onKeyUp()'}
})

export class UpperCase {


  constructor(private el:ElementRef, private renderer: Renderer) {}

  onKeyUp()
  {

      this.renderer.setElementStyle(this.el, 'text-transform', 'uppercase');
      console.log('Tej')
  }
}
