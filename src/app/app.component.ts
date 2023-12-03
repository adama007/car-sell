import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'car-sell';
  myparagraph="a";
  text="";
  display=false;
  onClickButton (): void{
    this.text="salut!!"

  };  
  onClickButto (): void{
    this.display=this.display ? false  :true
  };  

cars=[

      {id:1,
        marque:"renault",
        prix:120},

        {id:2,
        marque:"clio",
        prix:120},
        
        {id:3,
        marque:"camaro",
        prix:120}



]


}
