import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, FormBuilder, NgForm, FormGroupDirective } from '@angular/forms';
import { MatOptionSelectionChange } from '@angular/material/core';
import { MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { MatRadioChange } from '@angular/material/radio';
import { Router } from '@angular/router';
import { PostService } from 'src/services/post.service';
import { GetService } from 'src/services/get.service';
export interface DialogData {
  animal: string;
  name: string;
}

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
    useValue: { color: 'primary' },}
  ]
})
export class RegisterComponent implements OnInit {
  personal_id: string | any;
  email: string | any;

  tabs = ['SignUp', 'Login'];
  selected = new FormControl(0);
  form1: FormGroup | any;
  form2: FormGroup | any;

  hasHealth: boolean = false;

  selectedValue: string | any;

  radioSelected : any;
  stateSelectedId : any;
  citySelectedId : any;
  healthSelectedId : any;
  genderSelectedId : any;

  states: [] | any;
  cities: [] | any;
  health: [] | any;

  hide = true;

  gender: choice[] = [
    {value: '1', viewValue: 'Female'},
    {value: '0', viewValue: 'Male'},
  ];


  select: string | any;

  constructor(private post: PostService, private get: GetService, private _router :Router) { }

  ngOnInit(): void {
    this.get.getStates().subscribe({
      next: res => {
        this.states = res;
      }
        })

    this.get.getHealthInsuranceCompany().subscribe({
      next: res => {
        this.health = res;
          }
            })

    this.initForm1();
    this.initForm2();
  }

  private initForm1(){
    this.form1 = new FormGroup({
      'nationalCode': new FormControl('', [Validators.required]),
      'password': new FormControl('' , [Validators.required]),
      'firstName': new FormControl('', [Validators.required]),
      'lastName': new FormControl('', [Validators.required,]),
      'birthDate': new FormControl('', [Validators.required,
        Validators.maxLength(10),
        Validators.minLength(10),
        Validators.pattern('^[0-9]{4}-[0-9]{2}-[0-9]{2}$'),
      ]),
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
  if(data.value=="SelfPay"){
      this.hasHealth = false;
  }else{
    this.hasHealth = true;
  }
  console.log(this.hasHealth);
    this.radioSelected = data.value;
}

genderChange(data: MatOptionSelectionChange){
  console.log(data);
  this.genderSelectedId = data;
}

cityChange(data: MatOptionSelectionChange){
  console.log(data);
  this.citySelectedId = data;
}


stateChange(data: MatOptionSelectionChange){
  console.log(data);
  this.stateSelectedId = data;
  const j = {
      "province_id": this.stateSelectedId
    }
    this.post.getCities(j).subscribe({
      next: res => {
        this.cities = res;
      }
         })
}

healthChange(data: MatOptionSelectionChange){
  console.log(data);
  this.healthSelectedId = data;
}

onSubmit1(){

  const signUpUserData = {
    "personal_ID": this.form1.value.nationalCode,
    "password": this.form1.value.password,
    "first_name":this.form1.value.firstName,
    "last_name":this.form1.value.lastName,
    "email": this.form1.value.email,
    "city": this.citySelectedId,
    "contact_number": this.form1.value.contactNumber,
    "gender": this.genderSelectedId,
    "birth_date": this.form1.value.birthDate,
    "has_health_insurance":this.hasHealth,
    "zip_code":this.form1.value.zipCode,
    "health_insurance_company":this.healthSelectedId,
  };
  console.log(signUpUserData);
  this.post.signUpUser(signUpUserData).subscribe(
    res=>{console.log(res);
      //localStorage.setItem('token', res.token);
    },
        )
  console.log("signUpUserData",signUpUserData);
 }

onSubmit2(){
  const signInUserData = {
    "personal_ID": this.form2.value.nationalCode,
    "password": this.form2.value.password,
  }
  console.log(signInUserData);
  this.post.loginUser(signInUserData).subscribe(res => {console.log(res);})
}

}
