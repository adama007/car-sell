import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent   {
  title="Car-Sell";

  getTitle(): string{
    return this.title;
     
  }

}
