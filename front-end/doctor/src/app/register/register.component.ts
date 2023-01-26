import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { MatOptionSelectionChange } from '@angular/material/core';
import { MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { MatRadioChange } from '@angular/material/radio';
import { Router } from '@angular/router';
import { PostService } from 'src/services/post.service';
import { GetService } from 'src/services/get.service';
import { C } from '@angular/cdk/keycodes';
import { threadId } from 'worker_threads';

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
  providers: [
    {
      provide: MAT_RADIO_DEFAULT_OPTIONS,
      useValue: { color: 'primary' },
    },
  ],
})
export class RegisterComponent implements OnInit {
  signOrLog: any | string = 'signup';

  personal_id: string | any;
  email: string | any;

  tabs = ['SignUp', 'Login'];
  selected = new FormControl(0);
  form1: FormGroup | any;
  form2: FormGroup | any;

  hasHealth: boolean = false;

  selectedValue: string | any;

  radioSelected: any;
  stateSelectedId: any;
  citySelectedId: any;
  healthSelectedId: any = null;
  genderSelectedId: any;

  states: [] | any;
  cities: [] | any;
  health: [] | any;

  hide = true;
  is_doctor: any;
  doctor_code: any;
  experties: any;
  is_doctor_login : any;

  gender: choice[] = [
    { value: '1', viewValue: 'Female' },
    { value: '0', viewValue: 'Male' },
  ];
  select: string | any;

  constructor(
    private post: PostService,
    private get: GetService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.get.getStates().subscribe({
      next: (res) => {
        this.states = res;
      },
    });

    this.get.getHealthInsuranceCompany().subscribe({
      next: (res) => {
        this.health = res;
      },
    });

    this.initForm1();
    this.initForm2();
  }

  private initForm1() {
    this.form1 = new FormGroup({
      nationalCode: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      birthDate: new FormControl('', [
        Validators.required,
        Validators.maxLength(10),
        Validators.minLength(10),
        Validators.pattern('^[0-9]{4}-[0-9]{2}-[0-9]{2}$'),
      ]),
      contactNumber: new FormControl('', [Validators.required]),
      email: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(50),
        Validators.pattern(
          '^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$'
        ),
      ]),
      zipCode: new FormControl('', [Validators.required]),
      insuranceId: new FormControl(''),
      doctor_code: new FormControl(''),
      experties: new FormControl(''),
    });
  }

  private initForm2() {
    this.form2 = new FormGroup({
      nationalCode: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  isDoctorChange(data: MatRadioChange){
    this.is_doctor = data.value;
    console.log(this.is_doctor);
  }

  isDoctorLoginChange(data: MatRadioChange){
    this.is_doctor_login = data.value;
    console.log(this.is_doctor_login);
  }

  radioButtonChange(data: MatRadioChange) {
    console.log(data.value);
    if (data.value == 'SelfPay') {
      this.hasHealth = false;
    } else {
      this.hasHealth = true;
    }
    console.log(this.hasHealth);
    this.radioSelected = data.value;
  }

  genderChange(data: MatOptionSelectionChange) {
    console.log(data);
    this.genderSelectedId = data;
  }

  cityChange(data: MatOptionSelectionChange) {
    console.log(data);
    this.citySelectedId = data;
  }

  stateChange(data: MatOptionSelectionChange) {
    console.log(data);
    this.stateSelectedId = data;
    const j = {
      province_id: this.stateSelectedId,
    };
    this.post.getCities(j).subscribe({
      next: (res) => {
        this.cities = res;
      },
    });
  }

  healthChange(data: MatOptionSelectionChange) {
    console.log(data);
    this.healthSelectedId = data;
  }


  public cl() {
    const invalid = [];
    const controls = this.form1.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            invalid.push(name);
        }
    }
    console.log(invalid);
}

  onSubmit1() {
    const signUpUserData = {
      personal_ID: this.form1.value.nationalCode,
      password: this.form1.value.password,
      first_name: this.form1.value.firstName,
      last_name: this.form1.value.lastName,
      email: this.form1.value.email,
      city: this.citySelectedId,
      contact_number: this.form1.value.contactNumber,
      gender: this.genderSelectedId,
      birth_date: this.form1.value.birthDate,
      has_health_insurance: this.hasHealth,
      zip_code: this.form1.value.zipCode,
      health_insurance_company: this.healthSelectedId,
      is_doctor: this.is_doctor,
      doctor_code: this.doctor_code,
      experties: this.experties,
    };

    console.log('userData', signUpUserData);
    this.post.signUpUser(signUpUserData).subscribe({
      next: (res) => {
        console.log('signUp res', res);
        localStorage.setItem('first_name', res.first_name);
        localStorage.setItem('last_name',res.last_name);
        localStorage.setItem('email',res.email);
        localStorage.setItem('birth_date',res.birth_date);
        localStorage.setItem('gender',res.gender);
        localStorage.setItem('contact_number',res.contact_number);
        localStorage.setItem('zip_code',res.zip_code);
        localStorage.setItem('id',res.id);
        alert('You have signed up successfully ✅ Please log in now');
      },
      error: (err: any) => {
        console.log('error', err.error.detail);
        alert(
          'Sorry there is a problem with your sign Up ❌ \n' + err.error.detail
        );
      },
    });
  }

  onRegister1() {
    this.signOrLog = 'signup';
  }

  onRegister2() {
    this.signOrLog = 'login';
  }

  onSubmit2() {
    const signInUserData = {
      personal_ID: this.form2.value.nationalCode,
      password: this.form2.value.password,
    };
    console.log(signInUserData);
    this.post.loginUser(signInUserData).subscribe({
      next: (res) => {
        console.log('Login res', res);
        localStorage.setItem('token', res.access);
        localStorage.setItem('is_doctor', this.is_doctor_login);
        alert('You have logged ln successfully ✅ Welcome');
        if(this.is_doctor_login == 'false')
          this.router.navigate(['/dashboard']);
        else
          this.router.navigate(['/doctorDashboard']);

      },
      error: (err: any) => {
        console.log('error', err.error.detail);
        alert(
          'Sorry there is a problem with your log in ❌ \n' + err.error.detail
        );
      },
    });
  }
}
