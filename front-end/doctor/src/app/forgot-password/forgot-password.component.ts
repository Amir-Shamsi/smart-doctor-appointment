import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PostService } from 'src/services/post.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  form: FormGroup | any;
  constructor(private post:PostService, private router: Router) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(){
    this.form = new FormGroup({
      'personal_ID' : new FormControl('', [Validators.required]),
      'email' :new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(50),
        Validators.pattern(
          '^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$'
        ),
      ]),
    })
  }

  onSubmit(){
    const forgotPassword = {
      "personal_ID" : this.form.value.personal_ID,
      "email" : this.form.value.email,
    }
    console.log(forgotPassword);
    this.post.forgotPassword(forgotPassword).subscribe(res => {console.log(res);})
    //this.router.navigate(['register'])
  }

}
