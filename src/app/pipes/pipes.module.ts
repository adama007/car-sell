import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirstCharUppercarsPipe } from './first-char-uppercars.pipe';
import { SafeUrlPipe } from './safe-url.pipe';



@NgModule({
  declarations: [
    FirstCharUppercarsPipe,
    SafeUrlPipe
  ],
  imports: [
    CommonModule
  ],
  exports:[
    FirstCharUppercarsPipe,
    SafeUrlPipe
  ]
})
export class PipesModule { }
