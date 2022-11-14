import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

interface Type {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  types: Type[] = [
    {value: 'user', viewValue: 'حقیقی'},
    {value: 'legal', viewValue: 'حقوقی'},
  ];
  select :any;
  userControl = new FormControl(this.types[0].value);

  form = new FormGroup({
    user: this.userControl,

  });

  constructor() { }

  ngOnInit(): void {
  }

}
