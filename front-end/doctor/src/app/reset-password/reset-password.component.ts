import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  form: FormGroup | any;
  constructor() { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(){
    this.form = new FormGroup({
      'password' : new FormControl('', [Validators.required]),
      'confirm_password' :new FormControl('', [Validators.required]),
    })
  }

  onSubmit(){
    
  }
}
