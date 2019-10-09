import { Directive, Input, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[hover-class]'
})
export class HoverClassDirective {

  @Input('hover-class') hoverClass: any;

  constructor(public elementRef: ElementRef) { }

  //Klasse bei Mouseenter setzen
  @HostListener('mouseenter') onMouseEnter() {
    this.elementRef.nativeElement.classList.add(this.hoverClass);
  }

  //Klasse bei Mouseleave entfernen
  @HostListener('mouseleave') onMouseLeave() {
    this.elementRef.nativeElement.classList.remove(this.hoverClass);
  }

}
