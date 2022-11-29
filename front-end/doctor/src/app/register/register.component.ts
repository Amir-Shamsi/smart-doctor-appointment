import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, FormBuilder, NgForm, FormGroupDirective } from '@angular/forms';
import { ErrorStateMatcher, MatOptionSelectionChange } from '@angular/material/core';
import { MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { MatRadioChange } from '@angular/material/radio';
import { Router } from '@angular/router';
import { AnyTxtRecord } from 'dns';
import { PostService } from 'src/services/post.service';
import { GetService } from 'src/services/get.service';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Inject} from '@angular/core';
import {MatSnackBar, MatSnackBarRef} from '@angular/material/snack-bar';

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
    useValue: { color: 'primary' },
}]
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
  citySelected : any;
  healthSelected : any;
  genderSelected : any;

  states: [] | any;
  cities: [] | any;

  hide = true;

  gender: choice[] = [
    {value: 'Female', viewValue: 'Female'},
    {value: 'Male', viewValue: 'Male'},
  ];

  Health: choice[] = [
    {value: 'Arman Insurance', viewValue: 'Arman Insurance'},
    {value: 'Asia Insurance', viewValue: 'Asia Insurance'},
    {value: 'Alborz Insurance', viewValue: 'Alborz Insurance'},
    {value: 'Omid Insurance', viewValue: 'Omid Insurance'},
    {value: 'Iran Insurance', viewValue: 'Iran Insurance'},
    {value: 'Parsian Insurance', viewValue: 'Parsian Insurance'},
    {value: 'Pasargad Insurance', viewValue: 'Pasargad Insurance'},
    {value: 'Hafez Insurance', viewValue: 'Hafez Insurance'},
    {value: 'Dana Insurance', viewValue: 'Dana Insurance'},
    {value: 'Razi Insurance', viewValue: 'Razi Insurance'},
    {value: 'Saman Insurance', viewValue: 'Saman Insurance'},
    {value: 'Sina Insurance', viewValue: 'Sina Insurance'},
    {value: 'Ma Insurance', viewValue: 'Ma Insurance'},
    {value: 'Moalem Insurance', viewValue: 'Moalem Insurance'},
    {value: 'Melat Insurance', viewValue: 'Melat Insurance'},

  ]
  select: string | any;

  constructor(private _snackBar: MatSnackBar,private post: PostService, private get: GetService, private _router :Router,public dialog: MatDialog) { }

  ngOnInit(): void {
    this.get.getStates().subscribe({
      next: res => {
        console.log("States", res);
        this.states = res;
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
  this.genderSelected = data;
}

cityChange(data: MatOptionSelectionChange){
  console.log(data);
  this.citySelected = data;
}


stateChange(data: MatOptionSelectionChange){
  console.log(data);
  this.stateSelectedId = data;
  const j = {
      "province_id": this.stateSelectedId
    }
    this.get.getCities(j).subscribe({
      next: res => {
        console.log("cities", res);
        this.cities = res.city_set;
        console.log(this.cities);
      }
         })
}

healthChange(data: MatOptionSelectionChange){
  console.log(data);
  this.healthSelected = data;
}

onSubmit1(){

  const signUpUserData = {
    "nationalCode": this.form1.value.nationalCode,
    "password": this.form1.value.password,
    "firstName":this.form1.value.firstName,
    "lastName":this.form1.value.lastName,
    "email": this.form1.value.email,
    "city": this.citySelected,
    "contactNumber": this.form1.value.contactNumber,
    "gender": this.genderSelected,
    "birthDate": this.form1.value.birthDate,
    "hasHealthInsurance":this.hasHealth,
    "zipCode":this.form1.value.zipCode,
    "healthInsuranceCompany":this.healthSelected,
  };
  console.log(signUpUserData);
  // this._url.signUpUser(signUpUserData).subscribe(
  //   res=>{console.log(res);
  //     //localStorage.setItem('token', res.token);
  //     this._router.navigate(['/dashboard']);
  //   },
  //       )
  console.log("signUpUserData",signUpUserData);
 }

onSubmit2(){
  console.log(this.form2.value);
}

openDialog() {
  const dialogRef = this.dialog.open(DialogOverviewExampleDialog,
    {
      width: '380px',
    });
}
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    //condition true
    const isSubmitted = form && form.submitted;
    //false
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
//Dialog Component
@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
})
export class DialogOverviewExampleDialog {
  [x: string]: any;
  durationInSeconds = 5;
  constructor(public dialogRef: MatDialogRef<DialogOverviewExampleDialog>) {}
  //Dialog close function
  onNoClick(): void {
    this.dialogRef.close();
  }
   /*Form validations*/
   personal_id = new FormControl('', [
    Validators.required,
    ]);
    email = new FormControl('', [
      Validators.required,
      Validators.email,
    ]);

    onSendEmail(){
      //call send email api
      console.log("Api Called");
      console.log(this.personal_id.value,this.email.value);
      this.dialogRef.close();
    }

    matcher = new MyErrorStateMatcher();
}


