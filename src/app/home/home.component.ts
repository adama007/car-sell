import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardComponent } from '../admin/dashboard/dashboard.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor (
    private router:Router,
    private dashboardComponenet:DashboardComponent
    
    ){ }
  ngOnInit(): void {

  }

  onlogin(): void {
    //this.router.navigate(['/admin' , 'dashboard']);
    this.router.navigateByUrl('admin/dashboard')
  }

}
