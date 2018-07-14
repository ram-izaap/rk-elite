import { Directive, ElementRef, Renderer, Input  } from '@angular/core';


@Directive({
  selector: '[tabs]' // Attribute selector
})
export class TabsDirective {

  @Input() myHidden: boolean;
  
  constructor(el: ElementRef, 
         renderer: Renderer) {

    console.log('Hello TabsDirective Directive');

    // Use renderer to render the element with styles
    renderer.setElementStyle(el.nativeElement, 'display', 'none');
  }

}
