import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GetService } from 'src/services/get.service';
import { PostService } from 'src/services/post.service';

@Component({
  selector: 'app-doctor-dashboard',
  templateUrl: './doctor-dashboard.component.html',
  styleUrls: ['./doctor-dashboard.component.scss']
})
export class DoctorDashboardComponent implements OnInit {
  firstName: any = localStorage.getItem('first_name');
  lastName: any = localStorage.getItem('last_name');
  email: any = localStorage.getItem('email');
  birth_data: any = localStorage.getItem('birth_date');
  gender: any = localStorage.getItem('gender');
  contact_number: any = localStorage.getItem('contact_number');
  zip_code:any = localStorage.getItem('zip_code');
  is_doctor:any = localStorage.getItem('is_doctor');

  buttonContent: string | any = 'none';
  patients: any;
  IsSelectPatient: any;
  messages:any;
  newMessageContent:any;

  constructor(private get: GetService, private post: PostService, private router:Router) { }

  ngOnInit(): void {
  }
  onLogoClick(){

  }

  onLogOut(){
    localStorage.removeItem('token');
    localStorage.removeItem('last_name');
    localStorage.removeItem('birth_date');
    localStorage.removeItem('gender');
    localStorage.removeItem('zip_code');
    localStorage.removeItem('first_name');
    localStorage.removeItem('email');
    localStorage.removeItem('contact_number');
    localStorage.removeItem('is_doctor');
    localStorage.removeItem('id');
    this.router.navigate(['/'])
  }

  buttonClicked(str: string){
    this.buttonContent = str;
    console.log("button", this.buttonContent);
  }

  onPatientChat(id: any){

  }

  onBackChat(){

  }

  onSendMessage(){

  }
}
