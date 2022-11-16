import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, FormBuilder } from '@angular/forms';
import { MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';

interface choice {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [{
    provide: MAT_RADIO_DEFAULT_OPTIONS,
    useValue: { color: 'primary' },
}]
})
export class RegisterComponent implements OnInit {
  tabs = ['SignUp', 'Login'];
  selected = new FormControl(0);
  form: FormGroup | any;

  selectedValue: string | any;

  gender: choice[] = [
    {value: 'Female', viewValue: 'Female'},
    {value: 'Male', viewValue: 'Male'},
  ];

  state: choice[] = [
    {value: 'state1', viewValue: 'state1'},
    {value: 'state2', viewValue: 'state2'},
    {value: 'state3', viewValue: 'state3'},
    {value: 'state4', viewValue: 'state4'},
  ];

  city: choice[] = [
    {value: 'city1', viewValue: 'city1'},
    {value: 'city2', viewValue: 'city2'},
    {value: 'city3', viewValue: 'city3'},
    {value: 'city4', viewValue: 'city4'},
  ];

  select: string | any;

  constructor() { }

  ngOnInit(): void {
    this.initform();
  }

  private initform(){
    let surveyTitle = '';

    this.form = new FormGroup({
      'surveyTitle': new FormControl(surveyTitle, [Validators.required]),
 })
  }


}
