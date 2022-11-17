import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, FormBuilder } from '@angular/forms';
import { MatOptionSelectionChange } from '@angular/material/core';
import { MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { MatRadioChange } from '@angular/material/radio';

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
  form1: FormGroup | any;
  form2: FormGroup | any;

  selectedValue: string | any;

  radioSelected : any;
  stateSelected : any;
  citySelected : any;
  healthSelected : any;
  genderSelected : any;

  hide = true;

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

  Health: choice[] = [
    {value: 'Health1', viewValue: 'Health1'},
    {value: 'Health2', viewValue: 'Health2'},
    {value: 'Health3', viewValue: 'Health3'},
    {value: 'Health4', viewValue: 'Health4'},
  ]
  select: string | any;

  constructor() { }

  ngOnInit(): void {
    this.initForm1();
    this.initForm2();
  }

  private initForm1(){
    this.form1 = new FormGroup({
      'nationalCode': new FormControl('', [Validators.required]),
      'password': new FormControl('' , [Validators.required]),
      'firstName': new FormControl('', [Validators.required]),
      'lastName': new FormControl('', [Validators.required]),
      'birthDate': new FormControl('', [Validators.required]),
      'contactNumber': new FormControl('', [Validators.required]),
      'email': new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(50),
        Validators.pattern(
          '^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$'
        ),
      ]),
      'zipCode': new FormControl('', [Validators.required]),
      'insuranceId': new FormControl('', [Validators.required]),
 })
}

private initForm2(){
  this.form2 = new FormGroup({
    'nationalCode': new FormControl('', [Validators.required]),
      'password': new FormControl('' , [Validators.required]),
  })
}

radioButtonChange(data: MatRadioChange) {
  console.log(data.value);
    this.radioSelected = data.value;
}

genderChange(data: MatOptionSelectionChange){
  console.log(data);
  this.genderSelected = data;
}

cityChange(data: MatOptionSelectionChange){
  console.log(data);
  this.citySelected = data;
}

stateChange(data: MatOptionSelectionChange){
  console.log(data);
  this.stateSelected = data;
}

healthChange(data: MatOptionSelectionChange){
  console.log(data);
  this.healthSelected = data;
}

onSubmit1(){
  console.log(this.form1.value);
}

onSubmit2(){
  console.log(this.form2.value);
}

}
